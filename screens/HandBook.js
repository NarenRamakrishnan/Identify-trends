import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

let customFonts = {
  "Bubblegum-Sans": require("../assets/BubblegumSans-Regular.ttf"),
};

export default class HandbookScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      handbookText: "Dear User, I hope you are enjoying the app. As the app is a little confusing to use, here is a guide to help you. The app is designed for data analysis. It can be used to identify patterns in data and compare these patterns against other data to see if they too fit the pattern. By clicking on 'Start New Project' in the homescreen, you will be redirected to a project screen. For the users benefit, incase they wish to compare results between two projects, I have allowed projects to be named the same. Please be wary of this when naming your projects. Once this is done, you will be redirected to another screen and be prompted to input values. You must state your input values and your target.output values in the following boxes. For example in an experiment where we investigate the the time period of a pendulum based on the weight of the bob, the input would be the weight of bob, while target/output value would be the time period measured. Once this is done, a graph will be plotted and the sequence the data follows will be identified. If the user wishes to compare their results against already existing data, the user can also be redirected to the compare results screen where they can place another set of data to see if this new set of data matches the trend found in the original data. I hope you have a lovely time using my app!", 
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
  }




  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Handbook</Text>
          <TextInput
            style={styles.textInput}
            value={this.state.handbookText}
            multiline={true}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", 
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontFamily: "Bubblegum-Sans",
    textAlign: "center",
    marginBottom: 20,
  },
  textInput: {
    height: 300,
    borderColor: "#555",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: "#fff",
    fontSize: 18,
    backgroundColor: "#222",
  },
  saveButton: {
    height: 50,
    backgroundColor: "#6200EE",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Bubblegum-Sans",
  },
});
