// gameActions.ts
export const gameActions = {
    saveResult: (result: { name: string; score: number }) => ({
      type: 'SAVE_RESULT',
      payload: result,
    }),
  
    // Add resetGame action
    resetGame: () => ({
      type: 'RESET_GAME',
    }),
  };
  