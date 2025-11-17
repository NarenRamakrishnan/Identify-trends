import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

let customFonts = {
  "Bubblegum-Sans": require("../assets/BubblegumSans-Regular.ttf"),
};

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      projects: [],
      isModalVisible: false,
      newProjectName: "",
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
  }
  handleNavigateToHandbook = () => {
    this.props.navigation.navigate("HandBook");
  };
  
  handleOpenProject = (project) => {
    console.log("Opening project:", project);
    this.props.navigation.navigate("OpenOldProject");
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  handleStartNewProject = () => {
    this.toggleModal();
  };

  handleCreateProject = async () => {
    const { newProjectName, projects } = this.state;
    if (newProjectName) {
      try {
        const response = await fetch("http://127.0.0.1:5000/add_project", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ project_name: newProjectName }),
        });

        const result = await response.json();

        if (response.ok) {
          alert(result.message);
          this.setState({
            projects: [...projects, newProjectName],
            newProjectName: "",
            isModalVisible: false,
          });
          this.props.navigation.navigate("ProjectScreen");
        } else {
          alert(result.error || "Failed to add project.");
        }
      } catch (error) {
        console.error("Error creating project:", error);
        alert("Error creating project. Please try again.");
      }
    } else {
      alert("Please enter a project name.");
    }
  };

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.welcomeText}>Welcome Users!</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={this.handleOpenProject}>
              <Text style={styles.buttonText}>Open Old Project</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={this.handleNavigateToHandbook}>
            <Text style={styles.buttonText}>Go to Handbook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={this.handleStartNewProject}>
              <Text style={styles.buttonText}>Start New Project</Text>
            </TouchableOpacity>
            
          </View>
          <ScrollView style={styles.projectList}>
            {this.state.projects.map((project, index) => (
              <TouchableOpacity key={index} style={styles.projectItem} onPress={() => this.handleOpenProject(project)}>
                <Text style={styles.projectText}>{project}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Modal transparent visible={this.state.isModalVisible} animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Enter Project Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Project Name"
                  placeholderTextColor="#888"
                  onChangeText={(text) => this.setState({ newProjectName: text })}
                  value={this.state.newProjectName}
                />
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity style={styles.modalButton} onPress={this.handleCreateProject}>
                    <Text style={styles.modalButtonText}>Create</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButton} onPress={this.toggleModal}>
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: {
    color: "#fff",
    fontSize: 30,
    fontFamily: "Bubblegum-Sans",
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#6200EE",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  projectList: {
    flex: 1,
    width: "100%",
  },
  projectItem: {
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
  },
  projectText: {
    color: "#fff",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Bubblegum-Sans",
    marginBottom: 10,
    color: "#fff",
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "#444",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: "#fff",
    backgroundColor: "#333",
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#6200EE",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
