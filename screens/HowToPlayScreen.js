import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import colors from '../components/colors'

const HowToPlayScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>How To Play</Text>
      <Text style={styles.subtitle}>Guess the Wordle in 6 tries.</Text>
      <Text style={styles.text}>
        • Each guess must be a valid 5-letter word.{'\n'}
        • The color of the tiles will change to show how close your guess was to the word.
      </Text>

      <Text style={styles.sectionTitle}>Examples</Text>

      <View style={styles.exampleContainer}>
        <View style={styles.wordRow}>
          <View style={styles.greenTile}><Text style={styles.tileText}>W</Text></View>
          <View style={styles.tile}><Text style={styles.tileText}>E</Text></View>
          <View style={styles.tile}><Text style={styles.tileText}>A</Text></View>
          <View style={styles.tile}><Text style={styles.tileText}>R</Text></View>
          <View style={styles.tile}><Text style={styles.tileText}>Y</Text></View>
        </View>
        <Text style={styles.exampleText}>W is in the word and in the correct spot.</Text>
      </View>

      <View style={styles.exampleContainer}>
        <View style={styles.wordRow}>
          <View style={styles.tile}><Text style={styles.tileText}>P</Text></View>
          <View style={styles.yellowTile}><Text style={styles.tileText}>I</Text></View>
          <View style={styles.tile}><Text style={styles.tileText}>L</Text></View>
          <View style={styles.tile}><Text style={styles.tileText}>L</Text></View>
          <View style={styles.tile}><Text style={styles.tileText}>S</Text></View>
        </View>
        <Text style={styles.exampleText}>I is in the word but in the wrong spot.</Text>
      </View>

      <View style={styles.exampleContainer}>
        <View style={styles.wordRow}>
          <View style={styles.tile}><Text style={styles.tileText}>V</Text></View>
          <View style={styles.tile}><Text style={styles.tileText}>A</Text></View>
          <View style={styles.tile}><Text style={styles.tileText}>G</Text></View>
          <View style={styles.greyTile}><Text style={styles.tileText}>U</Text></View>
          <View style={styles.tile}><Text style={styles.tileText}>E</Text></View>
        </View>
        <Text style={styles.exampleText}>U is not in the word in any spot.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: "7.5%",
    paddingVertical: "7.5%",
    backgroundColor: colors.secondaryBackground,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 2.5,
    textAlign: 'left',
    color: colors.white,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 10,
    color: colors.white,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'left',
    color: colors.white,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.white,
  },
  exampleContainer: {
    marginBottom: 20,
  },
  wordRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tile: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.tileBorder,
    marginRight: 5,
  },
  greenTile: {
    backgroundColor: colors.greenTile ,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.greenTile,
    marginRight: 5,
  },
  yellowTile: {
    backgroundColor: colors.yellowTile,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.yellowTile,
    marginRight: 5,
  },
  greyTile: {
    backgroundColor: colors.greyTile,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.greyTile,
    marginRight: 5,
  },
  tileText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  exampleText: {
    fontSize: 16,
    color: colors.white,
  },
});

export default HowToPlayScreen;
