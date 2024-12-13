import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  ResultList: undefined;
};

type ResultListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ResultList'
>;

interface Result {
  name: string;
  score: number;
  id: string;
}

interface ResultListProps {
  navigation: ResultListScreenNavigationProp;
  state: {
    results: Result[];
  };
}

const ResultList: React.FC<ResultListProps> = ({ navigation, state }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={state.results}
        renderItem={({ item }: { item: Result }) => (
          <View style={styles.resultItem}>
            <Text style={styles.resultName}>{item.name}</Text>
            <Text style={styles.resultScore}>{item.score}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        style={styles.resultsList}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  resultsList: {
    width: '100%',
    marginBottom: 20,
  },
  resultItem: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  resultName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resultScore: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  backButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ResultList;
