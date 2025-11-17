import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function FunctionScreen({ route, navigation }) {
  const { function: functionString, graph } = route.params; // Destructure the function and graph from params
  const [graphUri, setGraphUri] = useState(null);

  useEffect(() => {
    if (graph) {
      setGraphUri(`data:image/png;base64,${graph}`);
    }
  }, [graph]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Identified Function</Text>

      <Text style={styles.function}>
        {functionString ? `The identified function is: ${functionString}` : "No function identified"}
      </Text>

      {graphUri && (
        <Image
          source={{ uri: graphUri }}
          style={styles.graph}
          resizeMode="contain"
        />
      )}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CompareScreen')}>
        <Text style={styles.buttonText}>Compare New Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#121212', // Dark background for contrast
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ecf0f1', // Light color for the header
    marginBottom: 20,
    textAlign: 'center',
  },
  function: {
    fontSize: 18,
    color: '#ecf0f1',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  graph: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 10, // Rounded corners for the graph image
    borderColor: '#95a5a6',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
