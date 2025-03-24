import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import adminReducer from './slices/adminSlice';
import { UserStatsReducer } from './reducers';

const rootReducer = combineReducers({
  user: userReducer,
  admin: adminReducer,
  ad: adminReducer,
  userStats: UserStatsReducer
});

export default rootReducer;