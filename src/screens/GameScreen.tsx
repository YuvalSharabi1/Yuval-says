import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {gameActions} from '../redux/actions/gameActions';
import {gameService} from '../services/GameService';

import {StackNavigationProp} from '@react-navigation/stack';
import {helper} from '../utils/Helper';
import GameButton from '../components/Button';
import {gameResults} from '../utils/AsyncStorage';
import {soundService} from '../services/SoundService';

type RootStackParamList = {
  GameScreen: undefined;
  Results: undefined;
};

type GameScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'GameScreen'
>;

interface GameScreenProps {
  navigation: GameScreenNavigationProp;
}

//   Main screen for the Simon game. Manages the game state, user interactions, and handles
//   logic for computer and user turns.
//   @param navigation Navigation prop to navigate between screens.

const GameScreen: React.FC<GameScreenProps> = ({navigation}) => {
  const handleNavigateToResults = () => {
    navigation.navigate('Results'); // Navigate to Results screen
  };
  const dispatch = useDispatch();
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [isUserTurn, setIsUserTurn] = useState<boolean>(false);

  // Handle button click for player
  const handleClick = async (color: 'green' | 'red' | 'yellow' | 'blue') => {
    if (!isGameActive || !isUserTurn) return; // Prevent action if it's not the user's turn

    setActiveButton(color);
    setTimeout(() => setActiveButton(null), 300); // Reset the button opacity after 300ms

    const steps = gameService.getSteps();

    if (color !== steps[index]) {
      soundService.playSound('wrong');
      await helper.delay(500);
      gameService.initSteps();
      setIndex(0); // set the player’s progress in matching the sequence to 0.
      setModalVisible(true); // popup the enter name
      setIsGameActive(false);
      setIsUserTurn(false); // End the user's turn
      return;
    }

    setIndex(index + 1);
    soundService.playSound(color); // Play sound for correct button
    await helper.delay(500);

    if (index === steps.length - 1) {
      setScore(index + 1);
      setIsUserTurn(false);
      await helper.delay(1000);
      await computerTurn(); // Begin the computer's turn
      setIndex(0);
    }
  };

  // Computer turn logic
  const computerTurn = async () => {
    setIsUserTurn(false); // Disable user input during computer's turn
    gameService.addStep();
    const steps = gameService.getSteps();
    for (const step of steps) {
      const validStep = step as 'green' | 'red' | 'yellow' | 'blue';
      setActiveButton(validStep);
      soundService.playSound(validStep); // Play sound for each step in computer's turn
      await helper.delay(1000);
      setActiveButton(null); // Reset the button opacity after each press
      await helper.delay(300); // Wait before the next button press
    }
    setIsUserTurn(true); // Enable user input after computer's turn
  };

  // Start the game
  const startGame = async () => {
    if (isGameActive) return; // Prevent starting the game if it's already active
    setScore(0); // Reset the score to 0
    setIsUserTurn(false); // Disable user input initially
    await computerTurn(); // Start with the computer's turn
    setIndex(0);
    setIsGameActive(true); // Set the game as active
    setIsUserTurn(true); // Enable user input after computer's turn
  };

  // Save player name and score to AsyncStorage
  const handleSaveName = async () => {
    if (!playerName) {
      Alert.alert('Please enter a name');
      return;
    }
    const result = {name: playerName, score};
    dispatch(gameActions.saveResult(result)); // Save to Redux
    await gameResults.savePlayerResult(playerName, score); // Save to AsyncStorage
    setModalVisible(false);
    navigation.navigate('Results');
  };

  const resetGame = () => {
    setScore(0);
    setIndex(0);
    setIsGameActive(false);
    setIsUserTurn(false);
    setModalVisible(false); // Close any active modals
    setPlayerName('');
    gameService.initSteps(); // Reset the steps for the game
  };

  // Retrieve player result from AsyncStorage on mount (if any)
  useEffect(() => {
    const loadPlayerResult = async () => {
      const result = await gameResults.getPlayerResults();
      if (result) {
        setPlayerName(result.name);
        setScore(result.score);
      }
    };
    loadPlayerResult();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Yuval says</Text>
      {isGameActive && <Text style={styles.gameScore}>Score: {score}</Text>}
      <View style={styles.buttonsContainer}>
        {['green', 'red', 'yellow', 'blue'].map(color => (
          <GameButton
            key={color}
            color={color}
            isActive={activeButton === color}
            onPress={() =>
              handleClick(color as 'green' | 'red' | 'yellow' | 'blue')
            }
            isDisabled={!isUserTurn}
          />
        ))}
      </View>

      {!isGameActive && (
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        disabled={!isUserTurn}
        style={styles.resetButton}
        onPress={resetGame}>
        <Text style={styles.resetButtonText}>Reset</Text>
      </TouchableOpacity>
      {/* Opens the popup for writing the name */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalView}>
          <TextInput
            placeholder="Enter your name"
            value={playerName}
            onChangeText={setPlayerName}
            style={styles.input}
          />
          {/* saves the name and navigate to Results screen */}
          <Button title="Save" onPress={handleSaveName} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'darkblue',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 5,
    paddingVertical: 20,
    backgroundColor: 'transparent',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 40,
  },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  startButton: {
    marginTop: 30,
    padding: 18,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 7,
    width: '80%',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    width: '90%',
    borderColor: '#ddd',
    borderWidth: 2,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 30,
    fontSize: 18,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 20,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameScore: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  resetButton: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FF5722',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 7,
    width: '80%',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default GameScreen;
