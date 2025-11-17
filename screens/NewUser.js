import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

let customFonts = {
  "Bubblegum-Sans": require("../assets/BubblegumSans-Regular.ttf"),
};

export default class NewUserScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
  }

  handleCreateUser = async () => {
    const { email, password, confirmPassword } = this.state; //Data entered by user is set to the appropriate var
    //Checks if the email, password, and re-typed password are entered
    if (!email || !password || !confirmPassword) {
        this.setState({ errorMessage: "All fields are required" });
        return;
    }
    //Checks if passwords match
    if (password !== confirmPassword) {
        this.setState({ errorMessage: "Passwords do not match" });
        return;
    } //Checks if password is greater than 7 characters
    if (password.length<7) {
      this.setState({ errorMessage: "Passwords must be atleast 7 characters long" });
      return;
  } // Checks if email/username length is greater than 3
  if (email.length<3) {
    this.setState({ errorMessage: "Not a valid email" });
    return;
}
    // Reset previous error messages
    this.setState({ errorMessage: "" });

    // Call function to submit user data and wait for response
    const userExists = await this.submitUserData({ email, password });

    if (userExists) {
        this.setState({ errorMessage: "User already exists" });
        alert("User already exists");
    } else {
        alert("Welcome New User!");
        this.props.navigation.navigate("HomeScreen");
    }
};

submitUserData = async (userData) => {
    try {
        const response = await fetch("http://127.0.0.1:5000/db_manage_userinfo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        if (response.status === 409) {
            return true; // User exists
        } else if (response.ok) {
            return false; // User successfully created
        } else {
            console.error("Error creating user:", await response.json());
            this.setState({ errorMessage: "An error occurred. Please try again." });
            return true; // Treat unknown errors as user exists to prevent further action
        }
    } catch (error) {
        console.error("Network or server error:", error);
        this.setState({ errorMessage: "Network error. Please try again." });
        return true; // Assume user exists on failure to avoid proceeding
    }
};


  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.appTitleText}>Create New User</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#ccc"
              onChangeText={(text) => this.setState({ email: text })}
              value={this.state.email}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#ccc"
              secureTextEntry
              onChangeText={(text) => this.setState({ password: text })}
              value={this.state.password}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#ccc"
              secureTextEntry
              onChangeText={(text) => this.setState({ confirmPassword: text })}
              value={this.state.confirmPassword}
            />
            {this.state.errorMessage ? (
              <Text style={styles.appAlert}>{this.state.errorMessage}</Text>
            ) : null}
            <TouchableOpacity style={styles.button} onPress={this.handleCreateUser}>
              <Text style={styles.buttonText}>Create User</Text>
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
    padding: 20,
  },
  appAlert: {
    color: "#ff4444",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Bubblegum-Sans",
    marginBottom: 10,
  },
  appTitleText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 36,
    fontFamily: "Bubblegum-Sans",
    marginBottom: 30,
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
    backgroundColor: "#6200EE",
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
