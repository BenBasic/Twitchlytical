const { Schema, model } = require("mongoose");

const ClipsSchema = new Schema({
	_id: {
		type: String,
		required: true,
	},
	broadcaster_name: {
		type: String,
		required: true,
	},
	game_id: {
		type: String,
	},
	title: {
		type: String,
	},
	embed_url: {
		type: String,
	},
	broadcaster_name: {
		type: String,
	},
	broadcaster_id: {
		type: String,
	},
	creator_id: {
		type: String,
	},
	creator_name: {
		type: String,
	},
	url: {
		type: String,
	},
	thumbnail_url: {
		type: String,
	},
	created_at: {
		type: String,
	},
	duration: {
		type: Number,
	},
	view_count: {
		type: Number,
	},
	vod_offset: {
		type: Number,
	},
});

const Clips = model("Clips", ClipsSchema);

module.exports = Clips;
