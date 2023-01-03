import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import AppLogo from '../assets/Twitchlytical-Logo-40x40.webp';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
// Importing colors from Material UI
// import { indigo } from '@mui/material/colors';
import indigo from '@mui/material/colors/indigo';


const styles = {
    appTitle: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
    }
}

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const LogoButton = styled(Button)(({ theme }) => ({
    backgroundColor: indigo[900],
    '&:hover': {
        backgroundColor: indigo[700],
    },
})) as typeof Button;

const pages = ['Channels', 'Games', 'Clips', 'Global'];

const NavBar: React.FC = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: indigo[900] }}>
                <Toolbar>
                    <LogoButton variant="contained" startIcon={<Avatar src={AppLogo} variant="square" />} disableElevation
                    href="/"
                    >
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, textTransform: "none", display: { xs: 'none', sm: 'none', md: 'block' } }}
                            style={styles.appTitle}
                        >
                            Twitchlytical
                        </Typography>
                    </LogoButton>

                    <Divider orientation="vertical" variant="middle" color={indigo[300]}
                        flexItem sx={{ mx: 1 }} />

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex', md: 'flex' } }}>
                        {pages.map((page) => (
                            <LogoButton
                                key={page}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                                style={styles.appTitle}
                            >
                                {page}
                            </LogoButton>
                        ))}
                    </Box>

                    <Search >
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>

                    <IconButton sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        //onClick={handleOpenNavMenu}
                        color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>
                    
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default NavBar;