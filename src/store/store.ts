import {combineReducers, configureStore, Tuple} from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import { persistReducer } from 'redux-persist'
import {thunk} from 'redux-thunk'
import storage from 'redux-persist/lib/storage';

const reducers = combineReducers({
    userData: userReducer
});

const persistConfig = {
    key: 'jewelery',
    storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);


export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware:  () => new Tuple(thunk)
}, )