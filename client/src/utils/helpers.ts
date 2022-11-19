// Importing the Stats type for use within the Comparator function
import { Stats, TopProps, TopGames, TopStreams, TopBroadcasters, } from '../components/TypesAndInterfaces';

// Comparator function which will sort cards by views highest to lowest
export function Comparator(a: Stats, b: Stats) {
    if (a.views < b.views) return 1;
    if (a.views > b.views) return -1;
    return 0;
};

// Percentage difference calculator, used for showing value differences between current and previous data
export const percentDifference = (a: number, b: number) => {
    const prevVal: number = a;
    const currentVal: number = b;
    const percent: number = (prevVal-currentVal)/prevVal*100.0;

    return percent.toFixed(2).toString().replace("-", "");
};

// This function will reference archives after a specified date and provide a rounded average value
export const createListData = (array: TopGames[]) => {

    let finalResult = [];

    // Cycles through the returned list of archive data and adds them to the total and count values
    for (let i = 0; i < array?.length; i++) {
        // Total and Count will keep track of total values and how many of them there are to divide them into an average number
        let total = 0;
        let count = 0;
        let imgUrl = "";
        let twitchGameId = array[i]?._id;
        let name = array[i]?.name
        for (let j = 0; j < array[i].archive.length; j++) {
            total = total + array[i].archive[j].view_count;

            count++
        }
        // Getting the average value by dividing total and count
        let average: any = total / count;

        // Rounding the average, without this the database tends to throw errors due to long decimal values
        let averageRounded: number = average.toFixed() * 1;

        if (name === "Just Chatting" || name === "Music" || name === "Poker" || name === "ASMR" ||
            name === "Art" || name === "Retro" || name === "Sports" || name === "Chess" ||
            name === "Pools, Hot Tubs, and Beaches" || name === "Talk Shows & Podcasts") {
            imgUrl = `https://static-cdn.jtvnw.net/ttv-boxart/${twitchGameId}-210x280.jpg`
        } else {
            imgUrl = `https://static-cdn.jtvnw.net/ttv-boxart/${twitchGameId}_IGDB-210x280.jpg`
        }

        finalResult.push({
            name: name,
            views: averageRounded,
            image: imgUrl,
        })
    };

    // Returning the rounded average result
    return finalResult;
};

export const createStreamerData = (array: TopStreams[], array2: TopBroadcasters[]) => {
    let finalResult = [];

    for (let i = 0; i < array?.length; i++) {
        for (let j = 0; j < array2?.length; j++) {
            if (array[i]?.user_id === array2[j]?.user_id) {

                finalResult.push({
                    name: array[i]?.user_name,
                    views: array[i]?.peak_views,
                    image: array2[j]?.profile_image_url
                })
            };
        };
    };
    return finalResult;
};