import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TwitchlyticalIcon from '../assets/Twitchlytical-Icon.webp'
import { indigo } from '@mui/material/colors';
import { SearchHeaderProps } from './TypesAndInterfaces'

import MediaQuery from 'react-responsive';

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
    icon: {
        width: '100%',
        height: '100%',
    },
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ header, search }) => {
    return (
        <Box sx={{ flexGrow: 1 }} style={styles.headerBox} mb={2}>
            <Grid container alignItems="center" justifyContent="center">
                <Grid container maxWidth="md" alignItems="center" justifyContent="center">

                    <Grid item xs={8} mt={3} mb={1} >
                        <Typography variant={'h4'} textAlign='left' pr={2} style={styles.heading}>
                            {header}
                        </Typography>
                        <Divider sx={{ width: '80%', my: 2 }} color={indigo[300]} />
                        <Typography variant={'h3'} pr={2} style={styles.heading}
                            sx={{
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textAlign: "left",
                                display: "block"
                            }}
                        >
                            {search ? search : "Nothing"}
                        </Typography>
                    </Grid>

                    <MediaQuery minWidth={600}>
                        <Grid item xs={2} mt={3} mb={1}>
                            <Avatar src={TwitchlyticalIcon} sx={{ display: { xs: 'none', sm: 'flex' } }} variant="square" style={styles.icon} />
                        </Grid>
                    </MediaQuery>

                </Grid>
            </Grid>
        </Box>
    )
}

export default SearchHeader