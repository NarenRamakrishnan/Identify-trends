import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";

export default function ProjectScreen({ navigation, route }) {
  const [features, setFeatures] = useState("");
  const [target, setTarget] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [project, setProject] = useState(null); // State for holding project data

  // Check if project data is passed through navigation
  useEffect(() => {
    if (route.params?.project) {
      setProject(route.params.project); // If data is passed, set it in the state
    }
  }, [route.params?.project]);

  const handleSubmit = async () => {
    const featuresArray = features.split(",").map((value) => parseFloat(value.trim()));
    const targetArray = target.split(",").map((value) => parseFloat(value.trim()));

    if (featuresArray.some(isNaN) || targetArray.some(isNaN)) {
      alert("Sorry! Looks like you have not entered a valid number. Please re-enter the numbers.");
      return;
    }

    setIsLoading(true);
    setEstimatedTime(5);

    try {
      const response = await fetch("http://127.0.0.1:5000/train_and_predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          features: [featuresArray],
          target: targetArray,
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok) {
        navigation.navigate("FunctionScreen", {
          function: data.function,
          graph: data.graph,
        });
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      setIsLoading(false);
      alert("Error: " + error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Enter Features and Target Values</Text>

      {project && (
        <>
          <Text style={styles.label}>Project Name: {project.project_name}</Text>
          <Text style={styles.label}>Project Data: {project.project_data}</Text>
          <Text style={styles.label}>Target Values: {project.target_values}</Text>
        </>
      )}

      <Text style={styles.label}>Input Features (comma-separated):</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 1, 2, 3, 4"
        value={features}
        onChangeText={setFeatures}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Input Target Values (comma-separated):</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 2.1, 4.3, 6.2, 8.5"
        value={target}
        onChangeText={setTarget}
        keyboardType="numeric"
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Please wait, processing your data...</Text>
          <Text style={styles.estimatedTime}>Estimated Time: {estimatedTime} seconds</Text>
          <ActivityIndicator size="large" color="#6200EE" />
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Generate Function and Graph</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ecf0f1",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    color: "#ecf0f1",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#95a5a6",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 8,
    backgroundColor: "#ecf0f1",
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ecf0f1",
    marginBottom: 10,
  },
  estimatedTime: {
    fontSize: 16,
    marginBottom: 10,
    color: "#ecf0f1",
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
