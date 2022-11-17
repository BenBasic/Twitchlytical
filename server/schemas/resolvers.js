const { get } = require("mongoose");
const { Broadcaster } = require("../models");
const { Game } = require("../models");
const { Stream } = require("../models");
const { Clips } = require("../models");
const { ArchiveData } = require("../models");
const { TotalData } = require("../models");

const now = new Date();

const resolvers = {
	Query: {
		Broadcaster: async () => {
			return Broadcaster.find();
		},
		getBroadcaster: async (parent, { _id }) => {
			return Broadcaster.find({ user_id: _id });
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
		getTotalData: async (parent, { date }) => {
            const totalData = await TotalData.find({}).populate("archive");

            if (!totalData) {
				console.log("No data was found")
			};

			if (!date) {
				console.log("No args")
				return totalData;
			} else {
				console.log("This is args")
				const newDate = new Date(date);
				// NOTE: Should add a less than check too, so it can check for ranges
				const archives = totalData?.[0]?.archive.filter(value => value.createdAt > newDate)
				console.log(archives)
				totalData[0].archive = archives
				return totalData;
			}
        },
		getCurrentData: async (parent, args) => {
			const totalData = await TotalData.find({});

			if (!totalData) {
				console.log("No data was found")
			} else {
				return totalData
			}
		},
		getTopGames: async (parent, args) => {
			const topGames = await TotalData.find({})
			.populate({
				path: 'topGames',
				model: 'Game',
				populate: {
					path: 'archive',
					model: 'ArchiveData'
				}
			})
			
			// console.log("TOP GAMES IS")
			// console.log(topGames[0].topGames[0].archive)

			if (!topGames) {
				console.log("No Total Data!")
			};

			return topGames
		},
		getTopStreams: async (parent, args) => {
			const topStreams = await TotalData.find({})
			.populate({
				path: 'topStreams',
				model: 'Stream',
			})

			if (!topStreams) {
				console.log("No Total Data!")
			};

			return topStreams
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

		addStream: async (parent, { streamData }) => {
            const stream = await Stream.findOne({ _id: streamData._id });

			const topStreams = await TotalData.find({})
			.populate({
				path: 'topStreams',
				model: 'Stream',
			})

			const lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)

			console.log(topStreams[0].topStreams)
			if (topStreams[0].topStreams.length === 0) {
				await topStreams[0].update({
					topStreams: streamData._id
				}, { new: true });
			}

			let higherPeak = false;
			let oldPeaks = [];
			for (let i = 0; i < topStreams[0].topStreams.length; i++) {
				let dateFormat = new Date(topStreams[0].topStreams[i].started_at);
				console.log("Dateformat is")
				console.log(dateFormat)
				console.log("LastWeekIs")
				console.log(lastWeek)

				if (dateFormat > lastWeek) {
					if ((topStreams[0].topStreams[i].peak_views < streamData.peak_views &&
						topStreams[0].topStreams[i]._id !== streamData._id) ||
						(topStreams[0].topStreams[i]._id !== streamData._id &&
						topStreams[0].topStreams.length < 10)) {
						higherPeak = true;
					};
				} else {
					oldPeaks.push(topStreams[0].topStreams[i]._id);
				}
			};

			console.log("Old peaks is")
			console.log(oldPeaks)

			if (oldPeaks.length > 0) {
				console.log("OldPeaksIfStatement")
				for (let i = 0; i < oldPeaks.length; i++) {
					await topStreams[0].update({
						$pull: { topStreams: oldPeaks[i] }
					}, { new: true });
				}
			}

			if (higherPeak === true) {
				await topStreams[0].update({
					$addToSet: { topStreams: streamData._id }
				}, { new: true });
			}

            if (!stream) {
				console.log("Here1")
				const newStream = await Stream.create(streamData);
				return newStream;
			} else {
				if (streamData.viewer_count > stream.peak_views) {
					console.log("Here2")
					await stream.update({
						peak_views: streamData.viewer_count,
						viewer_count: streamData.viewer_count
					}, { new: true });
				} else {
					console.log("Here3")
					await stream.update({ viewer_count: streamData.viewer_count }, { new: true });
				};
				console.log("Here4")
				return stream;
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
		// Updates top game list
		updateTopGames: async (parent, { _id, games }) => {
			const total = await TotalData.findOne({ _id: _id })
			.populate({
				path: 'topGames',
				model: 'Game',
			})

			await total.update({
				topGames: games
			}, { new: true });

			return total;
		},
		// Updates top stream list
		updateTopStreams: async (parent, { _id }) => {
			const total = await TotalData.findOne({ _id: _id })
			.populate({
				path: 'topStreams',
				model: 'Stream',
			})

			console.log("TOP STREAM TOTAL")
			console.log(total)

			let topStreamArray = total.topStreams

			console.log("TOP STREAM ARRAY IS")
			console.log(topStreamArray)

			// Comparator function which will sort streams by peak_views highest to lowest
			function Comparator(a, b) {
				if (a.peak_views < b.peak_views) return 1;
				if (a.peak_views > b.peak_views) return -1;
				return 0;
			};

			// Sorting streams by peak_views highest to lowest, then removing anything lower than 10th place
			topStreamArray = topStreamArray.sort(Comparator).slice(0, 10);

			console.log("TOP STREAM ARRAY 2 IS")
			console.log(topStreamArray)

			await total.update({
				topStreams: topStreamArray
			}, { new: true });

			console.log("TOP STREAM TOTAL 2")
			console.log(total)

			return total;
		},

	},
};

module.exports = resolvers;
