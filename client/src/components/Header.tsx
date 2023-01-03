import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TwitchlyticalIcon from '../assets/Twitchlytical-Icon.webp'
// import { indigo } from '@mui/material/colors';
import indigo from '@mui/material/colors/indigo';
import { useQuery } from "@apollo/client";
import { GET_CURRENT_DATA } from "../utils/queries";

const styles = {
  headerBox: {
    height: 'fit-content',
    backgroundColor: '#17085B',
    color: 'white',
  },
  heading: {
    fontFamily: 'Outfit, sans-serif',
    fontWeight: 700,
  },
  subtitle: {
    fontFamily: 'Outfit, sans-serif',
    color: indigo[100],
  },
  bold: {
    color: 'white',
    fontWeight: 700,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  liveStats: {
    backgroundColor: indigo[500],
    borderRadius: '1.5rem 1.5rem 1.5rem 1.5rem',
    padding: '.6rem .2rem .6rem .2rem',
  }
}

const Header: React.FC = () => {

  const { loading, data, error } = useQuery(GET_CURRENT_DATA);

  const [loadingState, setLoadingState] = useState<boolean>(loading);

  const currentData = data?.getCurrentData[0];

  let currentArray = [
    currentData?.totalViewers,
    currentData?.totalChannels,
    currentData?.totalGames,
  ]

  const [currentStatsState, setCurrentStatsState] = useState(currentArray);

  if (loading === false && loadingState === true) {
    setCurrentStatsState(currentArray);
    setLoadingState(false);
  }

  return (
    <Box sx={{ flexGrow: 1 }} style={styles.headerBox}>
      <Grid container alignItems="center" justifyContent="center">
        <Grid container maxWidth="md" alignItems="center" justifyContent="center">

          <Grid item xs={8} mt={3} mb={1} >
            <Typography variant={'h4'} textAlign='left' pr={2} style={styles.heading}>
              Visualized Twitch Analytics
            </Typography>
            <Typography component='div' variant={'subtitle1'} mt={2} mb={1} pr={4} textAlign='left' style={styles.subtitle}>
              <Box display='inline' style={styles.bold}>Twitchlytical</Box> is here to help you
              <Box display='inline' style={styles.bold}> keep up to date with your favorite streamers and games </Box>
              by providing visualized Twitch stats and analytics,
              <Box display='inline' style={styles.bold}> all in one place.</Box>
            </Typography>
          </Grid>

          <Grid item xs={2} mt={3} mb={1}>
            <Avatar src={TwitchlyticalIcon} sx={{ display: { xs: 'none', sm: 'flex' }}} variant="square" style={styles.icon} />
          </Grid>

          <Divider sx={{ width: '80%', my: 2 }} variant="middle" color={indigo[300]} />

          <Grid container maxWidth="md" mt={2} mb={4} alignItems="center" justifyContent="center"
          sx={{ backgroundColor: { xs: indigo[500], sm: 'transparent'} }}
          >
            {loadingState === false ?
              currentStatsState.map((stat, index) => (
                <Grid item xs={4} sm={3.3} md={3} mx={{ xs: 0, sm: 1 }} style={styles.liveStats} key={index}
                >
                  <Typography variant={'subtitle2'} textAlign='center' style={styles.heading} fontSize={{ xs: '.6rem', sm: '.8rem'}}>
                    Current Live {index === 0 ? 'Viewers' :
                      index === 1 ? 'Channels' :
                        'Games'}
                  </Typography>
                  <Typography variant={'h4'} textAlign='center' style={styles.heading} fontSize={{ xs: '1.4rem', sm: '2.1rem'}}>
                    {stat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </Typography>
                </Grid>
              )) :
              <Typography variant={'h4'} textAlign='center' style={styles.heading}>
                Loading Live Stats...
              </Typography>
            }
          </Grid>

        </Grid>
      </Grid>
    </Box>
  )
}

export default Header