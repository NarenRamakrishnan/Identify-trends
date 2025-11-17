import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

let customFonts = {
  "Bubblegum-Sans": require("../assets/BubblegumSans-Regular.ttf"),
};

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      email: "",
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
  }

  handleSendEmail = async () => {
    const { email } = this.state;

    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/forgot_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Your password has been sent to your email!");
        this.setState({ email: "" }); // Clear input after success
      } else {
        alert("Failed to send reset email.");
      }
    } catch (error) {
      alert("Error", "Something went wrong. Please try again later.");
    }
  };

  render() { //Render is used to render the user interface for each screen
    if (!this.state.fontsLoaded) { //This checks if the fonts have loaded
      return <AppLoading />; //This waits for the fonts to load before the screen loads
    } else { 
      return (
        <View style={styles.container} //This is used to decide what all is shown on the screen. 
        //Styles.x refers to the style format 
        //Everything inside the this view component is displayed on the screen
        > 
          <Text style={styles.appTitleText}>Forgot Password</Text>  
          <View style={styles.inputContainer}> 
            <TextInput  
              style={styles.input} 
              placeholder="Email Address"
              placeholderTextColor="#888"
              onChangeText={(text) => this.setState({ email: text })} 
              //This updates email to whatever the user types
              value={this.state.email}
              keyboardType="email-address"
              autoCapitalize="none" //This ensures email is not capitalized
            />
            <TouchableOpacity //TouchableOpacity is a touchable component like a button
            style={styles.button} onPress={this.handleSendEmail} //When the touchable opacity component is pressed
            // the function within onPress is carried out
            >
              <Text style={styles.buttonText}>Send Email</Text> 
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    padding: 20, //Aligning element used to space the elements appropriately
  },
  appTitleText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 36,
    fontFamily: "Bubblegum-Sans",
    marginBottom: 30, //Aligning element used to space the elements appropriately
  },
  inputContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    height: 50,
    borderColor: "#555",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: "#fff",
    fontSize: 18,
    backgroundColor: "#222",
  },
  button: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#6200EE", // Match the button color
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 15,
    width: '100%',
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Bubblegum-Sans",
  },
});
