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

// Assigning StatCardProps interface for passing values into RankCard component
export interface StatCardProps {
    statInfo: Stats;
    color: CardColor;
};

