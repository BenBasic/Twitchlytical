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

/* Function gathers the requested date value which can be used for date related requests for api calls
For example, if week is specified, it will get last weeks date, which can then be used to
pass in that date value to get the top clips from last week in an api call
*/
function calculateDate(time) {
	const now = new Date();
	let value;
	
	switch(time) {
		case 'day':
			value = 1;
			break;
		case 'week':
		  	value = 7;
		  	break;
		case 'month':
		  	value = 30;
		  	break;
		case 'year':
			value = 365;
			break;
		default:
		  	value = 0;
			break;
	}
	
	const newDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - value).toISOString();
	return newDate;
}

// // Top games
// getData(process.env.GET_GAMES);

// // Top streams
// getData(process.env.GET_STREAMS);

// // Gets videos (currently testing with videos for Overwatch 2, sorting by views)
// getData(process.env.GET_VIDEOS + '?sort=views&game_id=515025')

// // Collects desired properties from the GET_VIDEOS response and creates a new array of objects (testing purposes)
// const getDataProperty = async (reqUrl) => {

// 	const resData = await getData(reqUrl);
// 	const resDataProp = resData?.data;
// 	let resArray = [];


// 	for (var key in resDataProp) {
// 		if (resDataProp.hasOwnProperty(key)) {

// 			const nestedResData = resDataProp[key];

// 			const dataObject = {
// 				id: nestedResData.id,
// 				streamid: nestedResData.stream_id,
// 				userid: nestedResData.user_id,
// 				username: nestedResData.user_name,
// 				title: nestedResData.title,
// 				views: nestedResData.view_count,
// 			};

// 			resArray.push(dataObject)
// 		}
// 	}

// 	console.log("RESULT ARRAY -----------")
// 	console.log(resArray)

// };

// getDataProperty(process.env.GET_VIDEOS + '?sort=views&game_id=515025');


// getData(process.env.GET_STREAMS + '?game_id=515025');

