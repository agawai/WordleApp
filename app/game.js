import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Keyboard,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { VALID_WORDS } from '../src/data/wordList';
import StatsModal from '../src/components/StatsModal';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../src/config/firebase';

const WORD_LENGTH = 5;
const NUM_TRIES = 6;
const { width } = Dimensions.get('window');
const CELL_SIZE = Math.floor(width * 0.16);
const CELL_PADDING = Math.floor(width * 0.03);

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

export default function GameScreen() {
  const router = useRouter();
  const { user, updateStats } = useAuth();
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [targetWord] = useState(() => VALID_WORDS[Math.floor(Math.random() * VALID_WORDS.length)].toLowerCase());
  const [guesses, setGuesses] = useState(Array(NUM_TRIES).fill(''));
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [showStats, setShowStats] = useState(false);
  console.log(targetWord)

  useEffect(() => {
    const fetchStats = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setStats(userDoc.data().stats || DEFAULT_STATS);
          }
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      }
    };

    fetchStats();
  }, [user]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {}
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {}
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const resetGame = useCallback(() => {
    setGuesses(Array(NUM_TRIES).fill(''));
    setCurrentGuess('');
    setCurrentRow(0);
    setGameOver(false);
    setWon(false);
    setShowStats(false);
    setTargetWord(VALID_WORDS[Math.floor(Math.random() * VALID_WORDS.length)].toLowerCase());
  }, []);

  const handleKeyPress = useCallback(async (key) => {
    if (gameOver) return;

    if (key === 'ENTER') {
      if (currentGuess.length !== WORD_LENGTH) {
        Alert.alert('Not enough letters');
        return;
      }

      if (!VALID_WORDS.includes(currentGuess.toUpperCase())) {
        Alert.alert('Not in word list');
        return;
      }

      const newGuesses = [...guesses];
      newGuesses[currentRow] = currentGuess;
      
      const isWinningGuess = currentGuess.toLowerCase() === targetWord;
      const isLastRow = currentRow === NUM_TRIES - 1;

      setGuesses(newGuesses);
      setCurrentGuess('');

      if (isWinningGuess) {
        setWon(true);
        setGameOver(true);
        await updateStats(true, currentRow + 1);
        setTimeout(() => {
          Alert.alert('Congratulations!', 'You won! 🎉', [
            { text: 'Play Again', onPress: resetGame },
            { text: 'View Stats', onPress: () => setShowStats(true) },
            { text: 'OK', onPress: () => router.replace('/') },
          ]);
        }, 500);
        return;
      }
      
      if (isLastRow) {
        setGameOver(true);
        await updateStats(false, NUM_TRIES);
        Alert.alert('Game Over', `The word was ${targetWord.toUpperCase()}`, [
          { text: 'Play Again', onPress: resetGame },
          { text: 'View Stats', onPress: () => setShowStats(true) },
          { text: 'OK', onPress: () => router.replace('/') },
        ]);
        return;
      }
      
      setCurrentRow(prev => prev + 1);
    } else if (key === 'BACK') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess, currentRow, gameOver, guesses, targetWord, updateStats]);

  const getLetterBackgroundColor = useCallback((rowIndex, colIndex) => {
    if (rowIndex >= currentRow && !gameOver) return '#121213';
    
    const guess = guesses[rowIndex]?.toLowerCase();
    if (!guess) return '#121213';
    
    const letter = guess[colIndex];
    if (!letter) return '#121213';
    
    if (letter === targetWord[colIndex]) {
      return '#538d4e'; // Green for correct position
    }
    
    if (targetWord.includes(letter)) {
      return '#b59f3b'; // Yellow for letter exists but wrong position
    }
    
    return '#3a3a3c'; // Grey for letter not in word
  }, [currentRow, guesses, targetWord, gameOver]);

  const renderBoard = () => (
    <View style={styles.board}>
      {Array(NUM_TRIES).fill().map((_, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {Array(WORD_LENGTH).fill().map((_, colIndex) => {
            let letter = guesses[rowIndex]?.[colIndex];
            if (rowIndex === currentRow && !gameOver) {
              letter = currentGuess[colIndex];
            }
            
            return (
              <View
                key={colIndex}
                style={[
                  styles.cell,
                  {
                    backgroundColor: getLetterBackgroundColor(rowIndex, colIndex),
                  },
                ]}
              >
                <Text style={styles.cellText}>
                  {letter?.toUpperCase() || ''}
                </Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );

  const renderKeyboard = () => {
    const rows = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ''],
      ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK'],
    ];

    const isActionKey = (key) => key === 'ENTER' || key === 'BACK';

    return (
      <View style={styles.keyboard}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keyboardRow}>
            {row.map((key) => (
              key ? (
                <TouchableOpacity
                  key={key}
                  style={[
                    isActionKey(key) ? styles.actionKey : styles.letterKey,
                    key === 'ENTER' && styles.enterKey,
                    key === 'BACK' && styles.backKey,
                  ]}
                  onPress={() => handleKeyPress(key)}
                >
                  {key === 'BACK' ? (
                    <Ionicons name="backspace-outline" size={24} color="white" />
                  ) : (
                    <Text style={[
                      styles.keyText,
                      isActionKey(key) && styles.actionKeyText
                    ]}>{key}</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <View key={Math.random()} style={[styles.letterKey, styles.spacer]} />
              )
            ))}
          </View>
        ))}
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
        <Text style={styles.title}>Wordle</Text>
      </View>

      {renderBoard()}
      {renderKeyboard()}
      <StatsModal
        visible={showStats}
        onClose={() => setShowStats(false)}
        stats={stats}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121213',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 30,
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
  board: {
  },
  row: {
    flexDirection: 'row',
    marginBottom: CELL_PADDING,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 2,
    borderColor: '#3a3a3c',
    marginHorizontal: CELL_PADDING / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  keyboard: {
    width: '100%',
    padding: 8,
    alignItems: 'center',
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
    width: '100%',
    maxWidth: 500,
  },
  letterKey: {
    backgroundColor: '#818384',
    height: 58,
    flex: 1,
    maxWidth: 43,
    margin: 3,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionKey: {
    backgroundColor: '#818384',
    height: 58,
    flex: 1.5,
    margin: 3,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    backgroundColor: 'transparent',
    maxWidth: 21.5,
  },
  enterKey: {
    maxWidth: 65,
  },
  backKey: {
    maxWidth: 65,
  },
  keyText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
  actionKeyText: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
});
