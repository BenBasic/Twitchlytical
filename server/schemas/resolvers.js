const { get } = require("mongoose");
const { Broadcaster } = require("../models");
const { Game } = require("../models");
const { Stream } = require("../models");
const { Clips } = require("../models");
const { ArchiveData } = require("../models");
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
	Mutation: {

        addGame: async (parent, { gameData }) => {
            const game = await Game.findOne({ _id: gameData._id });

            if (!game) {
				const newGame = await Game.create(gameData);
				return newGame;
			} else {
				await game.update({ view_count: gameData.view_count }, { new: true });
				return game;
			};

        },

		addBroadcasterData: async (parent, { broadcasterData }) => {
            const broadcaster = await Broadcaster.findOne({ user_id: broadcasterData.user_id });

            if (!broadcaster) {
				const newBroadcaster = await Broadcaster.create(broadcasterData);
				return newBroadcaster;
			} else {
				await broadcaster.update({
					description: broadcasterData.description,
					profile_image_url: broadcasterData.profile_image_url,
					view_count: broadcasterData.view_count,
					total_views: broadcasterData.total_views,
				}, { new: true });
				return broadcaster;
			};
		},

		addArchiveData: async (parent, { archiveData }) => {
			const newArchive = await ArchiveData.create(archiveData);

			const game = await Game.updateOne(
				{ _id: archiveData.game_id },
				{ $addToSet: { archive: newArchive._id } },
				{ new: true }
			);

			const broadcaster = await Broadcaster.updateOne(
				{ user_id: archiveData.user_id },
				{ $addToSet: { archive: newArchive._id } },
				{ new: true }
			);

			if (!game) {
				console.log("No game exists")
			};

			if (!broadcaster) {
				console.log("No broadcaster exists")
			};

			return game;
		},


	},
};

module.exports = resolvers;
