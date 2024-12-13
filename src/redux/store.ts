import {createStore} from 'redux';
import rootReducer from './reducers/rootReducer';

// Create the Redux store with the rootReducer
export const store = createStore(rootReducer);
