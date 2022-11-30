// Generates token to be used for fetching data from the twitch api
export const getToken = async () => {
    const tokenResponse = await fetch(
        `https://id.twitch.tv/oauth2/token?client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}&grant_type=client_credentials`,
        {
            method: "POST",
        }
    );

    // Grabbing the access_token from the returned json
    const tokenJson = await tokenResponse.json();
    const token = tokenJson.access_token;

    // Returning the token to be referenced in api calls
    return token;
};

export const getData = async (reqUrl: string) => {
    const url = reqUrl
    const token = await getToken();

    console.log(`client token is ${token}`)

    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('client-id', `${process.env.REACT_APP_CLIENT_ID}`);
    requestHeaders.set('Authorization', `Bearer ${token}`);
    requestHeaders.set('Accept', `application/json`);
    requestHeaders.set('Content-Type', 'application/json');

    console.log("Made it here 1")
    const res = await fetch(url, {
        method: "GET",
        headers: requestHeaders
    })
    console.log("Made it here 2")
    let twitch_data = await res.json();

    // Use this to keep track of all data being fetched during calls, if its annoying then just comment it out
    console.log("Twitch Data is -------")
    console.log(twitch_data);

    return twitch_data;
};