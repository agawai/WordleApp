import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VALID_WORDS } from '../data/wordList';

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const KEYBOARD_LETTERS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

const GameScreen = ({ navigation }) => {
  const [targetWord, setTargetWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [attempts, setAttempts] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [animations] = useState(() => 
    Array(MAX_ATTEMPTS).fill().map(() => 
      Array(WORD_LENGTH).fill().map(() => new Animated.Value(0))
    )
  );

  useEffect(() => {
    setTargetWord(VALID_WORDS[Math.floor(Math.random() * VALID_WORDS.length)]);
  }, []);

  const updateStats = async (won, numGuesses) => {
    try {
      const savedStats = await AsyncStorage.getItem('wordleStats');
      let stats = savedStats ? JSON.parse(savedStats) : {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0,
        guessDistribution: {
          1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
        }
      };

      stats.gamesPlayed += 1;
      
      if (won) {
        stats.gamesWon += 1;
        stats.currentStreak += 1;
        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
        stats.guessDistribution[numGuesses] += 1;
      } else {
        stats.currentStreak = 0;
      }

      await AsyncStorage.setItem('wordleStats', JSON.stringify(stats));
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  const animateRow = (rowIndex) => {
    const animations = attempts[rowIndex].split('').map((_, i) => {
      return Animated.sequence([
        Animated.delay(i * 100),
        Animated.spring(animations[rowIndex][i], {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        })
      ]);
    });

    Animated.parallel(animations).start();
  };

  const handleKeyPress = (key) => {
    if (gameOver) return;

    if (key === '⌫') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (key === 'ENTER') {
      if (currentGuess.length !== WORD_LENGTH) {
        Alert.alert('Invalid', 'Word must be 5 letters long');
        return;
      }

      if (!VALID_WORDS.includes(currentGuess)) {
        Alert.alert('Invalid', 'Not in word list');
        return;
      }
      
      const newAttempts = [...attempts, currentGuess];
      setAttempts(newAttempts);
      animateRow(attempts.length);
      
      if (currentGuess === targetWord) {
        setGameOver(true);
        updateStats(true, newAttempts.length);
        setTimeout(() => {
          Alert.alert('Congratulations!', 'You won!', [
            { text: 'View Stats', onPress: () => navigation.navigate('Stats') },
            { text: 'OK' }
          ]);
        }, 500);
      } else if (newAttempts.length >= MAX_ATTEMPTS) {
        setGameOver(true);
        updateStats(false, MAX_ATTEMPTS);
        setTimeout(() => {
          Alert.alert('Game Over', `The word was ${targetWord}`, [
            { text: 'View Stats', onPress: () => navigation.navigate('Stats') },
            { text: 'OK' }
          ]);
        }, 500);
      }
      
      setCurrentGuess('');
    } else if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key);
    }
  };

  const getLetterStyle = (letter, index, attempt) => {
    if (!attempt) return styles.letterDefault;
    
    if (targetWord[index] === letter) {
      return styles.letterCorrect;
    } else if (targetWord.includes(letter)) {
      return styles.letterWrongPosition;
    } else {
      return styles.letterIncorrect;
    }
  };

  const getKeyboardLetterStyle = (letter) => {
    if (letter === 'ENTER' || letter === '⌫') return {};

    for (let i = 0; i < attempts.length; i++) {
      const attempt = attempts[i];
      for (let j = 0; j < attempt.length; j++) {
        if (attempt[j] === letter) {
          if (targetWord[j] === letter) {
            return styles.keyCorrect;
          } else if (targetWord.includes(letter)) {
            return styles.keyWrongPosition;
          } else {
            return styles.keyIncorrect;
          }
        }
      }
    }
    return {};
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {[...Array(MAX_ATTEMPTS)].map((_, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {[...Array(WORD_LENGTH)].map((_, colIndex) => {
              const attemptLetter = attempts[rowIndex]?.[colIndex];
              const currentLetter = rowIndex === attempts.length && colIndex < currentGuess.length
                ? currentGuess[colIndex]
                : '';
              
              return (
                <Animated.View
                  key={colIndex}
                  style={[
                    styles.letter,
                    attemptLetter ? getLetterStyle(attemptLetter, colIndex, attempts[rowIndex]) : styles.letterDefault,
                    {
                      transform: [
                        {
                          scale: animations[rowIndex][colIndex].interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [1, 1.1, 1]
                          })
                        },
                        {
                          rotateX: animations[rowIndex][colIndex].interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: ['0deg', '90deg', '0deg']
                          })
                        }
                      ]
                    }
                  ]}
                >
                  <Text style={styles.letterText}>
                    {attemptLetter || currentLetter}
                  </Text>
                </Animated.View>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.keyboard}>
        {KEYBOARD_LETTERS.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keyboardRow}>
            {row.map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.key,
                  key === 'ENTER' && styles.enterKey,
                  getKeyboardLetterStyle(key)
                ]}
                onPress={() => handleKeyPress(key)}
              >
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121213',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  grid: {
    marginTop: 50,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  letter: {
    width: 50,
    height: 50,
    borderWidth: 2,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  letterDefault: {
    borderColor: '#3a3a3c',
    backgroundColor: 'transparent',
  },
  letterCorrect: {
    backgroundColor: '#538d4e',
    borderColor: '#538d4e',
  },
  letterWrongPosition: {
    backgroundColor: '#b59f3b',
    borderColor: '#b59f3b',
  },
  letterIncorrect: {
    backgroundColor: '#3a3a3c',
    borderColor: '#3a3a3c',
  },
  keyboard: {
    marginBottom: 20,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  key: {
    backgroundColor: '#818384',
    padding: 10,
    margin: 3,
    borderRadius: 5,
    minWidth: 30,
    alignItems: 'center',
  },
  keyCorrect: {
    backgroundColor: '#538d4e',
  },
  keyWrongPosition: {
    backgroundColor: '#b59f3b',
  },
  keyIncorrect: {
    backgroundColor: '#3a3a3c',
  },
  enterKey: {
    minWidth: 60,
  },
  keyText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GameScreen;
