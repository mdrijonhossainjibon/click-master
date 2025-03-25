import { UserState, UserStats, DirectLink } from './types';
import {
    FETCH_USER_STATE,
    FETCH_USER_STATE_SUCCESS,
    FETCH_USER_STATE_FAILURE,
    FETCH_USER_STATS,
    FETCH_USER_STATS_SUCCESS,
    FETCH_USER_STATS_FAILURE,
    FETCH_DIRECT_LINKS,
    FETCH_DIRECT_LINKS_SUCCESS,
    FETCH_DIRECT_LINKS_FAILURE
} from './actions';

interface AppState {
    userState: UserState;
    userStats: {
        data: UserStats | null;
        loading: boolean;
        error: string | null;
    };
    directLinks: {
        data: DirectLink[];
        loading: boolean;
        error: string | null;
    };
}

const initialState: AppState = {
    userState: {
        balance: 0,
        adsWatched: 0,
        timeRemaining: 0,
        directLinks: [],
        loading: false,
        error: null
    },
    userStats: {
        data: null,
        loading: false,
        error: null
    },
    directLinks: {
        data: [],
        loading: false,
        error: null
    }
};

export const UserStatsReducer = (state = initialState, action: any): AppState => {
    switch (action.type) {
        // User State
        case FETCH_USER_STATE:
            return {
                ...state,
                userState: {
                    ...state.userState,
                    loading: true,
                    error: null
                }
            };
        case FETCH_USER_STATE_SUCCESS:
            return {
                ...state,
                userState: {
                    ...action.payload,
                    loading: false,
                    error: null
                }
            };
        case FETCH_USER_STATE_FAILURE:
            return {
                ...state,
                userState: {
                    ...state.userState,
                    loading: false,
                    error: action.payload
                }
            };

        // User Stats
        case FETCH_USER_STATS:
            return {
                ...state,
                userStats: {
                    ...state.userStats,
                    loading: true,
                    error: null
                }
            };
        case FETCH_USER_STATS_SUCCESS:
            return {
                ...state,
                userStats: {
                    data: action.payload,
                    loading: false,
                    error: null
                }
            };
        case FETCH_USER_STATS_FAILURE:
            return {
                ...state,
                userStats: {
                    ...state.userStats,
                    loading: false,
                    error: action.payload
                }
            };

        // Direct Links
        case FETCH_DIRECT_LINKS:
            return {
                ...state,
                directLinks: {
                    ...state.directLinks,
                    loading: true,
                    error: null
                }
            };
        case FETCH_DIRECT_LINKS_SUCCESS:
            return {
                ...state,
                directLinks: {
                    data: action.payload,
                    loading: false,
                    error: null
                }
            };
        case FETCH_DIRECT_LINKS_FAILURE:
            return {
                ...state,
                directLinks: {
                    ...state.directLinks,
                    loading: false,
                    error: action.payload
                }
            };

        default:
            return state;
    }
};
