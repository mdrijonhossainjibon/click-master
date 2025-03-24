import { call, put, takeLatest } from 'redux-saga/effects';
import { API_CALL } from '@/lib/client';
import {
  fetchDashboardStatsRequest,
  fetchDashboardStatsSuccess,
  fetchDashboardStatsFailure,
  fetchRecentActivitiesRequest,
  fetchRecentActivitiesSuccess,
  fetchRecentActivitiesFailure
} from '../slices/adminSlice';

interface ApiResponse<T> {
  response: {
    stats?: {
      totalUsers: number;
      totalWithdrawals: number;
      pendingWithdrawals: number;
      newUsersLast24h: number;
    };
    activities?: Array<{
      id: string;
      details: string;
      createdAt: string;
    }>;
  } & T;
}

function* fetchDashboardStats(): Generator {
  try {
    const response: ApiResponse<{}> = yield call(API_CALL, { url: '/api/admin/users' });
    if (response.response.stats) {
      yield put(fetchDashboardStatsSuccess(response.response.stats));
    }
  } catch (error: any) {
    yield put(fetchDashboardStatsFailure(error?.message || 'Failed to fetch dashboard stats'));
  }
}

function* fetchRecentActivities(): Generator {
  try {
    const response: ApiResponse<{}> = yield call(API_CALL, { url: '/api/admin/activity' });
    yield put(fetchRecentActivitiesSuccess(response.response.activities || []));
  } catch (error: any) {
    yield put(fetchRecentActivitiesFailure(error?.message || 'Failed to fetch recent activities'));
  }
}

export function* adminSaga() {
  yield takeLatest(fetchDashboardStatsRequest.type, fetchDashboardStats);
  yield takeLatest(fetchRecentActivitiesRequest.type, fetchRecentActivities);
}