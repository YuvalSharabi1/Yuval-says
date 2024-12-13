import AsyncStorage from '@react-native-async-storage/async-storage';

const RESULTS_KEY = 'gameResults';

class GameResults {
  public async savePlayerResult(name: string, score: number) {
    try {
      const storedResults = await this.getPlayerResults();
      const updatedResults = [...storedResults, {name, score}];
      const sortedResults = updatedResults
        .sort((a, b) => b.score - a.score) // Sort by score descending
        .slice(0, 10); // Keep only the top 10 results
      await AsyncStorage.setItem(RESULTS_KEY, JSON.stringify(sortedResults));
    } catch (error) {
      console.error('Failed to save player result:', error);
    }
  }

  public async getPlayerResults() {
    try {
      const result = await AsyncStorage.getItem(RESULTS_KEY);
      return result ? JSON.parse(result) : [];
    } catch (error) {
      console.error('Failed to get player results:', error);
      return [];
    }
  }
}

export const gameResults = new GameResults();
