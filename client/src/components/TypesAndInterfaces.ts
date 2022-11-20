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