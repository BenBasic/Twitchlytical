const { gql } = require("apollo-server-express");

const typeDefs = gql`
	type Broadcaster {
		_id: ID
		name: String
	}
	type Game {
		_id: ID
		name: String
	}
	type TopGames {
		_id: ID
		name: String
		box_art_url: String
	}
	type Clips {
		_id: ID
		broadcaster_name: String
		game_id: String
		title: String
		embed_url: String
	}
	type Query {
		Broadcasters: [Broadcaster]
		Broadcaster(_id: ID): Broadcaster
		Games: [Game]
		Game(_id: ID): Game
		TopGames: [TopGames]
		Clips: [Clips]
		getGame: [Game]
		getTopGames: [TopGames]
	}
`;
module.exports = typeDefs;
