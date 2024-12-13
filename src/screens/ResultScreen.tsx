import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { gameActions } from '../redux/actions/gameActions';
import { gameResults } from '../utils/AsyncStorage';



type RootStackParamList = {
  Game: undefined;
};

type ResultsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Game'>;

interface ResultsScreenProps {
  navigation: ResultsScreenNavigationProp;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ navigation }) => {
  const [storedResults, setStoredResults] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchResults = async () => {
      const results = await gameResults.getPlayerResults();
      setStoredResults(results || []); // Handle empty results gracefully
    };
    fetchResults();
  }, []);

  const renderItem = ({ item }: { item: { name: string; score: number } }) => (
    <View style={styles.resultItem}>
      <Text style={styles.resultText}>{item.name}: {item.score}</Text>
    </View>
  );

  const handleStartNewGame = () => {
    dispatch(gameActions.resetGame());
    navigation.navigate('Game');
  };

  return (
    <View style={styles.container}>
      {storedResults.length === 0 ? (
        <Text style={styles.noResultsText}>No results available</Text>
      ) : (
        <FlatList
          data={storedResults}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.name}-${item.score}-${index}`}
          style={styles.resultsList}
        />
      )}
      <TouchableOpacity style={styles.startButton} onPress={handleStartNewGame}>
        <Text style={styles.startButtonText}>Start New Game</Text>
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
  noResultsText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultsList: {
    width: '100%',
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
  resultText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  startButton: {
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
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ResultsScreen;
