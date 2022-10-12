const { get } = require("mongoose");
const { Broadcaster } = require("../models");
const { Game } = require("../models");
const { Stream } = require("../models");
const { Clips } = require("../models");
const { totalData } = require("../models");

const resolvers = {
	Query: {
		Broadcaster: async () => {
			return Broadcaster.find();
		},
		getBroadcaster: async (parent, { _id }) => {
			return Broadcaster.findOne({ _id });
		},
		Games: async () => {
			return Game.find();
		},
		getGame: async (parent, { _id }) => {
			return Game.findOne({ _id });
		},
		Clips: async () => {
			return Clips.find();
		},
		getStream: async (parent, { _id }) => {
			return Stream.find();
		},
	},
};

module.exports = resolvers;
