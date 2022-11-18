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