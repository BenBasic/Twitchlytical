const { Schema, model } = require("mongoose");

const totalDataSchema = new Schema({
	totalViewers: {
		type: Number,
	},
	totalChannels: {
		type: Number,
	},
	totalStreams: {
		type: Number,
	},
	concurrentStreams: {
		type: Number,
	},
	concurrentViewers: {
		type: Number,
	},
});
const totalData = model("totalData", totalDataSchema);

module.exports = totalData;
