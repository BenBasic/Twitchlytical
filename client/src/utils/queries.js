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

export const GET_TOP_STREAM_WEEK = gql`
    query Query {
        getTopStreams {
            _id
            topStreams {
            _id
            user_id
            user_name
            game_id
            game_name
            title
            viewer_count
            peak_views
            thumbnail_url
            started_at
            }
        }
    }
`

export const GET_BROADCASTER_USER_ID = gql`
    query Query($id: [String]) {
        getBroadcaster(_id: $id) {
            _id
            user_id
            profile_image_url
        }
    }
`;

export const GET_CURRENT_DATA = gql`
    query Query {
        getCurrentData {
            totalViewers
            totalChannels
            totalGames
        }
    }
`;