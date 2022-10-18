const { Schema, model } = require("mongoose");

const BroadcasterSchema = new Schema({
	user_id: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	language: {
		type: String,
	},
	profile_image_url: {
		type: String,
	},
	view_count: {
		type: Number,
	},
	total_views: {
		type: Number,
	},
	broadcaster_type: {
		type: String,
	},
	createdAt: {
		type: Date,
	},
	archive: [
		{
			type: Schema.Types.ObjectId,
			ref: "ArchiveData",
		},
	],
});

const Broadcaster = model("Broadcaster", BroadcasterSchema);

module.exports = Broadcaster;
