import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
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

export default function StatsModal({ visible, onClose, stats = DEFAULT_STATS }) {
  const { userProfile } = useAuth();
  
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
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.title}>STATISTICS</Text>
            <View style={{ width: 40 }} />
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
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#121213',
    borderRadius: 15,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3c',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  scrollContent: {
    flex: 1,
  },
  userInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
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
    marginBottom: 16,
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
  },
  barBackground: {
    flex: 1,
    marginLeft: 8,
    height: 20,
  },
  barFill: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  guessCount: {
    color: '#ffffff',
    fontSize: 12,
  },
});
