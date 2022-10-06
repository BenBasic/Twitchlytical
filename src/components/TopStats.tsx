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



// Setting the Game type to a set of expected properties and their expected value types
type Game = {
    name: string;
    views: number;
    trending?: boolean;
    image?: string;
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
        backgroundColor: 'white',
    },
    media: {
        height: 0,
        paddingTop: '100%', // 16:9,
        marginTop: '30'
    },
    views: {
        marginTop: '2rem',
    }
};


const CustomCard = (gameInfo: Game) => {
    return (
        <CardActionArea style={styles.card}
            sx={{
                '&:hover': {
                    transform: 'scale(1.1)',
                }
            }}>

            <Card style={styles.cardContent}>

                <CardMedia style={styles.media} image={gameInfo.image} />

                <CardContent>

                    <Typography variant={'h5'}>
                        {gameInfo.name}
                    </Typography>

                    <Typography style={styles.views}>
                        Average Weekly Views
                    </Typography>

                    <Typography>
                        {gameInfo.views}
                    </Typography>

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
    ]

    // Assigning the topGames state, currently uses the Game type and sets initial state to the values in testData
    const [topGames, setTopGames] = useState<Game[]>(testData);


    return (

        <Container maxWidth="sm" className='topGamesContainer'>

            {topGames.map((game, index) => (
                <CustomCard {...game} key={index}></CustomCard>
            ))}

        </Container>

    )
}

export default TopStats