import { all, fork, Effect } from 'redux-saga/effects';

// Private sagas
import { userSaga , adminSaga , withdrawalsSaga } from './private';
  
// Public sagas
import { authSaga } from './public';
import { withdrawalSaga } from './public/withdrawal/withdrawalSaga';
import { topEarnersSaga } from './public/topEarners/topEarnersSaga';
import { achievementSaga } from './public/achievement/achievementSaga';

export function* rootSaga(): Generator<Effect, void, unknown> {
  yield all([
    // Private sagas
    fork(userSaga),
    fork(adminSaga),
    fork(withdrawalsSaga),
    // Public sagas
    fork(authSaga),
    fork(withdrawalSaga),
    fork(topEarnersSaga)
  ]);
}
