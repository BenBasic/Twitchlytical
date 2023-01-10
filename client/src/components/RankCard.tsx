import React from 'react'

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography'


import CardActionArea from '@mui/material/CardActionArea';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import { StatCardProps } from './TypesAndInterfaces';
import Box from '@mui/material/Box';

import { ThemeProvider } from '@mui/material/styles';
import { rankCard } from '../utils/themes';

import useResize from '../utils/resizeHook';

import MediaQuery from 'react-responsive';

// Object containing style properties used for the MUI implementation throughout this file
const styles = {
    card: {
        borderRadius: 16,
        marginTop: '2rem',
        transition: '0.1s',
        maxWidth: '26.1rem',
    },
    cardContent: {
        borderRadius: 16,
        color: 'black',
        // height: '8rem',
        maxWidth: '26.1rem',
        //backgroundColor: 'white',
    },
    cardTitle: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
        // fontSize: '1rem',
        backgroundColor: 'white',
        borderRadius: '16px 0px 0px 16px',
        paddingTop: '.5rem',
        paddingBottom: '.5rem',
        // paddingRight: '2.5rem',
        // paddingLeft: '2.5rem',
        // maxWidth: '14.6rem',
    },
    media: {
        // width: '8.8rem',
        // minWidth: '6.5rem',
        paddingTop: '0%', // Aspect ratio, 100% means 1:1, 50% means 2:1, etc
        marginTop: '30'
    },
    viewTitle: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 400,
        // fontSize: '.8rem',
    },
    views: {
        color: 'white',
        borderRadius: '1rem 0rem 1rem 0rem',
        paddingTop: '.4rem',
        paddingBottom: '.3rem',
        marginTop: '1rem',
        // maxWidth: '20rem',
    },
    viewNum: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 400,
    }
};


const RankCard: React.FC<StatCardProps> = (props) => {

    // Calling imported useResize hook to track width between the card and the card content elements
    const [widthState, textWidth, container, textContainer] = useResize();

    return (
        <div ref={container}>
            <ThemeProvider theme={rankCard}>
                <CardActionArea style={styles.card}
                    href={`${props.viewType === 'peak' ? '/profile/' : '/game/'}${props.statInfo.name}`}
                    sx={{
                        '&:hover': {
                            transform: 'scale(1.08)',
                        }
                    }}>

                    <div className='rankCircle' style={{ backgroundColor: props.rankColor.secondary, borderColor: props.rankColor.primary }}>
                        <span>{props.rankIndex + 1}</span>
                    </div>

                    <Card style={styles.cardContent} sx={{
                        display: 'flex',
                        height: { xs: '7.5rem', mobileXs: '8rem' },
                    }}
                    >
                        <MediaQuery minWidth={600}>
                            <CardMedia style={styles.media} image={props.statInfo.image}
                                sx={{
                                    display: { xs: 'none', sm: 'block' },
                                    // Calculation allows for consistent image resizing with all cards (avoids content based image sizes)
                                    minWidth: (widthState! / 3.980952381),
                                }}
                            />
                        </MediaQuery>
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <CardContent ref={textContainer}
                                sx={{
                                    backgroundColor: props.color.primary,
                                    textAlign: 'center',
                                    flex: '1 0 auto',
                                    width: '100%',
                                }}
                            >

                                <Typography style={styles.cardTitle} variant={'h5'}
                                    sx={{
                                        // Calculation prevents text cut-off, allows for '...' to appear in appropriate positions
                                        maxWidth: { xs: '14.6rem', sm: (widthState! / 1.857122884) },
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        fontSize: { xs: '0.8rem', mobileMed: '1rem' },
                                        paddingRight:
                                        {
                                            xs: '1.5rem',
                                            mobileXs: '3rem',
                                            // Calculations prevent inconsistent text centering (totals of left and right need to add up to 5)
                                            sm: ((textWidth! / widthState!) >= 0.86 && (textWidth! / widthState!) < 0.91 ? '2.75rem' :
                                                (textWidth! / widthState!) >= 0.91 && (textWidth! / widthState!) < 0.95 ? '3.1rem' :
                                                    (textWidth! / widthState!) >= 0.95 ? '3.5rem' : '2.5rem')
                                        },
                                        paddingLeft:
                                        {
                                            xs: '.6rem',
                                            mobileXs: '2rem',
                                            // Calculations prevent inconsistent text centering (totals of left and right need to add up to 5)
                                            sm: ((textWidth! / widthState!) >= 0.86 && (textWidth! / widthState!) < 0.91 ? '2.25rem' :
                                                (textWidth! / widthState!) >= 0.91 && (textWidth! / widthState!) < 0.95 ? '1.9rem' :
                                                    (textWidth! / widthState!) >= 0.95 ? '1.5rem' : '2.5rem')
                                        },
                                    }}
                                >
                                    {props.statInfo.name}
                                </Typography>


                                <Container style={styles.views}
                                    sx={{
                                        maxWidth:
                                        {
                                            xs: '20rem',
                                            // Calculation prevents inconsistent container widths based on card content
                                            sm: (widthState! / 1.416571764)
                                        },
                                        paddingLeft: {
                                            xs: 0,
                                            sm: `24px`,
                                        },
                                        marginX: {
                                            xs: 0,
                                            sm: 0
                                        },
                                        backgroundColor: props.color.secondary,
                                    }}
                                >

                                    <Typography style={styles.viewTitle}
                                        sx={{ fontSize: { xs: '0.65rem', mobileXs: '.8rem' } }}
                                    >
                                        {props.viewType === "avg" ? "7 Day View Average" :
                                            "7 Day View Peak"}
                                    </Typography>

                                    <Typography variant={'h6'} style={styles.viewNum}
                                        sx={{ fontSize: { xs: '1.1rem', mobileXs: '1.25rem' } }}
                                    >
                                        {props.statInfo.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </Typography>

                                </Container>
                            </CardContent>
                        </Box>
                    </Card>
                </CardActionArea>
            </ThemeProvider>
        </div>
    );
};

export default RankCard;