export interface UserState {
    balance: number;
    adsWatched: number;
    timeRemaining: number;
    directLinks: any[];
    loading: boolean;
    error: string | null;
}

export interface UserStats {
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    inactiveUsers: number;
}

export interface DirectLink {
    id: string;
    title: string;
    url: string;
    icon: string;
    gradient: {
        from: string;
        to: string;
    };
    clicks: number;
    position: number;
}
