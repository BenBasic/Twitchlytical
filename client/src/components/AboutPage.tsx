import React from 'react';
import SearchHeader from './SearchHeader';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconMe from '../assets/Twitchlytical AboutMe.webp';
import { indigo } from '@mui/material/colors';

const styles = {
    container: {
        backgroundColor: indigo[200],
        borderRadius: '.5rem .5rem .5rem .5rem',
        paddingBottom: '2rem',
        marginTop: '2rem',
    },
    mainTitle: {
        display: 'inline-block',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
        color: 'white',
        backgroundColor: indigo[700],
        borderRadius: '1rem'
    },
    text: {
        display: 'inline-block',
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 400,
        fontSize: '1.1rem',
    },
    bold: {
        fontWeight: 700,
    },
};

const AboutPage: React.FC = () => {
    return (
        <>
            <SearchHeader header={"About"} search={"Twitchlytical"} />

            <Container maxWidth="md" style={styles.container} className="topStatsContainer">
                <Grid item xs={12} textAlign="center">
                    <Typography variant={'h4'} mt={2} mb={1} textAlign='center'
                        style={styles.mainTitle}
                        fontSize={{ xs: '1.85rem', sm: '2.13rem' }}
                    >
                        How It Started
                    </Typography>
                </Grid>
                <Grid container mt={2} mb={2}>

                    <Grid item xs={12} sm={0} mb={2} sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar src={IconMe} variant="rounded" alt='Person waving' sx={{ width: '8rem', height: '8rem' }} />
                    </Grid>

                    <Grid item xs={12} sm={8}>
                        <Typography variant={'subtitle1'} mb={1} mr={2} style={styles.text}>
                            Hey! My name is <Box display='inline' style={styles.bold}>Benjamin</Box>, and I'm the <Box display='inline' style={styles.bold}>creator of Twitchlytical</Box>, a project for visualizing statistics and analytics from Twitch.
                            My initial inspiration to work on this came from a <Box display='inline' style={styles.bold}>desire to learn</Box> tools that (at the time) were unfamiliar to me.
                            I'm always eager to learn new things to add to my toolset, and developing Twitchlytical has helped me become confident using technologies such as
                            <Box display='inline' style={styles.bold}> TypeScript</Box>, <Box display='inline' style={styles.bold}>D3js</Box>, and <Box display='inline' style={styles.bold}>Material UI</Box>.
                        </Typography>
                        <Typography variant={'subtitle1'} mb={1} mr={2} style={styles.text}>
                            If you would like to contact me, you can reach me on <a className='aboutUrl' href='https://www.linkedin.com/in/benbasic/' target="_blank" rel="noreferrer">LinkedIn</a> or send me an <a className='aboutUrl' href='mailto:benjaminybasic@gmail.com'>email</a>.
                        </Typography>
                    </Grid>
                    <Grid item xs={0} sm={4}>
                        <Avatar src={IconMe} variant="rounded" alt='Person waving' sx={{ width: '100%', height: 'auto', display: { xs: 'none', sm: 'flex' } }} />
                    </Grid>
                </Grid>

            </Container>
        </>
    )
}

export default AboutPage