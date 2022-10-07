const { gql } = require("apollo-server-express");

const typeDefs = gql`
	type TwitchChannel {
		_id: ID
		name: String
	}

	type Query {
		twitchChannels: [TwitchChannel]
	}
`;
module.exports = typeDefs;
