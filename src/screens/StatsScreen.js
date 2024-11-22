import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StatsScreen = ({ navigation }) => {
  const [stats, setStats] = React.useState({
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
      6: 0
    }
  });

  React.useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const savedStats = await AsyncStorage.getItem('wordleStats');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const calculateWinPercentage = () => {
    if (stats.gamesPlayed === 0) return 0;
    return Math.round((stats.gamesWon / stats.gamesPlayed) * 100);
  };

  const renderGuessDistribution = () => {
    const maxValue = Math.max(...Object.values(stats.guessDistribution));
    
    return Object.entries(stats.guessDistribution).map(([guess, count]) => (
      <View key={guess} style={styles.distributionRow}>
        <Text style={styles.guessNumber}>{guess}</Text>
        <View style={[
          styles.distributionBar,
          { width: `${(count / maxValue) * 100}%` }
        ]}>
          <Text style={styles.distributionCount}>{count}</Text>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>STATISTICS</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.gamesPlayed}</Text>
          <Text style={styles.statLabel}>Played</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{calculateWinPercentage()}</Text>
          <Text style={styles.statLabel}>Win %</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.currentStreak}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.maxStreak}</Text>
          <Text style={styles.statLabel}>Max Streak</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>GUESS DISTRIBUTION</Text>
      <View style={styles.distributionContainer}>
        {renderGuessDistribution()}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Game')}
      >
        <Text style={styles.buttonText}>Play Again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121213',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginVertical: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    color: '#ffffff',
    fontSize: 12,
    marginTop: 5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  distributionContainer: {
    marginBottom: 40,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  guessNumber: {
    color: '#ffffff',
    width: 30,
  },
  distributionBar: {
    height: 30,
    backgroundColor: '#538d4e',
    justifyContent: 'center',
    paddingHorizontal: 10,
    minWidth: 30,
  },
  distributionCount: {
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#538d4e',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StatsScreen;
