import { Stack } from 'expo-router';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { useState } from 'react';
import StatsModal from '../src/components/StatsModal';

const DEFAULT_STATS = {
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

function GameHeader() {
  const { user, userProfile } = useAuth();
  const [showStats, setShowStats] = useState(false);
  const router = useRouter();

  if (!user) return null;

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowStats(true)}
        style={{ marginRight: 15 }}
      >
        <Ionicons name="stats-chart" size={24} color="#ffffff" />
      </TouchableOpacity>
      <StatsModal
        visible={showStats}
        onClose={() => setShowStats(false)}
        stats={userProfile?.stats || DEFAULT_STATS}
        onPlayAgain={() => {
          setShowStats(false);
          router.replace('/game');
        }}
      />
    </>
  );
}

export default function Layout() {
  const router = useRouter();

  return (
    <AuthProvider>
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#121213',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerBackTitle: 'Home',
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: 'Wordle',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="game"
            options={{
              title: 'Wordle',
              headerLeft: () => null,
              headerRight: () => <GameHeader />,
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="login"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="stats"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </View>
    </AuthProvider>
  );
}
