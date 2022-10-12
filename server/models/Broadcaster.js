const { Schema, model } = require("mongoose");

const BroadcasterSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	profile_image_url: {
		type: String,
	},
	view_count: {
		type: Number,
	},
});

const Broadcaster = model("Broadcaster", BroadcasterSchema);

module.exports = Broadcaster;
