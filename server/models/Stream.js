const { Schema, model } = require("mongoose");

const StreamSchema = new Schema({
	_id: {
		type: String,
		required: true,
	},
	user_id: {
		type: String,
		required: true,
	},
	user_name: {
		type: String,
		required: true,
	},
	game_name: {
		type: String,
		required: true,
	},
	user_name: {
		type: String,
		required: true,
	},
	title: {
		type: String,
	},
	tags_ids: {
		type: [String],
	},
	viewer_count: {
		type: Number,
	},
	peak_views: {
		type: Number,
	},
	thumbnail_url: {
		type: String,
	},
	started_at: {
		type: String,
	},
	language: {
		type: String,
	},
});

const Stream = model("Stream", StreamSchema);

module.exports = Stream;
