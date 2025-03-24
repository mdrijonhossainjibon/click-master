import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
 
import { rootSaga } from './sagas';
import rootReducer from './rootReducer';


const sagaMiddleware = createSagaMiddleware();

 
 
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ 
      thunk: true, // Enable thunk for createAsyncThunk
      serializableCheck: false
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export actions
export * from './actions';
// Export types
export * from './types';
// Export ad actions
export * from './slices/adSlice';