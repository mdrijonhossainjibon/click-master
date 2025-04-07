import { all, fork, Effect } from 'redux-saga/effects';

// Private sagas
import { userSaga , adminSaga , withdrawalsSaga } from './private';
  
// Public sagas
import { authSaga } from './public';

export function* rootSaga(): Generator<Effect, void, unknown> {
  yield all([
    // Private sagas
    fork(userSaga),
    fork(adminSaga),
    fork(withdrawalsSaga),
    // Public sagas
    fork(authSaga)
  ]);
}
