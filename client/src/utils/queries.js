import { gql } from "@apollo/client";

export const GET_TOTAL_DATA = gql`
    query Query {
        getTotalData {
            _id
            totalViewers
            avgTotalViewers
            totalChannels
            avgTotalChannels
            totalGames
            avgTotalGames
            archive {
            _id
            createdAt
            user_id
            game_id
            stream_id
            total_id
            view_count
            totalChannels
            totalGames
            }
        }
    }
`;

export const GET_DATA_DATE = gql`
    query Query($date: Date) {
        getTotalData(date: $date) {
            _id
            totalViewers
            avgTotalViewers
            totalChannels
            avgTotalChannels
            totalGames
            avgTotalGames
            archive {
                _id
                createdAt
                user_id
                game_id
                stream_id
                total_id
                view_count
                totalChannels
                totalGames
            }
        }
    }
`;

export const GET_TOP_GAME_WEEK = gql`
    query Query {
        getTopGames {
            _id
            topGames {
                _id
                name
                view_count
                archive {
                    _id
                    view_count
                }
            }
        }
    }
`

