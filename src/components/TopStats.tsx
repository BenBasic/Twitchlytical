import React, { useState } from 'react'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar';


import CardActionArea from '@mui/material/CardActionArea';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

// Importing colors from Material UI
import { amber, deepPurple, blue, green } from '@mui/material/colors';


// Defining object containing ranked property color values 
const topColors = {
    best: amber[700],
    bestDark: amber[900],
    great: deepPurple[500],
    greatDark: deepPurple[900],
    good: blue[700],
    goodDark: blue[900],
    ok: green[700],
    okDark: green[900],
};

// Setting the Game type to a set of expected properties and their expected value types
type Game = {
    name: string;
    views: number;
    trending?: boolean;
    image?: string;
};

// Setting the CardColor type to a set of expected properties and their expected value types
type CardColor = {
    primary: string;
    secondary: string;
};

const styles = {
    card: {
        borderRadius: 16,
        marginTop: '2rem',
        transition: '0.2s',
    },
    cardContent: {
        borderRadius: 16,
        color: 'black',
        //backgroundColor: 'white',
    },
    cardTitle: {
        backgroundColor: 'white',
        borderRadius: 16,
        paddingTop: '.5rem',
        paddingBottom: '.5rem',
    },
    media: {
        height: 0,
        paddingTop: '100%', // 16:9,
        marginTop: '30'
    },
    views: {
        color: 'white',
        borderRadius: 16,
        paddingTop: '.5rem',
        paddingBottom: '.5rem',
        marginTop: '1rem',
    }
};

// Assigning GameCardProps interface for passing values into CustomCard component
interface GameCardProps {
    gameInfo: Game;
    color: CardColor;
};


const CustomCard: React.FC<GameCardProps> = (props) => {
    return (
        <CardActionArea style={styles.card}
            sx={{
                '&:hover': {
                    transform: 'scale(1.1)',
                }
            }}>

            <Card style={styles.cardContent}>

                <CardMedia style={styles.media} image={props.gameInfo.image} />

                <CardContent
                    sx={{
                        backgroundColor: props.color.primary,
                        textAlign: 'center'
                    }}
                >

                    <Typography style={styles.cardTitle} variant={'h5'}>
                        {props.gameInfo.name}
                    </Typography>

                    <Container style={styles.views}
                        sx={{
                            backgroundColor: props.color.secondary,
                        }}
                    >
                        <Typography>
                            Average Weekly Views
                        </Typography>

                        <Typography variant={'h6'}>
                            {props.gameInfo.views}
                        </Typography>
                    </Container>


                </CardContent>
            </Card>
        </CardActionArea>
    );
};


const TopStats: React.FC = () => {

    // Let of test data using an array of the Game type, this is only used for display testing purposes for now
    let testData: Game[] = [
        {
            name: "Overwatch",
            views: 103040,
            image: "https://www.mobygames.com/images/covers/l/840891-overwatch-2-nintendo-switch-front-cover.jpg",
        },
        {
            name: "Stardew Valley",
            views: 24500,
            image: "https://image.api.playstation.com/cdn/UP2456/CUSA06840_00/0WuZecPtRr7aEsQPv2nJqiPa2ZvDOpYm.png",
        },
        {
            name: "Fallout New Vegas",
            views: 3100,
            image: "https://howlongtobeat.com/games/Fallout_New_Vegas.jpg",
        },
        {
            name: "Minecraft",
            views: 4680,
            image: "https://www.mobygames.com/images/covers/l/672322-minecraft-playstation-4-front-cover.jpg",
        },
        {
            name: "Xcom 2",
            views: 20003,
            image: "https://www.mobygames.com/images/covers/l/425882-xcom-2-war-of-the-chosen-playstation-4-front-cover.jpg",
        },
        {
            name: "Portal 2",
            views: 302,
            image: "http://s01.riotpixels.net/data/b5/cf/b5cfe10d-7290-4bcb-a89d-e5d0e07b89f4.jpg/cover.portal-2.1024x1024.2014-04-24.1116.jpg",
        },
        {
            name: "Sid Meier's Civilization VI",
            views: 72301,
            image: "https://steamuserimages-a.akamaihd.net/ugc/1802025626651923540/962EB4599F3C3E318491A62AEB3604876AFBE87D/",
        },
        {
            name: "Pavlov VR",
            views: 135,
            image: "https://cdna.artstation.com/p/assets/images/images/022/303/284/large/david-sheep-pavlov-01.jpg?1574894810",
        },
        {
            name: "Fall Guys",
            views: 6300,
            image: "https://www.mobygames.com/images/covers/l/676144-fall-guys-ultimate-knockout-playstation-4-front-cover.png",
        },
        {
            name: "Compound",
            views: 30005,
            image: "https://thumbnails.pcgamingwiki.com/5/55/New_cover.png/300px-New_cover.png",
        },
    ];

    // Comparator function which will sort reviews by date
    function Comparator(a:Game, b:Game) {
        if (a.views < b.views) return 1;
        if (a.views > b.views) return -1;
        return 0;
    };
    
    // Assigning the array of data to sort by value of views from highest to lowest
    testData = testData.sort(Comparator);

    // Assigning the topGames state, currently uses the Game type and sets initial state to the values in testData
    const [topGames, setTopGames] = useState<Game[]>(testData);



    return (

        <Container maxWidth="sm" className='topGamesContainer'>

            <Typography variant={'h4'} textAlign='center'>
                Most Popular Games
            </Typography>

            {topGames.map((game, index) => (
                <CustomCard gameInfo={game} key={index}
                color={ index === 0 ?
                    {primary: topColors.best, secondary: topColors.bestDark} :
                    index > 0 && index < 3 ?
                    {primary: topColors.great, secondary: topColors.greatDark} :
                    index > 2 && index < 7 ?
                    {primary: topColors.good, secondary: topColors.goodDark} :
                    {primary: topColors.ok, secondary: topColors.okDark}
                }
                ></CustomCard>
            ))}

        </Container>

    )
}

export default TopStats