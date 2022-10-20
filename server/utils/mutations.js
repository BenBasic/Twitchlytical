import { gql } from "@apollo/client";

export const ADD_GAME = gql`
    mutation AddGame($gameData: GameInput!) {
        addGame(gameData: $gameData) {
            _id
            name
            box_art_url
            view_count
        }
    }
`;