import React, { useState } from 'react'
import { useQuery } from "@apollo/client";
import { GET_TOP_CLIPS_WEEK } from "../utils/queries";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box';
import ClipCard from './ClipCard';
import { indigo, deepPurple } from '@mui/material/colors';

const styles = {
    container: {
        backgroundColor: indigo.A100,
        borderRadius: '0rem 0rem .5rem .5rem',
        padding: '0rem 1rem 1rem 1rem',
    },
    mainTitle: {
        display: 'inline-block',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
        color: 'white',
        backgroundColor: deepPurple[800],
        borderRadius: '1rem'
    },
};

const TopClips: React.FC = () => {

    const { loading, data, error } = useQuery(GET_TOP_CLIPS_WEEK);

    const topClipData = data?.getTopClips?.[0]?.topClips;

    console.log("TOP CLIP DATA -----------------------------")
    console.log(topClipData)

    return (


        <Grid container alignItems="center" justifyContent="center">
            <Grid container spacing={0} m={0} maxWidth="md" justifyContent="center" style={styles.container}>
                <Grid item xs={12} textAlign="center">
                    <Typography variant={'h4'} mt={2} mb={1} textAlign='center'
                        style={styles.mainTitle}
                        fontSize={{ xs: '1.85rem', sm: '2.13rem' }}
                    >
                        Top Clips
                    </Typography>
                </Grid>

                {loading === false ?
                    topClipData.map((clip: any, index: any) => (
                        <Grid item xs={ index === 0 ? 10 : 4} sm={2.4} py={2} px={1} key={index}>
                            <ClipCard
                                key={index}
                                title={clip.title}
                                broadcasterName={clip.broadcaster_name}
                                url={clip.embed_url}
                                thumbnail={clip.thumbnail_url}
                                createdAt={clip.created_at}
                                views={clip.view_count}
                            />
                        </Grid>

                    )) :
                    <Grid item xs={12}>
                        <Typography variant={'h4'} textAlign='center'>
                            Loading Clips...
                        </Typography>
                    </Grid>
                }
            </Grid>
        </Grid>

    )
}

export default TopClips;