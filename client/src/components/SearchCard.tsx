import React, { useState, useEffect, useRef } from 'react'
import Typography from '@mui/material/Typography'
import CardActionArea from '@mui/material/CardActionArea';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { SearchCardProps } from './TypesAndInterfaces';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import { specialCategories, gameUrlReturner } from '../utils/helpers';
import { rankCard } from '../utils/themes';
import useResize from '../utils/resizeHook';
import { indigo } from '@mui/material/colors';

import MediaQuery from 'react-responsive';


// Object containing style properties used for the MUI implementation throughout this file
const styles = {
    card: {
        borderRadius: 16,
        marginTop: '1rem',
        transition: '0.1s',
        maxWidth: '26.1rem',
    },
    cardContent: {
        borderRadius: 16,
        color: 'black',
        maxWidth: '26.1rem',
    },
    cardTitle: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
        backgroundColor: 'white',
        borderRadius: '16px 0px 0px 16px',
        paddingTop: '.5rem',
        paddingBottom: '.5rem',
    },
    media: {
        paddingTop: '0%', // Aspect ratio, 100% means 1:1, 50% means 2:1, etc
        marginTop: '30'
    },
};

const SearchCard: React.FC<SearchCardProps> = (props) => {

    // Calling imported useResize hook to track width between the card and the card content elements
    const [widthState, textWidth, container, textContainer] = useResize();

    let imgIcon: string | undefined = props.imgUrl;

    if (imgIcon === undefined && props.id) imgIcon = gameUrlReturner(specialCategories, props.name, props.id);

    return (
        <div ref={container}>
            <ThemeProvider theme={rankCard}>
                <CardActionArea style={styles.card}
                    href={`${props.type === 'broadcaster' ? '/profile/' : '/game/'}${props.name}`}
                    sx={{
                        '&:hover': {
                            transform: 'scale(1.08)',
                        }
                    }}>

                    <Card style={styles.cardContent} sx={{
                        display: 'flex',
                        height: { xs: '5rem', mobileXs: '5rem' },
                    }}
                    >

                        <MediaQuery minWidth={600}>
                            <CardMedia style={styles.media} image={imgIcon}
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
                                    backgroundColor: { xs: indigo[700] },
                                    textAlign: 'center',
                                    flex: '1 0 auto',
                                    width: '100%',
                                    backgroundImage: { xs: `url(${imgIcon})`, sm: `none` },
                                    backgroundSize: { xs: '100%' },
                                    backgroundPosition: '0% 20%',
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
                                        borderBottom: { xs: 'solid 0.2rem black', sm: 'none' },
                                        paddingRight:
                                        {
                                            xs: '1.5rem',
                                            mobileXs: '1.5rem',
                                            // Calculations prevent inconsistent text centering (totals of left and right need to add up to 5)
                                            sm: ((textWidth! / widthState!) >= 0.86 && (textWidth! / widthState!) < 0.91 ? '2.75rem' :
                                                (textWidth! / widthState!) >= 0.91 && (textWidth! / widthState!) < 0.95 ? '3.1rem' :
                                                    (textWidth! / widthState!) >= 0.95 ? '3.5rem' : '2.5rem')
                                        },
                                        paddingLeft:
                                        {
                                            xs: '.6rem',
                                            mobileXs: '1rem',
                                            // Calculations prevent inconsistent text centering (totals of left and right need to add up to 5)
                                            sm: ((textWidth! / widthState!) >= 0.86 && (textWidth! / widthState!) < 0.91 ? '2.25rem' :
                                                (textWidth! / widthState!) >= 0.91 && (textWidth! / widthState!) < 0.95 ? '1.9rem' :
                                                    (textWidth! / widthState!) >= 0.95 ? '1.5rem' : '2.5rem')
                                        },
                                    }}
                                >
                                    {props.name}
                                </Typography>
                            </CardContent>
                        </Box>
                    </Card>
                </CardActionArea>
            </ThemeProvider>
        </div>
    )
}

export default SearchCard