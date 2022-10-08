const { Broadcaster } = require("../models");

const resolvers = {
	Query: {
		Broadcaster: async () => {
			return Broadcaster.find();
		},
	},
};
module.exports = resolvers;
