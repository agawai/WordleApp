import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';
import { db } from '../src/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');
const LOGO_LETTER_SIZE = Math.min(width * 0.12, 45);
const LOGO_PADDING = Math.min(width * 0.01, 4);

function WordleLogo() {
  const letterColors = {
    W: '#538d4e',  // green
    O: '#b59f3b',  // yellow
    R: '#3a3a3c',  // grey
    D: '#538d4e',  // green
    L: '#b59f3b',  // yellow
    E: '#538d4e',  // green
  };

  return (
    <View style={styles.logoContainer}>
      <View style={styles.logoRow}>
        {['W', 'O', 'R', 'D', 'L', 'E'].map((letter, index) => (
          <View 
            key={index} 
            style={[
              styles.logoLetter,
              { backgroundColor: letterColors[letter] }
            ]}
          >
            <Text style={styles.logoText}>{letter}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const [firstName, setFirstName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setFirstName(userDoc.data().firstName);
          }
        } catch (error) {
          console.error('Error fetching username:', error);
        }
      } else {
        setFirstName('');
      }
    };

    fetchUsername();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <WordleLogo />
      
      {firstName && (
        <Text style={styles.greeting}>Hi {firstName}!</Text>
      )}

      <View style={styles.buttonContainer}>
        <Link href="/game" asChild>
          <TouchableOpacity style={styles.playButton}>
            <Text style={styles.buttonText}>Play Game</Text>
          </TouchableOpacity>
        </Link>

        <Link href={user ? "/stats" : "/login"} asChild>
          <TouchableOpacity style={styles.statsButton}>
            <Ionicons name="stats-chart" size={24} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Statistics</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.loginContainer}>
        {user ? (
          <TouchableOpacity style={styles.loginButton} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        ) : (
          <Link href="/login" asChild>
            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </Link>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121213',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 50,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  logoRow: {
    flexDirection: 'row',
    gap: LOGO_PADDING,
  },
  logoLetter: {
    width: LOGO_LETTER_SIZE,
    height: LOGO_LETTER_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  logoText: {
    color: '#ffffff',
    fontSize: LOGO_LETTER_SIZE * 0.6,
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: 30,
    color: '#ffffff',
    fontWeight: 'bold',

    // marginBottom: 30,
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'stretch',
    gap: 20,
  },
  playButton: {
    backgroundColor: '#538d4e',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  statsButton: {
    backgroundColor: '#818384',
    paddingVertical: 15,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    width: '80%',
    alignItems: 'stretch',
  },
  loginButton: {
    backgroundColor: '#b59f3b',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 10,
  }
});
