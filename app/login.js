import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
    username: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');

  const handleAuth = async () => {
    if (isSignUp) {
      if (!formData.emailOrUsername || !formData.password || !formData.username || 
          !formData.firstName || !formData.lastName) {
        setError('Please fill in all fields');
        return;
      }
    } else {
      if (!formData.emailOrUsername || !formData.password) {
        setError('Please fill in all fields');
        return;
      }
    }

    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await signUp({
          ...formData,
          email: formData.emailOrUsername // Use emailOrUsername as email for signup
        });
      } else {
        await signIn(formData.emailOrUsername, formData.password);
      }
      router.replace('/');
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      router.replace('/');
    } catch (error) {
      if (error.message !== 'Sign in cancelled') {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#ffffff" />
      </TouchableOpacity>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <Text style={styles.title}>{isSignUp ? 'Create Account' : 'Welcome Back'}</Text>
          
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {isSignUp && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#787c7e"
                value={formData.emailOrUsername}
                onChangeText={(text) => setFormData({ ...formData, emailOrUsername: text })}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#787c7e"
                value={formData.username}
                onChangeText={(text) => setFormData({ ...formData, username: text.toLowerCase() })}
                autoCapitalize="none"
                autoComplete="off"
              />
              <View style={styles.nameContainer}>
                <TextInput
                  style={[styles.input, styles.nameInput]}
                  placeholder="First Name"
                  placeholderTextColor="#787c7e"
                  value={formData.firstName}
                  onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                />
                <TextInput
                  style={[styles.input, styles.nameInput]}
                  placeholder="Last Name"
                  placeholderTextColor="#787c7e"
                  value={formData.lastName}
                  onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                />
              </View>
            </>
          )}

          {!isSignUp ? (
            <TextInput
              style={styles.input}
              placeholder="Username or Email"
              placeholderTextColor="#787c7e"
              value={formData.emailOrUsername}
              onChangeText={(text) => setFormData({ ...formData, emailOrUsername: text })}
              autoCapitalize="none"
              autoComplete="off"
            />
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#787c7e"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleAuth}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setFormData({
                emailOrUsername: '',
                password: '',
                username: '',
                firstName: '',
                lastName: '',
              });
            }}
          >
            <Text style={styles.switchText}>
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121213',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
    textAlign: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  nameInput: {
    flex: 0.48,
    marginBottom: 0,
  },
  input: {
    backgroundColor: '#262626',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    color: '#ffffff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#538d4e',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  googleButton: {
    backgroundColor: '#4285f4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    alignItems: 'center',
  },
  switchText: {
    color: '#538d4e',
    fontSize: 14,
  },
  error: {
    color: '#ff4d4d',
    marginBottom: 15,
    textAlign: 'center',
  },
});
