// src/redux/reducers/gameReducer.ts
interface GameResult {
    playerName: string;
    score: number;
  }
  
  interface SaveResultAction {
    type: 'SAVE_RESULT';
    payload: GameResult;
  }
  
  interface ResetGameAction {
    type: 'RESET_GAME';
  }
  
  type GameAction = SaveResultAction | ResetGameAction;
  
  const initialState = {
    sequence: [] as string[], // Current sequence
    score: 0, // Current score
    results: [] as GameResult[], // High scores list
  };
  
  export const gameReducer = (state = initialState, action: GameAction) => {
    switch (action.type) {
      case 'SAVE_RESULT':
        return {
          ...state,
          results: [...state.results, action.payload]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10),
        };
      
      // Handle the reset action
      case 'RESET_GAME':
        return {
          ...state,
          sequence: [], // Reset sequence
          score: 0,     // Reset score
        };
  
      default:
        return state;
    }
  };
  