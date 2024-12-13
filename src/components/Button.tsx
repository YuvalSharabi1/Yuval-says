import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

interface GameButtonProps {
  color: string;
  isActive: boolean;
  onPress: () => void;
  isDisabled: boolean;
}

const GameButton: React.FC<GameButtonProps> = ({ color, isActive, onPress, isDisabled }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: color,
          opacity: isActive ? 0.4 : 1,
        },
      ]}
      onPress={onPress}
      disabled={isDisabled}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 80,
    borderRadius: 50,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
});

export default GameButton;
