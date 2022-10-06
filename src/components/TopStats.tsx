import React, { useState } from 'react'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';



// Setting the Game type to a set of expected properties and their expected value types
type Game = {
    name: string;
    views: number;
    trending?: boolean;
};

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


const TopStats: React.FC = () => {

    // Let of test data using an array of the Game type, this is only used for display testing purposes for now
    let testData:Game[] = [
        {
            name: "Test1",
            views: 100,
        },
        {
            name: "Test2",
            views: 200,
        },
        {
            name: "Test3",
            views: 300,
        },
    ]

    // Assigning the topGames state, currently uses the Game type and sets initial state to the values in testData
    const [topGames, setTopGames] = useState<Game[]>(testData);


    return (

        <Container maxWidth="sm" className='topGamesContainer'>
        
            <Grid container spacing={2}>

                <Grid item xs={8}>
                    <h2>Most Popular Games</h2>
                </Grid>

                <Grid item xs={4}>
                    <h2>Views</h2>
                </Grid>

                {topGames.map((game, index) => (
                    <>
                    
                    <Grid item xs={8}
                    className="topGameName"
                    key={game.name + index}
                    >
                        <Item>{game.name}</Item>
                    </Grid>

                    <Grid item xs={4}
                    className="topGameViews"
                    key={game.name + index}
                    >
                        <Item>{game.views}</Item>
                    </Grid>

                    </>
                    )
                )}
              
            </Grid>

        </Container>

    )
}

export default TopStats