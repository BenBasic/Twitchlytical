const { Schema, model } = require("mongoose");

const BroadcasterSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
});

const Post = model("Broadcaster", broadcasterSchema);

module.exports = Broadcaster;
