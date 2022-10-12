const { Schema, model } = require("mongoose");

const GameSchema = new Schema({
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
	// dateData: [
	// 	{
	// 		type: Schema.Types.ObjectId,
	// 		ref: "DateData",
	// 	},
	// ],
});

const Game = model("Game", GameSchema);

module.exports = Game;
