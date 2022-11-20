import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography'
// Importing colors from Material UI
import { indigo, deepPurple } from '@mui/material/colors';

// Object containing style properties used for the MUI implementation throughout this file
const styles = {
    container: {
        backgroundColor: indigo[100],
        paddingBottom: '1rem',
    },
    mainTitle: {
        display: 'inline-block',
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
    },
    title: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
        color: 'white',
        backgroundColor: indigo[700],
        borderRadius: '1rem'
    },
};

const ProfileStats: React.FC = () => {
    return (
        <Box sx={{ flexGrow: 1 }} style={styles.container}>
            <Grid container alignItems="center" justifyContent="center">
                <Grid container maxWidth="md" alignItems="center" justifyContent="center" textAlign='center'>
                    <Grid item xs={12}>
                        <Typography variant={'h4'} mb={2} mt={1} borderBottom={5} borderTop={5} borderColor={deepPurple[700]} style={styles.mainTitle}>
                            All Time Views
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'h2'} mb={2} mt={0} style={styles.mainTitle}>
                            222,844,538
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'h2'} mb={2} mt={0} style={styles.mainTitle}>
                            Performance Chart Goes Here
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'h2'} mb={2} mt={0} style={styles.mainTitle}>
                            2 Pie Charts, 1: Most Streamed Games, 2: Most Streamed Days /use counter for percentage calc/
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'h2'} mb={2} mt={0} style={styles.mainTitle}>
                            All Time Most Popular Clips Goes Here
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

        </Box>
    )
}

export default ProfileStats