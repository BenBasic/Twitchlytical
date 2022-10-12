const { Schema, model } = require("mongoose");

const DateDataSchema = new Schema({
	date: {
		type: Date,
	},
});

const DateData = model("DateData", DateDataSchema);
module.exports = DateData;
