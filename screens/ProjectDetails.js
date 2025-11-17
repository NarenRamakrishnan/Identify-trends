import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function ProjectDetailsScreen({ route, navigation }) {
  const { project } = route.params; // Get the selected project data

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Project Details</Text>
      <Text style={styles.label}>Project Name:</Text>
      <Text style={styles.details}>{project.project_name}</Text>
      <Text style={styles.label}>Project Data:</Text>
      <Text style={styles.details}>{project.project_data}</Text>
      <Text style={styles.label}>Target Values:</Text>
      <Text style={styles.details}>{project.target_values}</Text>

      {/* Button to navigate back to Project Screen */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ProjectScreen", { project })} // Pass the data back
      >
        <Text style={styles.buttonText}>To Project Screen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Dark background to match the original design
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontFamily: "Bubblegum-Sans",
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Bubblegum-Sans",
    marginTop: 10,
  },
  details: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Bubblegum-Sans",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#6200EE",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
