const { Schema, model } = require("mongoose");

const totalDataSchema = new Schema({
	totalViewers: {
		type: Number,
	},
	avgTotalViewers: {
		type: Number,
	},
	totalChannels: {
		type: Number,
	},
	avgTotalChannels: {
		type: Number,
	},
	totalGames: {
		type: Number,
	},
	avgTotalGames: {
		type: Number,
	},
	archive: [
		{
			type: Schema.Types.ObjectId,
			ref: "ArchiveData",
		},
	],
	topGames: [
		{
			type: Schema.Types.String,
			ref: "Game"
		}
	],
});
const totalData = model("TotalData", totalDataSchema);

module.exports = totalData;
