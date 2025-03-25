import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface AdState {
    loading: boolean;
    error: string | null;
    lastWatchTime: string | null;
}

const initialState: AdState = {
    loading: false,
    error: null,
    lastWatchTime: null
};

export const watchAd = createAsyncThunk(
    'ad/watchAd',
    async ({ telegramId }: { telegramId : string }, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/user-state', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    telegramId,
                    action: 'watch_ad'
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to record ad view');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to watch ad');
        }
    }
);

const adSlice = createSlice({
    name: 'ad',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(watchAd.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(watchAd.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                state.lastWatchTime = new Date().toISOString();
            })
            .addCase(watchAd.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default adSlice.reducer;
