import React from 'react'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography'


import CardActionArea from '@mui/material/CardActionArea';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import { StatCardProps  } from './TypesAndInterfaces';



// Object containing style properties used for the MUI implementation throughout this file
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


const RankCard: React.FC<StatCardProps> = (props) => {
    return (
        <CardActionArea style={styles.card}
            sx={{
                '&:hover': {
                    transform: 'scale(1.1)',
                }
            }}>

            <Card style={styles.cardContent}>

                <CardMedia style={styles.media} image={props.statInfo.image} />

                <CardContent
                    sx={{
                        backgroundColor: props.color.primary,
                        textAlign: 'center'
                    }}
                >

                    <Typography style={styles.cardTitle} variant={'h5'}>
                        {props.statInfo.name}
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
                            {props.statInfo.views}
                        </Typography>
                    </Container>


                </CardContent>
            </Card>
        </CardActionArea>
    );
};

export default RankCard;