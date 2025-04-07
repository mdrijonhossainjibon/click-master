import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

// Base selectors
export const selectPrivateUser = (state: RootState) => state.private.user;
export const selectAuthUser = (state: RootState) => state.public.auth.user;

// Memoized selectors
export const selectUserStats = createSelector(
    [selectPrivateUser, selectAuthUser],
    (privateUser, authUser) => ({
        loading: privateUser.loading,
        balance: authUser?.balance || 0,
        adsWatched: authUser?.adsWatched || 0,
        timeRemaining: authUser?.timeRemaining || 0
    })
);
