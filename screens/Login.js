import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

let customFonts = {
  "Bubblegum-Sans": require("../assets/BubblegumSans-Regular.ttf"),
};

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      username: '',
      password: '',
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
  }

  handleLogin = async () => {
    const { username, password } = this.state;
    try {
      const response = await fetch('http://127.0.0.1:5000/login', { //This connects to the route 
        method: 'POST', //This sends the data to the backend
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json(); //THis waits for the connect and response from the backend
      console.log(result);
      if (response.ok && result.status === "success") { 
        //This checks if status is success and if a response is recieved  from backend
        alert("Welcome Back!"); //This sends a message to user
        this.props.navigation.navigate('HomeScreen'); //This navigates to the next screen if status==success
      } else {
        alert(result.message || "Error: Unable to log in. Please contact support.");
        //This sends a message to the user if there is an error in logging in
      }
    } catch (error) {
      alert(`Error: ${error.message}`); //This sends the message to the user if an error is caught
    }
  };

  handleNewUser = () => {
    this.props.navigation.navigate("NewUser");
  };

  handleForgotPassword = () => {
    this.props.navigation.navigate("ForgotPassword");
  };

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.appTitleText}>Login to MyApp</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#ccc"
              onChangeText={(text) => this.setState({ username: text })}
              value={this.state.username}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#ccc"
              secureTextEntry
              onChangeText={(text) => this.setState({ password: text })}
              value={this.state.password}
            />
            <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <View style={styles.linkContainer}>
              <TouchableOpacity onPress={this.handleForgotPassword}>
                <Text style={styles.linkText}>Forgot Password?</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleNewUser}>
                <Text style={styles.linkText}>New User?</Text>
              </TouchableOpacity>
            </View>
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
  linkContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  linkText: {
    color: "#BB86FC",
    fontSize: 16,
    textDecorationLine: "underline",
    fontFamily: "Bubblegum-Sans",
    marginHorizontal: 10,
  },
});
