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

export const GET_TOP_CLIPS_WEEK = gql`
    query Query {
        getTopClips {
            _id
            topClips {
            _id
            game_id
            title
            embed_url
            broadcaster_name
            broadcaster_id
            thumbnail_url
            view_count
            created_at
            duration
            vod_offset
            }
        }
    }
`;

export const GET_BROADCASTER_PERFORMANCE = gql`
    query Query($id: String) {
        getBroadcasterPerformance(_id: $id) {
            user_id
            name
            profile_image_url
            total_views
            createdAt
            broadcaster_type
            description
            archive {
            _id
            user_id
            stream_id
            view_count
            createdAt
            }
        }
    }
`;

export const GET_BROADCASTER_PERFORMANCE_NAME = gql`
    query Query($id: String) {
        getBroadcasterPerformanceName(_id: $id) {
            user_id
            name
            profile_image_url
            total_views
            createdAt
            broadcaster_type
            description
            archive {
            _id
            user_id
            stream_id
            view_count
            createdAt
            }
        }
    }
`;

export const GET_GAME_NAME = gql`
query Query($id: String) {
  getGameName(_id: $id) {
    _id
    archive {
      _id
      createdAt
      game_id
      view_count
      totalChannels
    }
    name
    view_count
  }
}
`;

export const SEARCH_BROADCASTER = gql`
query GetBroadcasterName($name: [String]) {
  getBroadcasterName(name: $name) {
    name
    profile_image_url
  }
}
`;

export const SEARCH_GAME = gql`
query GetGameSearch($name: [String]) {
  getGameSearch(name: $name) {
    name
  }
}
`;