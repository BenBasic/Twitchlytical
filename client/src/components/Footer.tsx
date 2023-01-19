import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { rankCard } from '../utils/themes';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import IconButton from '@mui/material/IconButton';
import { indigo } from '@mui/material/colors';

const styles = {
    container: {
        backgroundColor: indigo[900],
        padding: '0rem 1rem 1rem 1rem',
        minWidth: '100%',
    },
    disclaimer: {
        display: 'inline-block',
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 400,
        color: 'white',
    },
    fontSizes: {
        xs: '.5rem',
        mobileXs: '.55rem',
        sm: '.65rem',
        smWide: '.8rem',
    },
    paddings: {
        xs: '.3rem',
        sm: '1.5rem',
    }
};

const Footer: React.FC = () => {
    return (
        <ThemeProvider theme={rankCard}>
            <Grid container alignItems="center" justifyContent="center" mt={5} sx={{ position: 'absolute', bottom: 0 }}>
                <Grid container spacing={0} m={0} maxWidth="md" justifyContent="center" style={styles.container}>

                    <Grid item xs={12} textAlign="center">
                        <Typography variant={'subtitle1'} mt={2} mb={1} textAlign='center' style={styles.disclaimer} fontSize={styles.fontSizes} paddingLeft={styles.paddings} paddingRight={styles.paddings} maxWidth='md'>
                            Twitchlytical is not affiliated with Twitch or Amazon. All Trademarks referred to are the property of their respective owners. All historical performance data on Twitchlytical has been collected from January 20th, 2023 and onwards. No previous performance data is available through the official Twitch API.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} textAlign="center">
                        <Typography variant={'subtitle2'} mt={0} mb={1} textAlign='center' style={styles.disclaimer} paddingLeft={styles.paddings} paddingRight={styles.paddings} maxWidth='md'>
                            Copyright © {new Date().toLocaleDateString(undefined, { year: "numeric" })} Benjamin Basic
                        </Typography>
                    </Grid>

                    <Grid item xs={12} textAlign="center">
                        <IconButton aria-label="github" sx={{ "&:hover": { backgroundColor: indigo[700] } }}
                            href="https://github.com/BenBasic" target="_blank" rel="noreferrer"
                        >
                            <GitHubIcon fontSize='large' sx={{ color: 'white' }} />
                        </IconButton>

                        <IconButton aria-label="LinkedIn" sx={{ "&:hover": { backgroundColor: indigo[700] } }}
                            href="https://www.linkedin.com/in/benbasic/" target="_blank" rel="noreferrer"
                        >
                            <LinkedInIcon fontSize='large' sx={{ color: 'white' }} />
                        </IconButton>
                    </Grid>

                </Grid>
            </Grid>
        </ThemeProvider>
    )
}

export default Footer