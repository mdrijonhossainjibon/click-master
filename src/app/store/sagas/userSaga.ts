import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { api, UserFilters, CreateUserData, UpdateUserData } from '../../services/api';
import {
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
} from '../slices/userSlice';
import { API_CALL } from '@/lib/client';

function* fetchUsers(action: PayloadAction<UserFilters>) : any {
  try {
    
    const { response } = yield call(API_CALL, { url : `/users`});
    
    yield put(fetchUsersSuccess({ data : response  }));
  } catch (error: any) {
    console.log(error)
    yield put(fetchUsersFailure(error.message || 'Failed to fetch users'));
  }
}

function* createUser(action: PayloadAction<CreateUserData>) : any {
  try {
    const response = yield call(api.createUser, action.payload);
    yield put(createUserSuccess(response.data));
    // Refresh the users list after successful creation
    yield put(fetchUsersRequest({}));
    // Refresh stats after successful creation
    yield put(fetchStatsRequest());
  } catch (error: any) {
    yield put(createUserFailure(error.message || 'Failed to create user'));
  }
}

function* updateUser(action: PayloadAction<{ id: string; data: UpdateUserData }>) : any{
  try {
    const response = yield call(api.updateUser, action.payload.id, action.payload.data);
    yield put(updateUserSuccess(response.data));
  } catch (error: any) {
    yield put(updateUserFailure(error.message || 'Failed to update user'));
  }
}

function* deleteUser(action: PayloadAction<string>) {
  try {
    yield call(api.deleteUser, action.payload);
    yield put(deleteUserSuccess(action.payload));
  } catch (error: any) {
    yield put(deleteUserFailure(error.message || 'Failed to delete user'));
  }
}

export function* userSaga() {
  yield takeLatest(fetchUsersRequest.type, fetchUsers);
  yield takeLatest(createUserRequest.type, createUser);
  yield takeLatest(updateUserRequest.type, updateUser);
  yield takeLatest(deleteUserRequest.type, deleteUser);
}