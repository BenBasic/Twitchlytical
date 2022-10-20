const { Schema, model } = require("mongoose");

const GameSchema = new Schema({
	_id: {
		type: String,
	},
	name: {
		type: String,
		required: true,
	},
	box_art_url: {
		type: String,
	},
	view_count: {
		type: Number,
	},
	archive: [
		{
			type: Schema.Types.ObjectId,
			ref: "ArchiveData",
		},
	],
});

const Game = model("Game", GameSchema);

module.exports = Game;
