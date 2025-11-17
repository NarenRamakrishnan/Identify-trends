import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

let customFonts = {
  "Bubblegum-Sans": require("../assets/BubblegumSans-Regular.ttf"),
};

export default class LoadOldProjectScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      username: "", // Ensure username is set dynamically
      projects: [],
      isModalVisible: false, // Manage modal visibility
      projectToDelete: null, // Store project name to be deleted
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchProjects(); // Fetch projects from the database
  }

  fetchProjects = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/load_projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: this.state.username }), // Ensure username is set correctly
      });
      const result = await response.json();
      if (response.ok) {
        this.setState({ projects: result.projects });
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  openProject = (project) => {
    this.props.navigation.navigate("ProjectDetails", { project });
  };

  confirmDeleteProject = (projectName) => {
    this.setState({ isModalVisible: true, projectToDelete: projectName });
  };

  handleDeleteProject = async () => {
    const { projectToDelete } = this.state;

    if (!projectToDelete) return;

    try {
      const response = await fetch("http://127.0.0.1:5000/delete_project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: this.state.username,
          project_name: projectToDelete,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Project deleted successfully!");
        this.setState({ isModalVisible: false, projectToDelete: null });
        this.fetchProjects(); // Refresh project list
      } else {
        alert("Error deleting project: " + data.error);
      }
    } catch (error) {
      alert("Network error: " + error.message);
    }
  };

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={styles.container}>
          <FlatList
            data={this.state.projects}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.projectItem}>
                <TouchableOpacity onPress={() => this.openProject(item)}>
                  <Text style={styles.projectText}>{item.project_name}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => this.confirmDeleteProject(item.project_name)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
            showsVerticalScrollIndicator={true}
            style={styles.flatList}
          />

          <Modal transparent visible={this.state.isModalVisible} animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Delete Project?</Text>
                <Text style={styles.modalText}>
                  Are you sure you want to delete {this.state.projectToDelete}?
                </Text>
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity style={styles.modalButton} onPress={this.handleDeleteProject}>
                    <Text style={styles.modalButtonText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButtonCancel}
                    onPress={() => this.setState({ isModalVisible: false })}
                  >
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
    flex: 0.999,
    backgroundColor: "#000",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  projectItem: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  projectText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Bubblegum-Sans",
  },
  deleteButton: {
    backgroundColor: "#E74C3C",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Bubblegum-Sans",
  },
  flatList: {
    width: "100%",
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
    fontSize: 22,
    fontFamily: "Bubblegum-Sans",
    marginBottom: 10,
    color: "#fff",
  },
  modalText: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 20,
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
    backgroundColor: "#E74C3C",
    alignItems: "center",
  },
  modalButtonCancel: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#555",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
