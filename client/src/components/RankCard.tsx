import React from 'react'

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography'


import CardActionArea from '@mui/material/CardActionArea';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import { StatCardProps } from './TypesAndInterfaces';
import { Box } from '@mui/material';



// Object containing style properties used for the MUI implementation throughout this file
const styles = {
    card: {
        borderRadius: 16,
        marginTop: '2rem',
        transition: '0.1s',
    },
    cardContent: {
        borderRadius: 16,
        color: 'black',
        height: '8rem',
        //backgroundColor: 'white',
    },
    cardTitle: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
        fontSize: '1rem',
        backgroundColor: 'white',
        borderRadius: 16,
        paddingTop: '.5rem',
        paddingBottom: '.5rem',
    },
    media: {
        width: '8.8rem',
        paddingTop: '0%', // Aspect ratio, 100% means 1:1, 50% means 2:1, etc
        marginTop: '30'
    },
    viewTitle: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 400,
        fontSize: '.8rem',
    },
    views: {
        color: 'white',
        borderRadius: '1rem 1rem 1rem 0rem',
        paddingTop: '.4rem',
        paddingBottom: '.3rem',
        marginTop: '1rem',
    },
    viewNum: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 400,
    }
};


const RankCard: React.FC<StatCardProps> = (props) => {
    return (
        <CardActionArea style={styles.card}
            href={`${ props.viewType === 'peak' ? '/profile/' : '/game/'}${props.statInfo.name}`}
            sx={{
                '&:hover': {
                    transform: 'scale(1.08)',
                }
            }}>

            <div className='rankCircle' style={{ backgroundColor: props.rankColor.secondary, borderColor: props.rankColor.primary }}>
                <span>{props.rankIndex + 1}</span>
            </div>

            <Card style={styles.cardContent} sx={{ display: 'flex' }}>
                <CardMedia sx={{display: { xs: 'none', sm: 'block' }}} style={styles.media} image={props.statInfo.image} />
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <CardContent
                        sx={{
                            backgroundColor: props.color.primary,
                            textAlign: 'center',
                            flex: '1 0 auto',
                            width: '100%',
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
                            <Typography style={styles.viewTitle}>
                                { props.viewType === "avg" ? "7 Day View Average" :
                                "7 Day View Peak"}
                            </Typography>

                            <Typography variant={'h6'} style={styles.viewNum}>
                                {props.statInfo.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </Typography>
                        </Container>
                    </CardContent>
                </Box>
            </Card>
        </CardActionArea>
    );
};

export default RankCard;