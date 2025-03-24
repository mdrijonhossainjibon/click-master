import { all, fork } from 'redux-saga/effects';
import { userSaga } from './sagas/userSaga';
import { adminSaga } from './sagas/adminSaga';

export default function* rootSaga() {
  yield all([
    fork(userSaga),
    fork(adminSaga),
  ]);
}