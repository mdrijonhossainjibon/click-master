import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserFilters, GetUsersResponse, CreateUserData } from '../../services/api';

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersToday: number;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  pageSize: number;
  filters: UserFilters;
  stats: UserStats;
}

const initialState: UserState = {
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
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUsersRequest: (state, action: PayloadAction<UserFilters>) => {
      state.loading = true;
      state.error = null;
      state.filters = action.payload;
    },
    fetchUsersSuccess: (state, action: PayloadAction<GetUsersResponse>) => {
      state.loading = false;
      state.users = action.payload.data.data;
      state.total = action.payload.data.total;
      state.currentPage = action.payload.data.page;
      state.pageSize = action.payload.data.pageSize;
    },
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    createUserRequest: (state, action: PayloadAction<CreateUserData>) => {
      state.loading = true;
      state.error = null;
    },
    createUserSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.users = [action.payload, ...state.users];
      state.total += 1;
    },
    createUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUserRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.users = state.users.map(user => 
        user.id === action.payload.id ? action.payload : user
      );
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.users = state.users.filter(user => user.id !== action.payload);
      state.total -= 1;
    },
    deleteUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchStatsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStatsSuccess: (state, action: PayloadAction<UserStats>) => {
      state.loading = false;
      state.stats = action.payload;
    },
    fetchStatsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  createUserRequest,
  createUserSuccess,
  createUserFailure,
  updateUserRequest,
  updateUserSuccess,
  updateUserFailure,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailure,
  fetchStatsRequest,
  fetchStatsSuccess,
  fetchStatsFailure,
} = userSlice.actions;

export default userSlice.reducer;