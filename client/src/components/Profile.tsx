import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import { ProfileHeaderProps, ProfileHeaderData } from './TypesAndInterfaces';
import { numShortFormat, miniGetAverage } from '../utils/helpers';
import { ThemeProvider } from '@mui/material/styles';
import { rankCard } from '../utils/themes';
import { getData } from '../utils/clientFetches';
import { indigo, deepPurple } from '@mui/material/colors';


const styles = {
    headerBox: {
        backgroundColor: '#17085B',
    },
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
        borderRadius: '1rem 1rem 0rem 0rem'
    },
    mainTitleBorder: {
        xs: 'none',
        mobileXs: '1rem solid ' + indigo[300],
    },
    title: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
        color: 'white',
        backgroundColor: indigo[700],
        borderRadius: '1rem'
    },
    profilePic: {
        // width: '10rem',
        // height: '10rem',
        border: '.5rem solid ' + indigo[300]
    },
    infoContainer: {
        backgroundColor: indigo[300],
        marginTop: '0rem',
    },
    infoContainerPadding: {
        xs: '1rem 0.3rem 1rem 0.3rem',
        mobileXs: '1rem 1rem 1rem 1rem',
        sm: '1rem 1rem 1rem 1rem',
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
        // borderRadius: '1.5rem 1.5rem 1.5rem 1.5rem',
        padding: '.6rem .2rem .6rem .2rem',
    },
    heading: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
        color: 'white',
    },
    allTimeTitle: {
        display: 'inline-block',
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
    },
    headingFonts: {
        xs: '.6rem',
        sm: '.8rem',
    },
    infoFonts: {
        // xs: '1.4rem', sm: '2.1rem'
        xs: '0.6rem',
        mobileXs: '1rem',
        sm: '1.4rem',
        smPlus: '1.7rem',
        smWide: '2.1rem',
        md: '2.1rem',
    },
    infoBorderMid: {
        xs: '0rem 0rem 0rem 0rem',
        sm: '1.5rem 1.5rem 1.5rem 1.5rem'
    },
    infoBorderLeft: {
        xs: '1rem 0rem 0rem 1rem',
        sm: '1.5rem 1.5rem 1.5rem 1.5rem'
    },
    infoBorderRight: {
        xs: '0rem 1rem 1rem 0rem',
        sm: '1.5rem 1.5rem 1.5rem 1.5rem'
    },
};

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const Profile: React.FC<ProfileHeaderProps> = (props) => {

    let userData: ProfileHeaderData = props.data;

    const [apiCheck, setApiCheck] = useState<number | undefined>(undefined);

    const apiCall = async (reqUrl: string) => {
        return await getData(process.env.REACT_APP_GET_FOLLOWS + reqUrl);
    }

    const [dataCheck, setDataCheck] = useState<number>(0);

    (async () => {

        if (dataCheck !== 0 && apiCheck === undefined) setApiCheck(dataCheck);

        const apiData = (apiCheck === undefined ? await apiCall(`?to_id=${userData.user_id}&first=1`) : undefined);

        const apiDataNested = (apiCheck === undefined ? await apiData?.total : undefined);

        if (apiCheck === undefined) {
            setDataCheck(apiDataNested)
            console.log("Profile Component if triggered")
            console.log(dataCheck)
        } else {
            console.log("Profile Component ELSE TRIGGERED")
            console.log(dataCheck)
        }
    })()

    // Font Size adjustments for the Username based on character amount (Twitch max char limit: 24)
    let fontSize = { xs: 1.55, mobileXs: 2.13, mobileMed: 2.13, sm: 2.13 }
    if (userData.name.length > 19) fontSize = { xs: 0.65, mobileXs: 1.04, mobileMed: 1.46, sm: 1.74 }
    if (userData.name.length <= 19 && userData.name.length > 15) fontSize = { xs: 0.82, mobileXs: 1.32, mobileMed: 1.85, sm: 2.13 }
    if (userData.name.length <= 15 && userData.name.length > 10) fontSize = { xs: 1, mobileXs: 1.65, mobileMed: 2.13, sm: 2.13 }


    console.log("TOTAL VIEWS IS " + userData.total_views)
    console.log("View Props is")
    console.log(props.views)

    return (
        <>
            <ThemeProvider theme={rankCard}>
                <Grid container alignItems="center" justifyContent="center">
                    <Box sx={{ flexGrow: 1 }} style={styles.headerBox}>
                        <Grid container alignItems="center" justifyContent="center">
                            <Grid container spacing={0} m={0} maxWidth="md" justifyContent="center" style={styles.container}>
                                {/* Profile Picture */}
                                <Grid item xs={3} alignItems='center' mt={2} sx={{ justifyContent: "center", display: { xs: "none", sm: "flex" } }}>
                                    <Avatar style={styles.profilePic} sx={{ width: { sm: "8rem", md: "10rem" }, height: { sm: "8rem", md: "10rem" } }}
                                        src={userData.profile_image_url} />
                                </Grid>
                                <Grid item xs={9} mt={2} textAlign="left">
                                    {/* Username */}
                                    <Typography  variant={'h4'} mt={2} mb={0} textAlign='center'
                                        style={styles.mainTitle}
                                        paddingBottom={{ xs: 0.4, mobileXs: 0}}
                                        paddingTop={{ xs: 0.4, mobileXs: 0}}
                                        borderBottom={styles.mainTitleBorder}
                                        fontSize={
                                            {
                                                xs: `${fontSize.xs}rem`,
                                                mobileXs: `${fontSize.mobileXs}rem`,
                                                mobileMed: `${fontSize.mobileMed}rem`,
                                                sm: `${fontSize.sm}rem`
                                            }
                                        }
                                    >
                                        {userData.name}
                                    </Typography>
                                    <Grid  container maxWidth="md" mt={2} mb={4} alignItems="left" justifyContent="left"
                                        style={styles.infoContainer}
                                        padding={styles.infoContainerPadding}
                                        sx={{ borderRadius: `0rem .5rem .5rem .5rem` }}
                                    >
                                        <Grid item xs={4} sm={3.3} md={3} mx={{ xs: 0, sm: 1 }} style={styles.liveStats}
                                            sx={{ borderRadius: styles.infoBorderLeft }}
                                        >
                                            <Typography variant={'subtitle2'} textAlign='center' style={styles.heading} fontSize={styles.headingFonts}>
                                                Followers
                                            </Typography>
                                            <Tooltip title={apiCheck !== undefined ? apiCheck.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "Loading..."} placement="bottom" arrow disableInteractive
                                                enterDelay={500}
                                                TransitionProps={{ timeout: 600 }}>
                                                <Typography variant={'h4'} textAlign='center' style={styles.heading} fontSize={styles.infoFonts}
                                                >
                                                    {apiCheck !== undefined ? numShortFormat(apiCheck) : 0}
                                                    {/* {apiCheck !== undefined ? apiCheck.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "Loading..."} */}
                                                </Typography>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={4} sm={3.3} md={3} mx={{ xs: 0, sm: 1 }} style={styles.liveStats}
                                            sx={{ borderRadius: styles.infoBorderMid }}
                                        >
                                            <Typography variant={'subtitle2'} textAlign='center' style={styles.heading} fontSize={styles.headingFonts}>
                                                Avg Views
                                            </Typography>
                                            <Typography variant={'h4'} textAlign='center' style={styles.heading} fontSize={styles.infoFonts}>
                                                {props.views.length > 0 ? miniGetAverage(props.views).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4} sm={3.3} md={3} mx={{ xs: 0, sm: 1 }} style={styles.liveStats}
                                            sx={{ borderRadius: styles.infoBorderRight }}
                                        >
                                            <Typography variant={'subtitle2'} textAlign='center' style={styles.heading} fontSize={styles.headingFonts}>
                                                Status
                                            </Typography>
                                            <Typography variant={'h4'} textAlign='center' style={styles.heading} fontSize={styles.infoFonts}>
                                                {userData.broadcaster_type === "" ? "Standard" : capitalizeFirstLetter(userData.broadcaster_type)}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={6} sm={4.95} md={4.5} mx={{ xs: 0, sm: 1 }} mt={2} style={styles.liveStats}
                                            sx={{ borderRadius: styles.infoBorderLeft }}
                                        >
                                            <Typography variant={'subtitle2'} textAlign='center' style={styles.heading} fontSize={styles.headingFonts}>
                                                Channel Created
                                            </Typography>
                                            <Typography variant={'h4'} textAlign='center' style={styles.heading} fontSize={styles.infoFonts}>
                                                {new Date(userData.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={4.95} md={4.5} mx={{ xs: 0, sm: 1 }} mt={2} style={styles.liveStats}
                                            sx={{ borderRadius: styles.infoBorderRight }}
                                        >
                                            <Typography variant={'subtitle2'} textAlign='center' style={styles.heading} fontSize={styles.headingFonts}>
                                                Last Live
                                            </Typography>
                                            <Typography variant={'h4'} textAlign='center' style={styles.heading} fontSize={styles.infoFonts}>
                                                {userData.lastLive}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>

                </Grid>

                <Grid container alignItems="center" justifyContent="center">
                    <Grid container maxWidth="md" alignItems="center" justifyContent="center" textAlign='center'>
                        <Grid item xs={12}>
                            <Typography variant={'h4'} mb={2} mt={1} borderBottom={5} borderTop={5} borderColor={deepPurple[700]} style={styles.allTimeTitle}>
                                {/* Broadcaster Total Views is depreciated from API, maybe include disclaimer about it being out of date */}
                                All Time Views
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant={'h2'} mb={2} mt={0} style={styles.allTimeTitle}
                                fontSize={{ xs: '2rem', sm: '3rem', md: '4rem' }}
                            >
                                {userData.total_views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </>
    )
}

export default Profile