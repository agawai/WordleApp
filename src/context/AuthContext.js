import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc 
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext({});

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (emailOrUsername, password) => {
    try {
      let email = emailOrUsername;
      
      // If input doesn't look like an email, assume it's a username
      if (!emailOrUsername.includes('@')) {
        // Query Firestore to get the email associated with the username
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', emailOrUsername.toLowerCase()));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          throw new Error('Invalid username or password.');
        }
        
        // Get the email from the user document
        email = querySnapshot.docs[0].data().email;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      }
      return userCredential;
    } catch (error) {
      console.error('Error in signIn:', error);
      if (error.message === 'Invalid username or password.') {
        throw error;
      }
      switch (error.code) {
        case 'auth/invalid-email':
          throw new Error('Invalid email address format.');
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          throw new Error('Invalid username/email or password.');
        case 'auth/too-many-requests':
          throw new Error('Too many failed attempts. Please try again later.');
        default:
          throw new Error('Failed to sign in. Please try again.');
      }
    }
  };

  const signUp = async (formData) => {
    try {
      // Check if username is already taken
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', formData.username.toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        throw new Error('Username is already taken.');
      }

      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Create user profile
      const userProfile = {
        username: formData.username.toLowerCase(),
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: `${formData.firstName} ${formData.lastName}`,
        createdAt: new Date().toISOString(),
        stats: {
          gamesPlayed: 0,
          gamesWon: 0,
          currentStreak: 0,
          maxStreak: 0,
          guessDistribution: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
          },
        },
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);
      setUserProfile(userProfile);
      return userCredential;
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  };

  const updateStats = async (won, numGuesses) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      const currentStats = userDoc.data().stats || {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0,
        guessDistribution: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
        },
      };

      const newStats = {
        gamesPlayed: currentStats.gamesPlayed + 1,
        gamesWon: currentStats.gamesWon + (won ? 1 : 0),
        currentStreak: won ? currentStats.currentStreak + 1 : 0,
        maxStreak: won 
          ? Math.max(currentStats.maxStreak, currentStats.currentStreak + 1)
          : currentStats.maxStreak,
        guessDistribution: {
          ...currentStats.guessDistribution,
          [numGuesses]: won ? (currentStats.guessDistribution[numGuesses] || 0) + 1 : currentStats.guessDistribution[numGuesses],
        },
      };

      await updateDoc(userRef, { stats: newStats });
      setUserProfile(prev => ({
        ...prev,
        stats: newStats,
      }));
    } catch (error) {
      console.error('Error updating stats:', error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut: () => signOut(auth),
    updateStats,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
