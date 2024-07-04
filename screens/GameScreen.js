import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Dialog from 'react-native-dialog';
import color from '../components/colors'

const wordList = ['apple']; // Add more words to the list

const GameScreen = () => {
  const [board, setBoard] = useState(Array(6).fill('').map(() => Array(5).fill('')));
  const [colors, setColors] = useState(Array(6).fill('').map(() => Array(5).fill(color.black)));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [targetWord, setTargetWord] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setTargetWord(wordList[Math.floor(Math.random() * wordList.length)]);
    setBoard(Array(6).fill('').map(() => Array(5).fill('')));
    setColors(Array(6).fill('').map(() => Array(5).fill(color.black)));
    setCurrentRow(0);
    setCurrentCol(0);
    setGameOver(false);
  };

  const handleKeyPress = (key) => {
    if (gameOver) return;

    const newBoard = [...board];

    if (key === 'ENTER') {
      if (currentCol === 5) {
        checkRow();
      }
    } else if (key === '⌫') {
      if (currentCol > 0) {
        newBoard[currentRow][currentCol - 1] = '';
        setCurrentCol(currentCol - 1);
      }
    } else if (currentCol < 5) {
      newBoard[currentRow][currentCol] = key;
      setCurrentCol(currentCol + 1);
    }

    setBoard(newBoard);
  };

  const checkRow = () => {
    const guess = board[currentRow].join('').toLowerCase();
    const newColors = [...colors];
    const targetWordArray = targetWord.split('');

    for (let i = 0; i < 5; i++) {
      if (board[currentRow][i] === targetWordArray[i]) {
        newColors[currentRow][i] = color.greenTile;
        targetWordArray[i] = null; // Prevent double counting
      }
    }
    console.log("1" + newColors)

    for (let i = 0; i < 5; i++) {
      if (newColors[currentRow][i] !== color.greenTile) {
        if (targetWordArray.includes(board[currentRow][i])) {
          newColors[currentRow][i] = color.yellowTile;
          targetWordArray[targetWordArray.indexOf(board[currentRow][i])] = null; // Prevent double counting
        } else {
          newColors[currentRow][i] = color.greyTile;
        }
      }
    }
    console.log("2" + newColors)
    
    setColors(newColors);

    console.log("3" + newColors)

    if (guess == targetWord) {
      Alert.alert('Congratulations!', 'You guessed the word!', [{ text: 'OK', onPress: () => setDialogVisible(true) }]);
      setGameOver(true);
      return;
    }

    if (currentRow === 5) {
      Alert.alert('Game Over', `The word was: ${targetWord}`, [{ text: 'OK', onPress: () => setDialogVisible(true) }]);
      setGameOver(true);
      return;
    }

    setCurrentRow(currentRow + 1);
    setCurrentCol(0);
  };

  const renderTile = (row, col) => {
    const letter = board[row][col];
    const color = colors[row][col];
    return (
      <View key={col} style={[styles.tile, { backgroundColor: color }]}>
        <Text style={styles.tileText}>{letter}</Text>
      </View>
    );
  };

  const renderRow = (row) => {
    return (
      <View key={row} style={styles.row}>
        {Array(5).fill().map((_, col) => renderTile(row, col))}
      </View>
    );
  };

  const renderKeyboard = () => {
    const keys = [
      'QWERTYUIOP',
      'ASDFGHJKL',
      'ZXCVBNM',
    ];
    return keys.map((keyRow, rowIndex) => (
      <View style={styles.keyboardView}>
        <View key={rowIndex} style={styles.keyRow}>
          {rowIndex === 2 && (
            <TouchableOpacity style={[styles.key, styles.specialKey]} onPress={() => handleKeyPress('ENTER')}>
              <Text style={styles.keyText}>ENTER</Text>
            </TouchableOpacity>
          )}
          {keyRow.split('').map((key) => (
            <TouchableOpacity key={key} style={styles.key} onPress={() => handleKeyPress(key)}>
              <Text style={styles.keyText}>{key}</Text>
            </TouchableOpacity>
          ))}
          {rowIndex === 2 && (
            <TouchableOpacity style={[styles.key, styles.specialKey]} onPress={() => handleKeyPress('⌫')}>
              <Text style={styles.keyText}>⌫</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.board}>
        {Array(6).fill().map((_, row) => renderRow(row))}
      </View>
      <View style={styles.keyboard}>
        {renderKeyboard()}
      </View>
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Play Again</Dialog.Title>
        <Dialog.Description>
          Do you want to start a new game?
        </Dialog.Description>
        <Dialog.Button label="No" onPress={() => setDialogVisible(false)} />
        <Dialog.Button label="Yes" onPress={() => { setDialogVisible(false); startNewGame(); }} />
      </Dialog.Container>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  board: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  tile: {
    width: 50,
    height: 50,
    borderColor: '#777',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
  },
  tileText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  keyboardView: {
  },
  keyboard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  keyRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  key: {
    width: 35,
    height: 50,
    backgroundColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 5,
  },
  keyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  specialKey: {
    width: 40,
  },
});

export default GameScreen;
