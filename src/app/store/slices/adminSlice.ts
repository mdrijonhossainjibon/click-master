import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardStats {
  totalUsers: number;
  totalWithdrawals: number;
  pendingWithdrawals: number;
  newUsersLast24h: number;
}

interface Activity {
  id: string;
  details: string;
  createdAt: string;
}

interface AdminState {
  stats: DashboardStats;
  recentActivities: Activity[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  stats: {
    totalUsers: 0,
    totalWithdrawals: 0,
    pendingWithdrawals: 0,
    newUsersLast24h: 0
  },
  recentActivities: [],
  loading: false,
  error: null
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    fetchDashboardStatsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDashboardStatsSuccess: (state, action: PayloadAction<DashboardStats>) => {
      state.loading = false;
      state.stats = action.payload;
    },
    fetchDashboardStatsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchRecentActivitiesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRecentActivitiesSuccess: (state, action: PayloadAction<Activity[]>) => {
      state.loading = false;
      state.recentActivities = action.payload;
    },
    fetchRecentActivitiesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchDashboardStatsRequest,
  fetchDashboardStatsSuccess,
  fetchDashboardStatsFailure,
  fetchRecentActivitiesRequest,
  fetchRecentActivitiesSuccess,
  fetchRecentActivitiesFailure
} = adminSlice.actions;

export default adminSlice.reducer;