/* This function will gather the total viewers of a game and add them to a total sum
Can pass GET_STREAMS into reqUrl + game_id for specific game, if no game_id is provided then 
this function will look through ALL STREAMS ON TWITCH
!!! BE CAREFUL WHEN USING THIS FUNCTION TO AVOID UNINTENDED LARGE STREAM COLLECTION !!!
*/
const countTotalViews = async (reqUrl) => {

	// Page set to 0 by default, will increment to higher values as it cycles through paginations on the api
	let page = 0;
	// stopSearch set to false by default, will set to true once viewer counts fetches are lower than specified in for loop
	let stopSearch = false;
	// Setting viewArray to an empty array, will have viewer values pushed into it when api call occurs
	let viewArray = [];
	// Setting userIdArray to an empty array, will have user_id values pushed into it when api call occurs
	let userIdArray = [];
	// Setting duplicateArray to an empty array, will have detected duplicate user_id values pushed into it when api call occurs
	let duplicateArray = [];
	// viewTotal set to 0 by default, will have its value changed once all viewer amounts are added up for total value
	let viewTotal = 0;
	// paginationValue set to nothing, will be assigned to pagination value when needed for further pages to cycle through from api
	let paginationValue;
	// resData set to nothing, will be assigned a fetch function based on if pagination value is required or not
	let resData;
	// Assigning viewLimit to the value desired for the api to stop checking for streams (ex: stop checking when streams with 5 viewers are detected)
	let viewLimit = 0;
	// Assigning allGames to an empty object, will become populated with game_id keys with viewer values when api call occurs
	let allGames = {};
	// Assigning allUserInfo to an empty object, will become populated with user related key and value pairs when api call occurs
	let allUserInfo = [];

	// While stopSearch is false, data will be gathered from api until triggered to stop
	while (stopSearch === false) {

		/* If the fetch is past the 1st page of the api call, it will fetch using a url with the
		pagination value included to continue to next page */
		if (page >= 1) {
			resData = await getData(reqUrl + '&after=' + paginationValue + '&first=100');
		}

		// If the fetching the 1st page of the api call, it will fetch with the base url
		if (page === 0) {
			resData = await getData(reqUrl + '&first=100');
		}
		
		// Assigning to the value of the data array of objects from the api call
		const resDataProp = resData?.data;
	
		// If the search hasnt been triggered to stop yet, then the viewer values will be collected and added up for total
		if (stopSearch === false) {

			/* Checks if response is less than 100 items and if viewArray is less than 100 items,
			if only using a length check for resDataProp then stop will falsely trigger when api has
			inconsistent behaviour showing paginations with less than 100 items despite having more results.
			Also checks for value of last item in viewArray to make sure it doesnt trigger on the first page
			if the pagination is less than 100 and the viewer amount is higher than a set value because if
			the last stream collected has a higher view than the value its checking then its incredibly unlikely
			that there arent more streams to show
			*/
			if (resDataProp.length < 100 && viewArray?.length <= 100 && viewArray[viewArray.length - 1] < 100) {
				// Tells the function to stop searching for additional paginations in api call
				stopSearch = true;
			}
	
			// Cycles through all objects from the api response
			for (var key in resDataProp) {
				// Checks if the object from the response contains any properties
				if (resDataProp.hasOwnProperty(key)) {
		
					// Assigning the value of the viewers the stream currently has
					const viewCount = resDataProp[key].viewer_count;

					// Assigning the value of the streamers user_id (will be used for matching id checks to prevent duplicate results)
					const userId = resDataProp[key].user_id;
					// Assigning the value of the games game_id (will be used to create and update keys in the allGames object)
					const gameId = resDataProp[key].game_id;
			

					// Checks if user_id already has been fetched from api call, prevents same streamer from having duplicates
					if(!userIdArray.includes(userId)) {
						// Pushes the user_id into the userIdArray, allowing it to be referenced in case there are duplicate results
						userIdArray.push(userId);

						// Assigning values from api call to add to the userInfo object
						const userLanguage = resDataProp[key].language;
						const streamId = resDataProp[key].id;
						const streamThumbnail = resDataProp[key].thumbnail_url;

						// Object containing desired user information
						const userInfo = {
							id: userId,
							game_id: gameId,
							stream_id: streamId,
							views: viewCount,
							language: userLanguage,
							thumbnail: streamThumbnail,

						};

						// Pushing the userInfo object into the allUserInfo array
						allUserInfo.push(userInfo);

						/* Checks if the game_id exists in the allGames object, if it does then it will add the views to its current total,
						if it doesnt exist then it will create a key with the game_id and assign its value to the views of the
						first detected stream that is streaming the game
						*/
						if (allGames.hasOwnProperty(`${gameId}`)) {
							allGames[`${gameId}`] = allGames[`${gameId}`] + viewCount
						} else {
							const gameKeyValue = {[`${gameId}`]: viewCount}
							allGames = {...allGames, ...gameKeyValue};
						}

						// If the viewer amount is less than or equal to specified value, stop from continuing to next page of data
						if (viewCount <= viewLimit) {
							// Assigning consts to check if there are at least 2 values in the viewArray, used for preventing false stopSearch due to api sorting errors
							const firstIndex = viewArray?.[0];
							const secondIndex = viewArray?.[1];
							console.log("TRIGGER1")

							if (firstIndex !== undefined && secondIndex !== undefined) {
								// Assigning consts to the last and second last values in the viewArray (2 most recent)
								const last = viewArray[viewArray.length - 1];
								const secondLast = viewArray[viewArray.length - 2];
								console.log("TRIGGER3")

								// If the last 2 viewer_count values were less or equal to the specified viewLimit, then stop the search
								if (last <= viewLimit && secondLast <= viewLimit) {
									// Tells the function to stop searching for additional paginations in api call
									stopSearch = true;
									console.log("TRIGGER4")
								};
							};

							// Add viewer amount from stream to total viewer value
							viewTotal += viewCount;
							// Used for testing to see how many streams that have had viewer value gathered
							viewArray.push(viewCount)

						} else {
							// Add viewer amount from stream to total viewer value
							viewTotal += viewCount;
							// Used for testing to see how many streams that have had viewer value gathered
							viewArray.push(viewCount)
						};
					} else {
						duplicateArray.push(userId);
					};
				};
			};
	
		} else {
			console.log ("SEARCH STOPPED");
		};

		console.log("RESPROP LENGTH IS !!!!!")
		console.log(resDataProp.length)


		// Incriment page value by 1
		page++;


		// Assigning new pagination value to assign new start point for data collected on next page of api response
		paginationValue = resData?.pagination?.cursor;
		console.log("Pagination is")
		console.log(paginationValue)
	};

	let results = [];

	results.push(viewTotal, allGames, allUserInfo);

	// console.log("VIEW ARRAY -----------")
	// console.log(viewArray)
	// console.log("VIEW TOTAL -----------")
	// console.log(viewTotal)
	// console.log("REGULAR IDS DETECTED -----------")
	// console.log(userIdArray)
	// console.log("DUPLICATE IDS DETECTED -----------")
	// console.log(duplicateArray)
	// console.log("ALL GAMES IS -----------")
	// console.log(allGames)
	// console.log("ALL USER INFO IS -----------")
	// console.log(allUserInfo)

	// console.log(results);

	return results;

};


