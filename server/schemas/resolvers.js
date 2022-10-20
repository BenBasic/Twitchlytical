const { get } = require("mongoose");
const { Broadcaster } = require("../models");
const { Game } = require("../models");
const { Stream } = require("../models");
const { Clips } = require("../models");
const { ArchiveData } = require("../models");
const { TotalData } = require("../models");


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

			const total = await TotalData.updateOne(
				{ _id: archiveData.total_id },
				{ $addToSet: { archive: newArchive._id } },
				{ new: true }
			);

			if (!game) {
				console.log("No game exists")
			};

			if (!broadcaster) {
				console.log("No broadcaster exists")
			};

			if (!total) {
				console.log("No TotalData exists")
			};

			return game;
		},

		updateTotalData: async (parent, { totalData, date }) => {
			const total = await TotalData.findOne({ _id: totalData._id })
			.populate({
				path: 'archive',
				model: 'ArchiveData',
			})

			// If there is no TotalData, create a new TotalData document
            if (!total) {
				const newTotal = await TotalData.create(totalData);
				return newTotal;
			} else {

				// Converting the string date passed in to a Date value (needed for checking date ranges)
				const dateFormat = new Date(date);

				console.log("total is")
				console.log(total)

				// Assigning to the archives for TotalData
				const totalArchive = total.archive

				// This function will reference archives after a specified date and provide a rounded average value
				const getAverage = async (array, date, keyValue, currentVal) => {
					// Total and Count will keep track of total values and how many of them there are to divide them into an average number
					let total = 0;
					let count = 0;

					// If there is a live value detected, then add it to the total and set counter to 1 by default
					if (currentVal) {
						total = currentVal
						count = 1;
					};

					// Cycles through the returned list of archive data and adds them to the total and count values
					for (i = 0; i < array.length; i++) {
						if (array[i].createdAt > date) {
							total = total + array[i][keyValue];
							count++
						};
					};

					// Getting the average value by dividing total and count
					let average = total / count;

					// Rounding the average, without this the database tends to throw errors due to long decimal values
					let averageRounded = average.toFixed();

					console.log("Total is " + total + ". With " + count + " items")
					console.log("Average is " + average)
					console.log("Average ROUNDED is " + averageRounded)

					// Returning the rounded average result
					return averageRounded;
				};

				if (totalArchive.length > 0) {

					// Grabbing the averages for views, channels, and games

					const viewAvg = await getAverage(totalArchive, dateFormat, "view_count", totalData.totalViewers);

					const channelAvg = await getAverage(totalArchive, dateFormat, "totalChannels", totalData.totalChannels);
	
					const gameAvg = await getAverage(totalArchive, dateFormat, "totalGames", totalData.totalGames);
	
					const totalAverages = {
						avgViews: viewAvg,
						avgChannels: channelAvg,
						avgGames: gameAvg,
					};

					// Updating the TotalData with current stats and averaged results
					await total.update({
						totalViewers: totalData.totalViewers,
						avgTotalViewers: viewAvg,
						totalChannels: totalData.totalChannels,
						avgTotalChannels: channelAvg,
						totalGames: totalData.totalGames,
						avgTotalGames: gameAvg,
					}, { new: true });

				} else {

					// Setting the TotalData to current live results because there arent previous archives, so no averages yet
					await total.update({
						totalViewers: totalData.totalViewers,
						avgTotalViewers: totalData.totalViewers,
						totalChannels: totalData.totalChannels,
						avgTotalChannels: totalData.totalChannels,
						totalGames: totalData.totalGames,
						avgTotalGames: totalData.totalGames,
					}, { new: true });
				};

				// Returning the TotalData with new values
				return total;
			};
		},


	},
};

module.exports = resolvers;
