// Twitch API code below -------------------

require('dotenv').config();

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));


const getToken = async () => {
	const tokenResponse = await fetch(
		`https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=client_credentials`,
		{
			method: "POST",
		}
	);

	const tokenJson = await tokenResponse.json();
	const token = tokenJson.access_token;

	return token;
};

const getData = async () => {
	const url = process.env.GET_GAMES
	const token = await getToken();

	console.log(`token is ${token}`)


	const res = await fetch(url, {
		method: "GET",
		headers: {
			"client-id": process.env.CLIENT_ID,
			"Authorization": `Bearer ${token}`,
		}
	})
	let twitch_data = await res.json();
	
	console.log(twitch_data);
}

getData();

const express = require("express");
const path = require("path");
const { ApolloServer } = require("apollo-server-express");

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
const app = express();

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../client/build")));
}

const startApolloServer = async (typeDefs, resolvers) => {
	await server.start();

	server.applyMiddleware({ app });

	db.once("open", () => {
		app.listen(PORT, () => {
			console.log(`API server running on port ${PORT}!`);
			console.log(
				`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
			);
		});
	});
};

startApolloServer(typeDefs, resolvers);
