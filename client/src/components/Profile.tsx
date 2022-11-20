import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar';
import { indigo, deepPurple } from '@mui/material/colors';

const styles = {
    container: {
        backgroundColor: '#17085B',
        // borderRadius: '.5rem .5rem .5rem .5rem',
        // marginTop: '1rem',
        padding: '0rem 1rem 1rem 1rem',
    },
    mainTitle: {
        display: 'inline-block',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
        color: 'white',
        backgroundColor: indigo[700],
        borderBottom: '1rem solid ' + indigo[300],
        borderRadius: '1rem 1rem 0rem 0rem'
    },
    title: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
        color: 'white',
        backgroundColor: indigo[700],
        borderRadius: '1rem'
    },
    profilePic: {
        width: '10rem',
        height: '10rem',
        border: '.5rem solid ' + indigo[300]
    },
    infoContainer: {
        backgroundColor: indigo[300],
        borderRadius: '0rem .5rem .5rem .5rem',
        marginTop: '0rem',
        padding: '1rem 1rem 1rem 1rem',
    },
    infoBubbles: {
        display: 'inline',
        color: 'white',
        backgroundColor: indigo[500],
        borderRadius: '1rem 1rem 1rem 1rem',
        padding: '.5rem .5rem .5rem .5rem',
        marginRight: '.2rem',
        fontFamily: 'Outfit, sans-serif',
    },
    liveStats: {
        backgroundColor: indigo[500],
        borderRadius: '1.5rem 1.5rem 1.5rem 1.5rem',
        padding: '.6rem .2rem .6rem .2rem',
    },
    heading: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
        color: 'white',
    },
};

const Profile: React.FC = () => {
    return (
        <Grid container alignItems="center" justifyContent="center">
            <Grid container spacing={0} m={0} maxWidth="md" justifyContent="center" style={styles.container}>
                <Grid item xs={3} alignItems='center' mt={2} sx={{ justifyContent: "center", display: "flex" }}>
                    <Avatar style={styles.profilePic}
                        src={'https://static-cdn.jtvnw.net/jtv_user_pictures/b3c347ed-1a7a-40a2-8bee-8a7c4426eb33-profile_image-300x300.png'} />
                </Grid>
                <Grid item xs={9} mt={2} textAlign="left">
                    <Typography variant={'h4'} mt={2} mb={0} textAlign='center'
                        style={styles.mainTitle}
                        fontSize={{ xs: '1.85rem', sm: '2.13rem' }}
                    >
                        HelloName
                    </Typography>
                    <Grid container maxWidth="md" mt={2} mb={4} alignItems="left" justifyContent="left"
                        style={styles.infoContainer}
                    >
                        <Grid item xs={4} sm={3.3} md={3} mx={{ xs: 0, sm: 1 }} style={styles.liveStats}>
                            <Typography variant={'subtitle2'} textAlign='center' style={styles.heading} fontSize={{ xs: '.6rem', sm: '.8rem' }}>
                                Followers
                            </Typography>
                            <Typography variant={'h4'} textAlign='center' style={styles.heading} fontSize={{ xs: '1.4rem', sm: '2.1rem' }}>
                                902,310
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sm={3.3} md={3} mx={{ xs: 0, sm: 1 }} style={styles.liveStats}>
                            <Typography variant={'subtitle2'} textAlign='center' style={styles.heading} fontSize={{ xs: '.6rem', sm: '.8rem' }}>
                                Average Views
                            </Typography>
                            <Typography variant={'h4'} textAlign='center' style={styles.heading} fontSize={{ xs: '1.4rem', sm: '2.1rem' }}>
                                219,032
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sm={3.3} md={3} mx={{ xs: 0, sm: 1 }} style={styles.liveStats}>
                            <Typography variant={'subtitle2'} textAlign='center' style={styles.heading} fontSize={{ xs: '.6rem', sm: '.8rem' }}>
                                Partner
                            </Typography>
                            <Typography variant={'h4'} textAlign='center' style={styles.heading} fontSize={{ xs: '1.4rem', sm: '2.1rem' }}>
                                Yes
                            </Typography>
                        </Grid>

                        <Grid item xs={6} sm={4.95} md={4.5} mx={{ xs: 0, sm: 1 }} mt={2} style={styles.liveStats}>
                            <Typography variant={'subtitle2'} textAlign='center' style={styles.heading} fontSize={{ xs: '.6rem', sm: '.8rem' }}>
                                Channel Created
                            </Typography>
                            <Typography variant={'h4'} textAlign='center' style={styles.heading} fontSize={{ xs: '1.4rem', sm: '2.1rem' }}>
                                Mar 23, 2018
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={4.95} md={4.5} mx={{ xs: 0, sm: 1 }} mt={2} style={styles.liveStats}>
                            <Typography variant={'subtitle2'} textAlign='center' style={styles.heading} fontSize={{ xs: '.6rem', sm: '.8rem' }}>
                                Last Live
                            </Typography>
                            <Typography variant={'h4'} textAlign='center' style={styles.heading} fontSize={{ xs: '1.4rem', sm: '2.1rem' }}>
                                3 Hours Ago
                            </Typography>
                        </Grid>

                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Profile