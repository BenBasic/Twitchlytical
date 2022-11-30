// Importing the Stats type for use within the Comparator function
import { Stats, TopGames, TopStreams, TopBroadcasters, BroadcasterArchive, } from '../components/TypesAndInterfaces';

const now = new Date();

// Comparator function which will sort cards by views highest to lowest
export function Comparator(a: Stats, b: Stats) {
    if (a.views < b.views) return 1;
    if (a.views > b.views) return -1;
    return 0;
};

export function miniComparator(a: number, b: number) {
    if (a < b) return 1;
    if (a > b) return -1;
    return 0;
};

// Percentage difference calculator, used for showing value differences between current and previous data
export const percentDifference = (a: number, b: number) => {
    const prevVal: number = a;
    const currentVal: number = b;
    const percent: number = (prevVal - currentVal) / prevVal * 100.0;

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
            name === "Pools, Hot Tubs, and Beaches" || name === "Talk Shows & Podcasts" ||
            name === "Special Events") {
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

export const createShortStreamerList = (array: TopStreams[]) => {
    let finalResult = [];

    for (let i = 0; i < array?.length; i++) {
        finalResult.push({
            name: array[i]?.user_name,
            views: array[i]?.peak_views,
        })
    };
    return finalResult;
};

export function miniGetAverage(refArray: number[]) {
    let total = 0;
    let count = 0;
    for (let j = 0; j < refArray.length; j++) {
        total = total + refArray[j];
        count++;
    };
    // Getting the average value by dividing total and count
    let average = total / count;
    // Rounding the average, without this the database tends to throw errors due to long decimal values
    let averageRounded = parseFloat(average.toFixed());

    return averageRounded;
};


export const createBroadcasterPerformanceList = (array: BroadcasterArchive[]) => {
    let finalResult = [];
    let peakNum: number = 0;
    let refArray: number[] = [];


    for (let i = 0; i < array?.length; i++) {
        if (i > 0) {
            if (array[i].stream_id === array[i - 1].stream_id &&
                array[i].view_count > array[i - 1].view_count &&
                array[i].view_count > peakNum) {
                peakNum = array[i].view_count
                refArray.push(array[i].view_count)
                if (i === (array.length - 1)) {
                    finalResult.push({
                        stream_id: array[i].stream_id,
                        peak: peakNum,
                        avg: miniGetAverage(refArray),
                        date: array[i].createdAt
                    })
                }
            } else if (array[i].stream_id !== array[i - 1].stream_id) {
                if (refArray.length === 1) {
                    finalResult.push({
                        stream_id: array[i - 1]?.stream_id,
                        peak: refArray[0],
                        avg: refArray[0],
                        date: array[i - 1]?.createdAt
                    });
                    if (i === (array.length - 1)) {
                        finalResult.push({
                            stream_id: array[i].stream_id,
                            peak: array[i].view_count,
                            avg: array[i].view_count,
                            date: array[i].createdAt
                        });
                    }
                    peakNum = array[i].view_count
                    refArray = [array[i].view_count]
                } else {

                    finalResult.push({
                        stream_id: array[i - 1]?.stream_id,
                        peak: peakNum,
                        avg: miniGetAverage(refArray),
                        date: array[i - 1]?.createdAt
                    })

                    peakNum = array[i].view_count
                    refArray = [array[i].view_count]
                };

            } else if (array[i].stream_id === array[i - 1].stream_id &&
                array[i].view_count < array[i - 1].view_count) {
                refArray.push(array[i].view_count)
                if (i === (array.length - 1)) {
                    finalResult.push({
                        stream_id: array[i].stream_id,
                        peak: peakNum,
                        avg: miniGetAverage(refArray),
                        date: array[i].createdAt
                    })
                }
            };
        } else if (i === 0) {
            refArray.push(array[i].view_count)
            peakNum = array[i].view_count
            if (i === (array.length - 1)) {
                finalResult.push({
                    stream_id: array[i].stream_id,
                    peak: array[i].view_count,
                    avg: array[i].view_count,
                    date: array[i].createdAt
                })
            };

        };
    };
    return finalResult;
};


// Updates an array by placing an item from one index to a new index placement.
// ****** Example ******
// input: [1,2,3,4], 0, 3
// result: [2,3,4,1]
export const moveArrIndex = (array: any[], refIndex: number, finalIndex:number) => {

    if (refIndex === finalIndex) {
        return array;
    };
    const refItem = array[refIndex];
    const increment = finalIndex < refIndex ? -1 : 1;

    for (let i = refIndex; i !== finalIndex; i += increment) {
        array[i] = array[i + increment];
    };

    array[finalIndex] = refItem;
    return array;
};

// Checks if elements in an array are not numbers, if they are then
// the array will be reformatted in reverse order (first is now last) and
// the remaining array items will be re-assigned the desired replacement value
// ****** Example ******
// input: [1,2,NaN,NaN], 0
// result: [0,0,2,1]
export const checkArrIsNum = (array: any[], replaceVal: number) => {

    console.log("/////// array is ///////")
    console.log(array)
    const length = array.length;
    let isNumStatus: boolean = true;
    let isNumIndex: number = 0;

    for (let i = length - 1; i > -1; i--) {

        if (isNaN(array[i]) && (!array[i-1] || !isNaN(array[i-1]))) {
            console.log("TRIGGERED NAN CHECK")
            console.log(i)
            isNumStatus = false;
            isNumIndex = i;
            for (let j = i; j < length; j++) {
                array[j] = replaceVal;
            };
        };

        if (isNumStatus === false) {
            for (let h = i; h > isNumIndex - 1; h--) {
                console.log("****** for loop ******")
                console.log([array, i, h - i])
                moveArrIndex(array, i, h - i)
            };
        };
    };
    return array;
}


// export const checkArrIsNum = (array: any[], replaceVal: number) => {

//     console.log("/////// array is ///////")
//     console.log(array)
//     const length = array.length;
//     let isNumStatus: boolean = true;

//     for (let i = length - 1; i > -1; i--) {

//         if (isNaN(array[i])) {
//             console.log("TRIGGERED NAN CHECK")
//             console.log(i)
//             array[i] = replaceVal;
//         };

//         if (!array[i]) {
//             isNumStatus = false;
//             console.log("**** triggered if 1 ****")
//         }
//     };
//     console.log("ARR RETURN")
//     console.log(array)
//     return array;
// }