import React, { useState } from 'react'
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography'
// Importing colors from Material UI
import { indigo, deepPurple } from '@mui/material/colors';
import PieChart from './PieChart';
import { TopGames, PieContainerProps, Stats } from './TypesAndInterfaces';
import { createListData, Comparator } from '../utils/helpers';

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

const HomePies: React.FC<PieContainerProps> = (props) => {

    // Let of test data using an array of the Stats type, this is only used for display testing purposes for now
    let testData: Stats[] = createListData(props.data);
    const [canMount, setCanMount] = useState<boolean>(false);

    // Checks if loading is done and hasnt already had its completion state triggered, will load top games if so
    if (props.loading === false && canMount === false) {
        setCanMount(true);
    };

    return (
        <Box sx={{ flexGrow: 1 }} style={styles.container}>
            <Grid container alignItems="center" justifyContent="center">
                <Grid container maxWidth="md" alignItems="center" justifyContent="center" textAlign='center'>
                    <Grid item xs={12}>
                        <Typography variant={'h4'} mb={2} mt={1} borderBottom={5} borderTop={5} borderColor={deepPurple[700]} style={styles.mainTitle}>
                            Top 5 Divisions
                        </Typography>
                    </Grid>

                    {canMount === true ?
                        <Grid item xs={10} sm={3.9} ml={.2} mr={.2} className="homeChartItem">
                            <Typography variant={'h5'} mb={1} textAlign='center' style={styles.title}
                                width={'100%'}
                            >
                                Game Views
                            </Typography>
                            <PieChart
                                dataSet={testData.sort(Comparator).slice(0, 5)}
                                totalVal={props.totalVal}
                            />
                        </Grid> :
                        <Typography variant={'h4'}>
                            Loading...
                        </Typography>
                    }
                </Grid>
            </Grid>

        </Box>
    )
};

export default HomePies;