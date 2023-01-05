// Setting the Stats type to a set of expected properties and their expected value types
export type Stats = {
    name: string;
    views: number;
    trending?: boolean;
    image?: string;
};

// Setting the CardColor type to a set of expected properties and their expected value types
export type CardColor = {
    primary: string;
    secondary: string;
};

export type DayData = {
    peak: number;
    avg: number;
    date: Date;
};

export type ClipModalProps = {
    title: string;
    broadcasterName: string;
    url: string;
    thumbnail: string;
    createdAt: string;
    views: number;
    home: boolean;
}

export type ArchiveViews = {
    _id: string;
    view_count: number;
}

export type ArchiveTotals = {
    _id: string;
    createdAt: Date;
    user_id?: string | null;
    game_id?: string | null;
    stream_id?: string | null;
    total_id: string;
    view_count: number;
    totalChannels: number;
    totalGames: number; 
}

export type TopTotalDB = {
    _id: string;
    totalViewers: number;
    avgTotalViewers: number;
    totalChannels: number;
    avgTotalChannels: number;
    totalGames: number;
    avgTotalGames: number;
    archive: [ArchiveTotals];
}

export type BroadcasterArchive = {
    _id: string;
    user_id: string;
    stream_id: string;
    view_count: number;
    createdAt: Date;
}

export type ProfileHeaderData = {
    user_id: string;
    name: string;
    profile_image_url: string;
    description: string;
    total_views: number;
    createdAt: string;
    broadcaster_type: string;
    lastLive: string | undefined;
}


export interface ProfileHeaderProps {
    data: ProfileHeaderData;
    views: number[];
}


export interface BroadcasterStatProps {
    data: [BroadcasterArchive];
    userId: string;
    username: string;
}

export interface ProfileClipsProps {
    userId: string;
    game?: boolean;
}

export type GameHeaderData = {
    game_id: string;
    name: string;
    liveViews: number;
}

export interface GameHeaderProps {
    data: GameHeaderData;
    views: number[];
    channels: number[];
    gameProps: [TopGames];
}


export interface GetTotal {
    totalVal: TopTotalDB;
    loading: boolean;
}

export interface TopGames {
    _id: string;
    name: string;
    view_count: number;
    value: number;
    archive: [ArchiveViews];
}

export interface TopStreams {
    _id: string;
    user_id: string;
    user_name: string;
    game_id?: string | null;
    game_name: string;
    title: string;
    viewer_count: number;
    peak_views: number;
    thumbnail_url?: string | null;
    started_at?: string | null
}

export interface TopBroadcasters {
    _id: string;
    user_id: string;
    profile_image_url: string;
}

export interface TopProps {
    gameProps: [TopGames];
    streamProps: [TopStreams];
    broadcasterProps: [TopBroadcasters];
    loading: boolean;
}

export interface PieContainerProps {
    data: [TopGames];
    streamData: [TopStreams];
    totalVal: number;
    loading: boolean;
}

export interface PieProps {
    dataSet: Stats[];
    totalVal: number;
    type: string;
    user?: {name: string, views: number};
    extraTip?: ExtraDayData[];
}

export interface ClipCollectionProps {
    data: any[];
    home: boolean;
    loading: boolean;
}

// Assigning StatCardProps interface for passing values into RankCard component
export interface StatCardProps {
    viewType: string;
    statInfo: Stats;
    color: CardColor;
    rankIndex: number;
    rankColor: CardColor;
};

export interface WeeklyViewData {
    day1: DayData;
    day2: DayData;
    day3: DayData;
    day4: DayData;
    day5: DayData;
    day6: DayData;
    day7: DayData;
};

export interface WeeklyViewProps {
    dayProps: WeeklyViewData;
    type: string;
};

export type ProfileData = {
    peak: number;
    avg: number;
    date: Date;
    duration: string;
    title: string;
};

export type GameData = {
    viewPeak: number;
    viewAvg: number;
    channelPeak: number;
    channelAvg: number;
    date: Date;
    title: string;
};

export interface GameStatProps {
    chartData: GameData[];
};

export type ExtraDayData = {
    name: string;
    views: number;
    streams: number;
};

export interface BroadcasterLatest {
    profileData: ProfileData[] | undefined;
    gameData?: GameData[] | undefined;
    type: string;
};