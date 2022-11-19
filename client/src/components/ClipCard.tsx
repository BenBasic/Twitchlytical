import React from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Tooltip from '@mui/material/Tooltip';
import { ClipModalProps } from './TypesAndInterfaces';
// Importing colors from Material UI
import { indigo, deepPurple } from '@mui/material/colors';

const styles = {
    card: {
        transition: '0.1s',
        height: 'fit-content',
        borderRadius: 12,
        backgroundColor: indigo[700],
    },
    cardMedia: {
        transition: '0.1s',
        width: 'auto',
        paddingTop: '56%',
        marginTop: '30',
        borderRadius: 6,
        cursor: 'pointer',
    },
    cardContent: {
        padding: 0,
    },
    cardTitle: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
        fontSize: '.8rem',
        backgroundColor: 'white',
        marginTop: '.5rem',
        marginBottom: '.3rem',
        padding: '.25rem',
    },
    cardText: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 400,
        color: 'white',
        fontSize: '.8rem',
        paddingTop: '.15rem',
        paddingLeft: '.25rem',
    },
    cardBox: {
        paddingBottom: '.15rem',
        borderRadius: '.3rem',
        backgroundColor: indigo[900],
    },
    modalBox: {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 0,
    },

};

const ClipCard: React.FC<ClipModalProps> = (props) => {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const parent: string = "localhost";


    return (

        <div>

            <Card style={styles.card} sx={{
                display: 'block',
                padding: { xs: '0rem', sm: '.4rem', md: '.75rem' },
                '&:hover': {
                    transform: 'scale(1.1)',
                },
            }}
            >
                <CardMedia
                    style={styles.cardMedia}
                    image={props.thumbnail}
                    onClick={handleOpen}
                    sx={{
                        '&:hover': {
                            transform: 'scale(1.24)',
                            transformOrigin: `50% 65%`,
                        },
                    }}
                />
                <CardContent style={styles.cardContent}>
                    <Tooltip title={props.title} placement="bottom" arrow disableInteractive
                    enterDelay={500}
                    TransitionProps={{ timeout: 600 }}
                    >
                        <Typography style={styles.cardTitle} variant={'h5'} textAlign='center'
                            sx={{
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textAlign: "left",
                                display: "block",
                                borderRadius: { xs: '0rem', sm: '.3rem' },
                            }}
                        >
                            {props.title}
                        </Typography>
                    </Tooltip>

                    <Box style={styles.cardBox}>
                        <Typography style={styles.cardText} variant={'h5'}
                            sx={{
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textAlign: "left",
                                display: "block"
                            }}
                        >
                            {props.broadcasterName}
                        </Typography>
                        <Typography style={styles.cardText} variant={'h5'}
                            sx={{
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textAlign: "left",
                                display: "block"
                            }}
                        >
                            {props.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " views"}
                        </Typography>
                        <Typography style={styles.cardText} variant={'h5'}
                            sx={{
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textAlign: "left",
                                display: "block"
                            }}
                        >
                            {new Date(props.createdAt).toLocaleDateString(undefined, { weekday: "long" })}
                        </Typography>
                    </Box>

                </CardContent>
            </Card>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={styles.modalBox} className='modalContent'>
                        <iframe
                            title={props.title}
                            src={`${props.url}&parent=${parent}&preload=none`}
                            height="100%"
                            width="100%"
                            allowFullScreen
                        >
                        </iframe>
                    </Box>
                </Fade>
            </Modal>
        </div>

    )
}

export default ClipCard