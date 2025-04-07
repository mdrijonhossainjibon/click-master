'use client';

import { createStore, applyMiddleware, Store, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from '@redux-devtools/extension';

// Private reducers
 
import { adminReducer , userReducer } from './private';
import { withdrawalsReducer } from './private/withdrawals/withdrawalsReducer';

// Public reducers
import { authReducer } from './public/auth/authReducer';
import { directLinksReducer } from './public/directLinks/directLinksReducer';

// Root saga
import { rootSaga } from './rootSaga';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Combine private reducers
const privateReducers = combineReducers({
  user: userReducer,
  admin: adminReducer,
  withdrawals: withdrawalsReducer,
});

// Combine public reducers
const publicReducers = combineReducers({
  auth: authReducer,
  directLinks: directLinksReducer
});

// Root reducer
const rootReducer = combineReducers({
  private: privateReducers,
  public: publicReducers,
});

// Define RootState type
export type RootState = ReturnType<typeof rootReducer>;

// Initial state
const initialState: RootState = {
  private: {
    user: {
      users: [],
      loading: false,
      error: null,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      filters: {},
      stats: {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        newUsersToday: 0
      }
    },
    admin: {
      stats: {
        totalUsers: 0,
        totalWithdrawals: 0,
        pendingWithdrawals: 0,
        newUsersLast24h: 0
      },
      recentActivities: [],
      loading: false,
      error: null
    },
    withdrawals: {
      list: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
      filters: {}
    }
  },
  public: {
    auth: {
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      telegramInitData: null
    },
    directLinks: {
      items: [],
      loading: false,
      error: null
    }
  }
};

// Create store
const store = createStore(
  rootReducer,
  initialState as any,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

// Run root saga
sagaMiddleware.run(rootSaga);

export default store;