/* This function with gather all users from the countTotalViews function and then make
an additional api call for 100 viewers at a time to gather additional user info,
they are then assigned additional key value pairs with this new data to have intended user data
*/
const getUserInfo = async (reqStreamUrl, reqUserUrl) => {

	/*
	Index 0: total views
	Index 1: Object containing game_id with total view value
	Index 2: User info array of objects
	*/
	// Using single game id for testing purposes (Modern Warfare 2)
	const usableData = await countTotalViews(reqStreamUrl + '?game_id=1678052513');

	// Assigning users to the array of userInfo objects
	const users = usableData?.[2]

	/* Assigning userList to '?' as the start of an api call needs to start with ?
	additional user_ids will be added to this string until 100 user_ids are inside of
	the string (max 100 user_ids for api call allowed)
	*/
	let userList = '?';

	// Assigning userListArray to an empty array, will have userList strings pushed into it for api calls
	let userListArray = [];

	// Assigning count to 0, used to keep track of how many user_ids have been added to userList string value
	count = 0;

	// Cycles through all objects from the api response
	for (var key in users) {
		// Checks if the object from the response contains any properties
		if (users.hasOwnProperty(key)) {

			// Assigning userId to the id key in the object
			const userId = users[key].id;

			// Checks if user_ids are in the userList, will change string added based on that for correct api call
			if (userList === '?') {
				userList = userList + 'id=' + userId
			} else {
				userList = userList + '&id=' + userId
			}

			// Increases count by 1
			count ++

			/* If 100 user_ids are added to the userList then push it into the userListArray,
			then reset counter and userList to default values. This is done so only 100 user_ids are
			used in one api call because that is the maximum allowed
			*/
			if (count === 100) {
				userListArray.push(userList);
				userList = '?';
				count = 0;
			}
		};
	};

	/* If finished cycling through user_ids but there arent a full amount of 100 to use,
	then push the remaining user_ids into the userListArray and set userList and count values to default
	*/
	if (count !== 0 && count < 100) {
		userListArray.push(userList);
		userList = '?';
		count = 0;
	};

	console.log(userList);
	console.log(userListArray);

	// Calling api to get user data from the userListArray
	const getMoreUserData = await getData(reqUserUrl + userListArray[0]);

	// Assigning resUserData to the data object from the api response
	const resUserData = getMoreUserData?.data;

	console.log("resUserData IS !!!!!!!!!!!")
	console.log(resUserData);

	// Cycling through each object in the api response and adding new key value pairs to users array of objects
	for (var key in resUserData) {
		// Checks if the object from the response contains any properties
		if (resUserData.hasOwnProperty(key)) {

			// Finding the matching id values between the user array and the api response
			let findMatchingId = users.find(obj => obj.id === resUserData[key].id);

			// Assigning new key value pairs to the matching user object
			findMatchingId.displayName = resUserData[key].display_name;
			findMatchingId.broadcasterType = resUserData[key].broadcaster_type;
			findMatchingId.userDescription = resUserData[key].description;
			findMatchingId.profileImage = resUserData[key].profile_image_url;
			findMatchingId.totalViews = resUserData[key].view_count;
			findMatchingId.creationDate = resUserData[key].created_at;

		};
	};

	console.log("NEW USER INFO CHECK ????????????")
	console.log(users);


};

