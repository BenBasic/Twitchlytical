import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';


const Loading: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant={'h4'}>Loading</Typography>
            <CircularProgress thickness={5} color="secondary" />
        </Box>
    )
};

export default Loading;