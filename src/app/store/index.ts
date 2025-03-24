import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ 
      thunk: false,
      serializableCheck: false // Optional: Disable if you have non-serializable values in actions
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production' // Enable DevTools in development
  // Alternatively, for more configuration:
  // devTools: {
  //   name: 'My App',
  //   trace: true, // Enable stack traces for actions
  //   traceLimit: 25,
  // }
});
sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;