getUserInfo(process.env.GET_STREAMS, process.env.GET_USERS);

//getData(process.env.GET_GAMES_ALL + '?id=515025&id=1678052513')



//getData(process.env.GET_GAMES)

//getData(process.env.GET_STREAMS + '?game_id=515025&first=5')

// // Grabbing viewer amount of all streams for Overwatch 2, 100 items at a time (FIRST 100 NOW IN FUNCTION)
//countTotalViews(process.env.GET_STREAMS + '?game_id=515025')

//getData('https://api.twitch.tv/helix/games?name=Call of Duty: Modern Warfare II')
//countTotalViews(process.env.GET_STREAMS + '?game_id=1678052513')

// // Gathing a user by login name (aka their username)
//getData(process.env.GET_USERS + '?login=xqc');

// // Gathering the clips from a user (need to use id as broadcaster_id, cant use username)
// // Seems to get top clips of all time by default
// // Can use started_at and ended_at for date ranges of clips, will sort by views
// // started_at will get clips from 1 week AFTER by default, ex: Oct 1 will gather Oct 1-7
// // started_at/ended_at MUST USE RFC 3339 format for dates to work
// getData(process.env.GET_CLIPS + '?broadcaster_id=44445592' + '&started_at=2022-10-02T15:00:00Z');



// This function will gather Top Clips from top games based on specified last day, week, month, year, or all time
const getTopClipsAll = async (gameUrl, clipUrl, date) => {

	// Assigning value passed into date, options can be: all, day, week, month, or year
	let useDate = date;

	if (useDate === "day" || useDate === "week" || useDate === "month" || useDate === "year") {
		useDate = '&started_at=' + calculateDate(useDate);
	} else {
		useDate = '';
	}
	console.log("USE DATE IS -----------------------------")
	console.log(useDate)

	// Assigning clipsArray to an empty array, will become populated with clips data after Clips api call
	let clipsArray = [];

	// Making api call to find the top games on Twitch
	const resData = await getData(gameUrl);

	// Assigning to the value of the data array of objects from the api call
	const resDataProp = resData?.data;

	// Cycles through all games from the api response
	for (var key in resDataProp) {
		// Checks if the object from the response contains any properties
		if (resDataProp.hasOwnProperty(key)) {

			// Assigning the value of the id for the game
			const gameId = resDataProp[key].id;

			// Making api call to find top clips for each game
			const resTopClips = await getData(clipUrl + '?game_id=' + gameId + useDate);

			// Assigning to the data array of objects from the api repsonse (contains clips)
			const resTopClipsData = resTopClips?.data;

			/* Cycles through the clips from the response to push each object into the clipsArray
			This will prevent the array from being an array of arrays containing objects, which is not needed
			as only the objects are desired, no need to have different arrays
			*/
			for (let i = 0; i < resTopClipsData.length; i++) {
				clipsArray.push(resTopClipsData[i]);
			}

		};
	};

	// Comparator function which will sort clips by view_count highest to lowest
	function Comparator(a, b) {
		if (a.view_count < b.view_count) return 1;
		if (a.view_count > b.view_count) return -1;
		return 0;
	};

	// Sorting clips by view_count highest to lowest
	clipsArray = clipsArray.sort(Comparator);
	
	console.log(clipsArray);

};

//getTopClipsAll(process.env.GET_GAMES, process.env.GET_CLIPS, 'week')

//getData(process.env.GET_GAMES + '?first=100');

// Getting follow count from streamer, first is set to 1 because we dont need info from users following, just total
//getData(process.env.GET_FOLLOWS + '?to_id=44445592&first=1')

// Can get top streams currently live by doing get streams but without specifying a game id
//getData(process.env.GET_STREAMS)









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
