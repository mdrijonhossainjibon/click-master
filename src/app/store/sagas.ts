import { call, put, takeLatest, all, ActionPattern } from 'redux-saga/effects';
import {
    FETCH_USER_STATE,
    FETCH_USER_STATS,
    FETCH_DIRECT_LINKS,
    fetchUserStateSuccess,
    fetchUserStateFailure,
    fetchUserStatsSuccess,
    fetchUserStatsFailure,
    fetchDirectLinksSuccess,
    fetchDirectLinksFailure
} from './actions';
import { UserState, UserStats, DirectLink } from './types';

// API functions
async function fetchUserStateAPI(payload : { email ? : string , telegramId ?: string }) {
    const response = await fetch(`/api/user-state?${payload.email ?`email=${payload.email}` : ''}${payload.telegramId ?`&telegramId=${payload.telegramId}` : ''}`);
    if (!response.ok) throw new Error('Failed to fetch user state');
    const data = await response.json();
    return data.success ? data : Promise.reject(new Error('Failed to fetch user state'));
}

async function fetchUserStatsAPI() {
    const response = await fetch('/api/users/stats');
    if (!response.ok) throw new Error('Failed to fetch user stats');
    const { data } = await response.json();
    return data;
}

async function fetchDirectLinksAPI(category: string) {
    const response = await fetch(`/api/direct-links?category=${category}`);
    if (!response.ok) throw new Error('Failed to fetch direct links');
    const { data } = await response.json();
    return data;
}

// Sagas
function* fetchUserStateSaga(action:  { payload: { email ? : string , telegramId ?: string } }): Generator<any, void, UserState> {
    try {
        const data = yield call(fetchUserStateAPI,  action.payload);
        yield put(fetchUserStateSuccess(data));
    } catch (error) {
        yield put(fetchUserStateFailure(error instanceof Error ? error.message : 'Unknown error'));
    }
}

function* fetchUserStatsSaga(): Generator<any, void, UserStats> {
    try {
        const data = yield call(fetchUserStatsAPI);
        yield put(fetchUserStatsSuccess(data));
    } catch (error) {
        yield put(fetchUserStatsFailure(error instanceof Error ? error.message : 'Unknown error'));
    }
}

function* fetchDirectLinksSaga(action: { payload: { category: string } }): Generator<any, void, DirectLink[]> {
    try {
        const data = yield call(fetchDirectLinksAPI, action.payload.category);
        yield put(fetchDirectLinksSuccess(data));
    } catch (error) {
        yield put(fetchDirectLinksFailure(error instanceof Error ? error.message : 'Unknown error'));
    }
}

// Root saga
export function* rootSaga(): Generator {
    yield all([
        takeLatest(FETCH_USER_STATE as ActionPattern<any>, fetchUserStateSaga),
        takeLatest(FETCH_USER_STATS as ActionPattern<any>, fetchUserStatsSaga),
        takeLatest(FETCH_DIRECT_LINKS as ActionPattern<any>, fetchDirectLinksSaga)
    ]);
}
