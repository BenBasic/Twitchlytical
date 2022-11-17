import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TwitchlyticalIcon from '../assets/Twitchlytical-Icon.webp'
import { indigo } from '@mui/material/colors';
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
    width: '9rem',
    height: '9rem',
  },
  liveStats: {
    padding: '.6rem .2rem .6rem .2rem',
    borderRadius: '1.5rem 1.5rem 1.5rem 1.5rem',
    backgroundColor: indigo[500],
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
            <Typography variant={'h4'} textAlign='left' style={styles.heading}>
              Visualized Twitch Analytics
            </Typography>
            <Typography component='div' variant={'subtitle1'} mt={2} mb={1} textAlign='left' style={styles.subtitle}>
              <Box display='inline' style={styles.bold}>Twitchlytical</Box> is here to help you
              <Box display='inline' style={styles.bold}> keep up to date with your favorite streamers and games </Box>
              by providing visualized Twitch stats and analytics,
              <Box display='inline' style={styles.bold}> all in one place.</Box>
            </Typography>
          </Grid>

          <Grid item xs={2} mt={3} mb={1} >
            <Avatar src={TwitchlyticalIcon} variant="square" style={styles.icon} />
          </Grid>

          <Divider sx={{ width: '80%', my: 2 }} variant="middle" color={indigo[300]} />

          <Grid container maxWidth="md" mt={2} mb={4} alignItems="center" justifyContent="center">
            {loadingState === false ?
              currentStatsState.map((stat, index) => (
                <Grid item xs={3} mx={1} style={styles.liveStats} key={index}>
                  <Typography variant={'subtitle2'} textAlign='center' style={styles.heading}>
                    Current Live {index === 0 ? 'Viewers' :
                      index === 1 ? 'Channels' :
                        'Games'}
                  </Typography>
                  <Typography variant={'h4'} textAlign='center' style={styles.heading}>
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