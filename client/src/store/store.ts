import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import {
  CombinedState,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import mainSlice from './slices/mainSlice';
import userSlice from './slices/userSlice';
import { googleApi } from './slices/api';
import menuSlice from './slices/menuSlice';
import hackathonSlice from './slices/hackathonSlice';
import iDSlice from './slices/iDSlice';

export type RootState = {
  main: any;
  user: any;
  menu: any;
  hackathon: any;
  identification: any;
};

const reducers = combineReducers<CombinedState<RootState>>({
  main: mainSlice,
  user: userSlice,
  menu: menuSlice,
  hackathon: hackathonSlice,
  identification: iDSlice,
  [googleApi.reducerPath]: googleApi.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([googleApi.middleware]);
  },
});

export default store;
