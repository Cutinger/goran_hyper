import React, { useEffect, useState } from 'react'
// import { List, Avatar, Row, Col, Button } from 'antd';
import { Row } from 'antd';
import useStyles from './style';
import axios from 'axios';
import Comments from './Sections/Comments'
import LikeDislikes from './Sections/LikeDislikes';
import { API_URL, API_KEY, IMAGE_BASE_URL, IMAGE_SIZE } from '../../Config'
import GridCards from '../../commons/GridCards';
import MainImage from '../LandingPage/Sections/MainImage';
import MovieInfo from './Sections/MovieInfo';
import Favorite from './Sections/Favorite';
import Spinner from '../LandingPage/Sections/Spinner';
import { useTranslation } from 'react-i18next';
import ReactPlayer from "react-player";
import GetMovieSources from '../../../_actions/user_actions.js'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import {
    CircularProgress,
    Container,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
} from '@material-ui/core';
const port = `5000`
const io = require('socket.io-client');
const socket = io(`http://localhost:${process.env.REACT_APP_SOCKET_PORT}`)



function SimpleDialog(props) {
    const { t } = useTranslation();
    const classes = useStyles();
    const { onClose, selectedValue, open, movieSources, movieID} = props;

    const handleClose = () => {
        
        onClose(selectedValue, movieID)
    };

    const handleListItemClick = value => {
     
        onClose(value, movieID);
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">{t('fr.chooseSrc')}</DialogTitle>
            <List>
                {movieSources && movieSources.ytsInfo && Array.isArray(movieSources.ytsInfo) && movieSources.ytsInfo.map((obj, key) => (
                    <ListItem button onClick={() => handleListItemClick('yts-' + obj.quality.substring(0, obj.quality.length - 1))} key={key}>
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                                <FiberManualRecordIcon style={{ color: '#4bbe4b'}}/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${obj.quality} - ${obj.seeds} seeds / ${obj.size}`}
                        />
                    </ListItem>
                ))}
                {movieSources && movieSources.leetInfo && Array.isArray(movieSources.leetInfo) && movieSources.leetInfo.map((obj, key) => (
                    <ListItem button onClick={() => handleListItemClick('1377-' + obj.quality.substring(0, obj.quality.length - 1))} key={key}>
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                                <FiberManualRecordIcon style={{ color: '#4bbe4b'}} />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${obj.quality} - ${obj.seeds} seeds / ${obj.size}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
} 

function MovieDetailPage(props) {
    const classes = useStyles();
    const { t } = useTranslation();
    const movieId = props.match.params.movieId
    const [Movie, setMovie] = useState([])
    const [Directors, setDirectors] = useState([])
    const [Casts, setCasts] = useState([])
    const [CommentLists, setCommentLists] = useState([])
    const [LoadingForMovie, setLoadingForMovie] = useState(true)
    const [LoadingForCasts, setLoadingForCasts] = useState(true)
    const [ActorToggle, setActorToggle] = useState(false)

   
    const [open, setOpen] = React.useState(false);
    // const [movieDetails] = useState(null);
    const [movieSrc, setMovieSrc] = useState(null);
    const [movieSources, setMovieSources] = useState(null);
    const [loader, setLoader] = useState(true);
    const [selectedValue, setSelectedValue] = useState(null);
 
   //regarder pour traduction du bouton 


    //     const sourceMessage = () => {
    //     if (movieSources) return selectedValue ? selectedValue : `${t('fr').chooseSrc} (${movieSources.ytsInfo.length + movieSources.leetInfo.length})`;
    //     else return  t('fr').noSrc
    // };

    const handleClickOpen = () => { setOpen(true) };
    const handleClose = (value, movieID) => {
        setOpen(false);
        setMovieSrc(false);
        
         socket.emit("stream:unmount");
        setTimeout(() => {
            setTimeout(() => {
                socket.emit("stream:play", movieID)
            }, 3000);
            setSelectedValue(value);
        }, 3000)
      
    };

    useEffect(() => {
        let mounted = true;
        function streamMovie() {
            let src = null;
            
            let splittedValues = selectedValue.split('-');
            console.log(splittedValues)
        //   
            if (splittedValues.length > 1)
                src = `http://localhost:${port}/api/movies/${splittedValues[0]}/${splittedValues[1]}/${Movie.imdb_id}`
            console.log(src)
            mounted && setMovieSrc(src); 
        }
        if (selectedValue) {
          
            mounted && streamMovie();
        }
        return () => {
            socket.emit("stream:unmount");
            mounted = false
        }
    }, [selectedValue,Movie]);

    useEffect(() => {
        // new endpoint not based on most popular like landing page but movie id
        let _mounted = true;
        const fetchDetailInfo = (endpoint) => {

            fetch(endpoint)
                .then(result => result.json())
                .then(result => {
                    console.log(result);  
                    setMovie(result)
                    setLoadingForMovie(false)
    
                    let endpointForCasts = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
    
                    fetch(endpointForCasts)
                        .then(result => result.json())
                        .then(result => {
                            console.log(result);
                            setCasts(result.cast);
                            const Directors = result.crew.filter((member) => member.job === "Director");
                            setDirectors(Directors);
                        })
                    setLoadingForCasts(false)
                })
                
                .catch(error => console.error('Error:', error)
                )
        }
        GetMovieSources(movieId).then((res) => {
            if (res.status === 200) {
                if (res.data && (res.data.inYTS || res.data.inLeet )) {
                    _mounted && setMovieSources(res.data);
                //    console.log(res.data)
                }
                else
                    _mounted && setMovieSources(null);
            }
            else
                _mounted && setMovieSources(null);
              _mounted && setLoader(false);
        })
        // console.log(movieSources)
       
        let endpointForMovieInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=${t('langMovie.en')}`;
        fetchDetailInfo(endpointForMovieInfo)

        axios.post('/api/comment/getComments', movieId)
            .then(response => {
                // console.log(response)
                if (response.data.success) {
                    // console.log('response.data.comments', response.data.comments)
                    setCommentLists(response.data.comments)
                } else {
                    alert('Failed to get comments Info')
                }
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {_mounted = false }
    }, [movieId, t])
    
    const toggleActorView = () => {
        setActorToggle(!ActorToggle)
    }


    const updateComment = (newComment) => {
        setCommentLists(CommentLists.concat(newComment))
    }

    return (
        <div>
            {/* Header */}
            {!LoadingForMovie ?
                <MainImage
                    image={Movie.backdrop_path ? `${IMAGE_BASE_URL}${IMAGE_SIZE}${Movie.backdrop_path}` : "https://res.cloudinary.com/dkyqbngya/image/upload/v1586787757/detykqycj7ejezsjmxln.png"}
                    title={Movie.title}
                    text={Movie.overview}
                />
                :
                <div><Spinner /></div>
            }


            {/* Body */}
            <div style={{ width: '85%', margin: '1rem auto' }}>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Favorite movieInfo={Movie} movieId={movieId} userFrom={localStorage.getItem('userId')} />
                </div>


                {/* Movie Info */}
                {!LoadingForMovie ?
                    <MovieInfo movie={Movie} directors={Directors} />
                    :
                    <div><Spinner /></div>
                }

                <br />
                {/* Actors Grid*/}

                <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>
                    <Button onClick={toggleActorView}>{t('movie.showActors')}</Button>
                </div>
                <br/>
                                    <Button
                                        
                                        variant="outlined"
                                        className={classes.buttonChooseSource}
                                        onClick={handleClickOpen}
                                        disabled={!movieSources ? true : false}
                                    >
                                        {/* {sourceMessage()} */}
                                        Sources
                                    </Button>
                                    {
                                        loader?
                                        <CircularProgress style={{color:"black"}} />: null
                                    }
                                    <SimpleDialog  movieSources={movieSources} selectedValue={selectedValue}
                                                  open={open} onClose={handleClose} movieID={props.match.params.movieId}/>
                                {
                    movieSrc?
                        <Container style={{padding: '0', marginTop: '2.5em', userSelect: 'false'}}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <div   className={classes.playerWrapper}>
                                        <ReactPlayer
                                            width='100%'
                                            height='100%'
                                            url={movieSrc}
                                            className={classes.reactPlayer}
                                            playing
                                            controls={true}
                                            config={{
                                                file: {
                                                    attributes: {
                                                        crossOrigin: 'use-credentials'
                                                    },
                                                    // tracks: subtitles
                                                }
                                            }}
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </Container> : null
                }
                {ActorToggle &&
                    <Row gutter={[16, 16]}>
                        {
                            !LoadingForCasts ? Casts.map((cast, index) => (
                                cast.profile_path &&
                                <React.Fragment key={index}>
                                <GridCards actor image={cast.profile_path} characterName={cast.name} />
                                </React.Fragment>
                            )) :
                                <div><Spinner /></div>
                        }
                    </Row>
                }
                <br />


                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <LikeDislikes video videoId={movieId} userId={localStorage.getItem('userId')} />
                </div>

                {/* Comments */}
                <Comments movieTitle={Movie.title} CommentLists={CommentLists} postId={movieId} refreshFunction={updateComment} />

            </div>

        </div>
    )
}

export default MovieDetailPage

