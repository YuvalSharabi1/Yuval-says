import { combineReducers } from 'redux';
import { gameReducer } from './gameReducer'; // Adjust path if necessary

const rootReducer = combineReducers({
  game: gameReducer,
});

export default rootReducer;
