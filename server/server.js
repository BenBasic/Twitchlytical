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

const getData = async (reqUrl) => {
	const url = reqUrl
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

	return twitch_data;
}

// Top games
getData(process.env.GET_GAMES);

// Top streams
getData(process.env.GET_STREAMS);

// Gets videos (currently testing with videos for Overwatch 2, sorting by views)
getData(process.env.GET_VIDEOS + '?sort=views&game_id=515025')

// Collects desired properties from the GET_VIDEOS response and creates a new array of objects (testing purposes)
const getDataProperty = async (reqUrl) => {

	const resData = await getData(reqUrl);
	const resDataProp = resData?.data;
	let resArray = [];


	for (var key in resDataProp) {
		if (resDataProp.hasOwnProperty(key)) {

			const nestedResData = resDataProp[key];

			const dataObject = {
				id: nestedResData.id,
				streamid: nestedResData.stream_id,
				userid: nestedResData.user_id,
				username: nestedResData.user_name,
				title: nestedResData.title,
				views: nestedResData.view_count,
			};

			resArray.push(dataObject)
		}
	}

	console.log("RESULT ARRAY -----------")
	console.log(resArray)

};

getDataProperty(process.env.GET_VIDEOS + '?sort=views&game_id=515025');


getData(process.env.GET_STREAMS + '?game_id=515025');

// This function will gather the total viewers of a game and add them to a total sum
const countTotalViews = async (reqUrl) => {

	// Page set to 0 by default, will increment to higher values as it cycles through paginations on the api
	let page = 0;
	// stopSearch set to false by default, will set to true once viewer counts fetches are lower than specified in for loop
	let stopSearch = false;
	// Setting viewArray to an empty array, will have viewer values pushed into it when api call occurs
	let viewArray = [];
	// viewTotal set to 0 by default, will have its value changed once all viewer amounts are added up for total value
	let viewTotal = 0;
	// paginationValue set to nothing, will be assigned to pagination value when needed for further pages to cycle through from api
	let paginationValue;
	// resData set to nothing, will be assigned a fetch function based on if pagination value is required or not
	let resData;

	// While stopSearch is false, data will be gathered from api until triggered to stop
	while (stopSearch === false) {

		/* If the fetch is past the 1st page of the api call, it will fetch using a url with the
		pagination value included to continue to next page */
		if (page >= 1) {
			resData = await getData(reqUrl + '&after=' + paginationValue);
		}

		// If the fetching the 1st page of the api call, it will fetch with the base url
		if (page === 0) {
			resData = await getData(reqUrl);
		}
		
		// Assigning to the value of the data array of objects from the api call
		const resDataProp = resData?.data;
	
		// If the search hasnt been triggered to stop yet, then the viewer values will be collected and added up for total
		if (stopSearch === false) {
	
			// Cycles through all objects from the api response
			for (var key in resDataProp) {
				// Checks if the object from the response contains any properties
				if (resDataProp.hasOwnProperty(key)) {
		
					// Assigning the value of the viewers the stream currently has
					const viewCount = resDataProp[key].viewer_count;
		
					// If the viewer amount is less than or equal to specified value, stop from continuing to next page of data
					if (viewCount <= 5) {
						stopSearch = true;
					} else {
						// Add viewer amount from stream to total viewer value
						viewTotal += viewCount;
						// REMOVE LATER! Used for testing to see how many streams that have had viewer value gathered
						viewArray.push(viewCount)
					};
				};
			};
	
		} else {
			console.log ("SEARCH STOPPED");
		};

		// Incriment page value by 1
		page++;
		// Assigning new pagination value to assign new start point for data collected on next page of api response
		paginationValue = resData?.pagination.cursor;
		console.log("Pagination is")
		console.log(paginationValue)
	}

	console.log("VIEW ARRAY -----------")
	console.log(viewArray)
	console.log("VIEW TOTAL -----------")
	console.log(viewTotal)

};

// Grabbing viewer amount of all streams for Overwatch 2, 100 items at a time
countTotalViews(process.env.GET_STREAMS + '?game_id=515025&first=100')


// Twitch API code above -------------------

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
