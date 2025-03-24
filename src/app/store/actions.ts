import { UserState, UserStats, DirectLink } from './types';

// User State Actions
export const FETCH_USER_STATE = 'FETCH_USER_STATE';
export const FETCH_USER_STATE_SUCCESS = 'FETCH_USER_STATE_SUCCESS';
export const FETCH_USER_STATE_FAILURE = 'FETCH_USER_STATE_FAILURE';

export const fetchUserState = (payload : { email ? : string , telegramId ?: string }) => ({
    type: FETCH_USER_STATE,
    payload 
});

export const fetchUserStateSuccess = (data: UserState) => ({
    type: FETCH_USER_STATE_SUCCESS,
    payload: data
});

export const fetchUserStateFailure = (error: string) => ({
    type: FETCH_USER_STATE_FAILURE,
    payload: error
});

// User Stats Actions
export const FETCH_USER_STATS = 'FETCH_USER_STATS';
export const FETCH_USER_STATS_SUCCESS = 'FETCH_USER_STATS_SUCCESS';
export const FETCH_USER_STATS_FAILURE = 'FETCH_USER_STATS_FAILURE';

export const fetchUserStats = () => ({
    type: FETCH_USER_STATS
});

export const fetchUserStatsSuccess = (data: UserStats) => ({
    type: FETCH_USER_STATS_SUCCESS,
    payload: data
});

export const fetchUserStatsFailure = (error: string) => ({
    type: FETCH_USER_STATS_FAILURE,
    payload: error
});

// Direct Links Actions
export const FETCH_DIRECT_LINKS = 'FETCH_DIRECT_LINKS';
export const FETCH_DIRECT_LINKS_SUCCESS = 'FETCH_DIRECT_LINKS_SUCCESS';
export const FETCH_DIRECT_LINKS_FAILURE = 'FETCH_DIRECT_LINKS_FAILURE';

export const fetchDirectLinks = (category: string) => ({
    type: FETCH_DIRECT_LINKS,
    payload: { category }
});

export const fetchDirectLinksSuccess = (data: DirectLink[]) => ({
    type: FETCH_DIRECT_LINKS_SUCCESS,
    payload: data
});

export const fetchDirectLinksFailure = (error: string) => ({
    type: FETCH_DIRECT_LINKS_FAILURE,
    payload: error
});
