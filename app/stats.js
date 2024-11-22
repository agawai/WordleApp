import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

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

export default function StatsScreen() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const stats = userProfile?.stats || DEFAULT_STATS;
  
  const winPercentage = stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0;

  const maxGuesses = Math.max(...Object.values(stats.guessDistribution || {}), 1);

  const StatBox = ({ title, value }) => (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const GuessBar = ({ guessNumber, count }) => {
    const percentage = (count / maxGuesses) * 100;
    return (
      <View style={styles.guessBarContainer}>
        <Text style={styles.guessNumber}>{guessNumber}</Text>
        <View style={styles.barBackground}>
          <View
            style={[
              styles.barFill,
              {
                width: `${percentage}%`,
                backgroundColor: count > 0 ? '#538d4e' : '#3a3a3c',
              },
            ]}
          >
            <Text style={styles.guessCount}>{count}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Stats</Text>
      </View>

      <ScrollView style={styles.scrollContent}>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{userProfile?.displayName || 'Player'}</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatBox title="Played" value={stats.gamesPlayed} />
          <StatBox title="Win %" value={winPercentage} />
          <StatBox title="Current Streak" value={stats.currentStreak} />
          <StatBox title="Max Streak" value={stats.maxStreak} />
        </View>

        <View style={styles.guessDistribution}>
          <Text style={styles.sectionTitle}>GUESS DISTRIBUTION</Text>
          {Object.entries(stats.guessDistribution || {}).map(([guess, count]) => (
            <GuessBar key={guess} guessNumber={guess} count={count} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121213',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingHorizontal: 20,
    height: Platform.OS === 'ios' ? 100 : 60,
  },
  backButton: {
    padding: 10,
  },
  title: {
    flex: 1,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginRight: 44, // To offset the back button width and keep title centered
  },
  scrollContent: {
    flex: 1,
  },
  userInfo: {
    alignItems: 'center',
    paddingTop: 30,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
    minWidth: 80,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statTitle: {
    fontSize: 12,
    color: '#818384',
    marginTop: 4,
    textAlign: 'center',
  },
  guessDistribution: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  guessBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  guessNumber: {
    color: '#ffffff',
    width: 20,
    textAlign: 'center',
    marginRight: 8,
  },
  barBackground: {
    flex: 1,
    height: 36,
    backgroundColor: '#262626',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  guessCount: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
