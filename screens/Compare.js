import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function CompareScreen({ navigation }) {
  const [features, setFeatures] = useState('');
  const [target, setTarget] = useState('');
  const [result, setResult] = useState(null);

  const handleCompare = async () => {
    if (!features || !target) {
      setResult('Please provide both features and target values.');
      return;
    }

    const featureValues = features.split(',').map(Number);
    const targetValues = target.split(',').map(Number);

    if (featureValues.some(isNaN) || targetValues.some(isNaN)) {
      setResult('Please enter valid numbers for features and target values.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/compare_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          features: featureValues,
          target: targetValues,
        }),
      });

      const data = await response.json();
      console.log('Response from server:', data);  

      if (data.error) {
        setResult(`Error: ${data.error}`);
      } else {
        setResult(`Mean Squared Error: ${data.mse.toFixed(2)}`);
      }
    } catch (error) {
      setResult('Failed to compare data.');
      console.error('Error:', error);  
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Compare New Data with Function</Text>
      
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
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleCompare}
           // Make button translucent on press
        >
          <Text style={styles.buttonText}>Compare Data</Text>
        </TouchableOpacity>
      </View>
      
      {result && <Text style={styles.result}>{result}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#ecf0f1',
  },
  label: {
    fontSize: 18,
    marginVertical: 12,
    color: '#ecf0f1',
  },
  input: {
    borderWidth: 1,
    borderColor: '#95a5a6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ecf0f1',
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#6200EE',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  result: {
    fontSize: 20,
    marginTop: 20,
    textAlign: 'center',
    color: '#e74c3c',
  },
});
