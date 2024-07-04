import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import colors from "../components/colors";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../assets/WordleLogo.png")} />
      <Text style={styles.title}>Wordle</Text>
      <Text style={styles.description}>
        Get 6 chances to guess a 5-letter word.
      </Text>

      <TouchableOpacity 
        style={[styles.button, styles.primaryButton]}
        onPress={() => navigation.navigate('Game')}
        >
        <Text style={styles.buttonText}>Play</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('LogIn')}
        >
        <Text style={styles.secondaryButtonText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('HowToPlay')}>
        <Text style={styles.secondaryButtonText}>How to play</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        July 3, 2024{"\n"}
        Version .1{"\n"}
        Created by Alvin Gawai
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    width: "80%",
    padding: 15,
    borderRadius: 30,
    marginBottom: 10,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#000000",
  },
  secondaryButton: {
    borderColor: "#000000",
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  secondaryButtonText: {
    fontSize: 18,
    color: colors.black,
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
  },
});
export default HomeScreen;
