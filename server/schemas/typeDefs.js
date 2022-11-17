const { gql } = require("apollo-server-express");

const typeDefs = gql`
	scalar Date
	type Broadcaster {
		_id: ID
		user_id: String
		name: String
		description: String
		language: String
		profile_image_url: String
		view_count: Int
		total_views: Int
		broadcaster_type: String
		createdAt: Date
		archive: [ArchiveData]
	}
	input BroadcasterInput {
		user_id: String
		name: String
		description: String
		language: String
		profile_image_url: String
		view_count: Int
		total_views: Int
		broadcaster_type: String
		createdAt: Date
	}
	type Game {
		_id: ID
		name: String
		box_art_url: String
		view_count: Int
		archive: [ArchiveData]
	}
	input GameInput {
		_id: ID
		name: String
		box_art_url: String
		view_count: Int
	}
	type ArchiveData {
		_id: ID
		createdAt: Date
		user_id: String
		game_id: String
		stream_id: String
		total_id: String
		view_count: Int
		totalChannels: Int
		totalGames: Int
	}
	input ArchiveDataInput {
		user_id: String
		game_id: String
		stream_id: String
		total_id: String
		view_count: Int
		totalChannels: Int
		totalGames: Int
	}
	type Stream {
		_id: ID
		user_id: String
		user_name: String
		game_id: String
		game_name: String
		title: String
		tags_ids: [String]
		viewer_count: Int
		peak_views: Int
		thumbnail_url: String
		started_at: String
		language: String
	}
	input StreamInput {
		_id: ID
		user_id: String
		user_name: String
		game_id: String
		game_name: String
		title: String
		viewer_count: Int
		peak_views: Int
		thumbnail_url: String
		started_at: String
		language: String
	}
	type TotalData {
		_id: ID
		totalViewers: Int
		avgTotalViewers: Int
		totalChannels: Int
		avgTotalChannels: Int
		totalGames: Int
		avgTotalGames: Int
		archive: [ArchiveData]
		topGames: [Game]
		topStreams: [Stream]
	}
	input TotalDataInput {
		_id: ID
		totalViewers: Int
		avgTotalViewers: Int
		totalChannels: Int
		avgTotalChannels: Int
		totalGames: Int
		avgTotalGames: Int
	}

	type Clips {
		_id: ID
		game_id: String
		title: String
		embed_url: String
		broadcaster_name: String
		broadcaster_id: String
		creator_id: String
		creator_name: String
		url: String
		thumbnail_url: String
		view_count: Int
		created_at: String
		duration: String
		vod_offset: Int
	}

	type Query {
		Broadcaster: [Broadcaster]
		getBroadcaster(_id: [String]): [Broadcaster]
		Games: [Game]
		getGame(_id: ID): Game
		Clips: [Clips]
		getStream: [Stream]
		getTotalData(date: Date): [TotalData]
		getCurrentData: [TotalData]
		getTopGames: [TotalData]
		getTopStreams: [TotalData]
	}

	type Mutation {
		addGame(gameData: GameInput!): Game
		addStream(streamData: StreamInput!): Stream
		addBroadcasterData(broadcasterData: BroadcasterInput!): Broadcaster
		addArchiveData(archiveData: ArchiveDataInput!): ArchiveData
		updateTotalData(totalData: TotalDataInput!, date: String): TotalData
		updateTopGames(_id: ID, games: [ID]): TotalData
		updateTopStreams(_id: ID): TotalData
	}

`;
module.exports = typeDefs;
