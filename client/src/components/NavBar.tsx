import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Tooltip from '@mui/material/Tooltip';
// Importing colors from Material UI
import { indigo } from '@mui/material/colors';



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

const pages = ['Streamers', 'Games', 'About'];

const NavBar: React.FC = () => {

    const [searchVal, setSearchVal] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const navigate = useNavigate();

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // Prevents page reloading
        e.preventDefault();
        // If less than 3 characters (non whitespace) are typed into search, do nothing
        if (searchVal.replace(/\s/g, '').length < 3) {
            // If open state is false, set to true to display error message
            if (open === false) {
                setOpen(true);
                setTimeout(function () {
                    setOpen(false);
                }, 1200);
            };
            return;
        };
        navigate(`/search?query=${searchVal.trim()}`);
        // If something has been typed into search, clear the field and send to the appropriate page
        setSearchVal("");
        console.log("SEARCH IS: " + searchVal)
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Prevents page reloading
        e.preventDefault();
        // Sets the search value to what is currently typed into the search field
        setSearchVal(e.target.value);
        console.log("SEARCH IS: " + searchVal)
    };

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorEl(null);
    };

    console.log("anchorElement is")
    console.log(anchorEl)

    return (
        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', backgroundColor: indigo[900] }}>
            <AppBar elevation={0} position="static" sx={{ backgroundColor: indigo[900], maxWidth: '1000px' }}>
                <Toolbar>
                    <LogoButton variant="contained" startIcon={<Avatar src={AppLogo} variant="square" alt='Homepage Logo' />} disableElevation
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
                                href={`/browse/${page}/`}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                                style={styles.appTitle}
                            >
                                {page}
                            </LogoButton>
                        ))}
                    </Box>

                    <Tooltip open={open} placement="bottom"
                        disableFocusListener disableTouchListener disableHoverListener
                        title={
                            <h1 style={{ width: '100%', fontSize: '1.2rem' }}>
                                Minimum 3 characters required
                            </h1>
                        }
                    >
                        <Search >
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <form onSubmit={onSubmit}>
                                <StyledInputBase
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                    onChange={handleChange}
                                    value={searchVal}
                                />
                            </form>
                        </Search>
                    </Tooltip>

                    <IconButton sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>

                    <Menu
                        id="demo-positioned-menu"
                        aria-labelledby="demo-positioned-button"
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={handleCloseNavMenu}
                        disableScrollLock={true}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        {pages.map((page, index) => (
                            <MenuItem
                                key={page}
                                component={Link}
                                to={`/browse/${page}/`}
                            >
                                {page}
                            </MenuItem>
                        ))}
                    </Menu>

                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default NavBar;