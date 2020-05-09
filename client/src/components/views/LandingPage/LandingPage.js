import React, { useState, useRef, useEffect } from 'react'
import { Typography, Row, Button } from 'antd';
import { API_URL, API_KEY, IMAGE_BASE_URL, IMAGE_SIZE, POSTER_SIZE } from '../../Config'
import MainImage from './Sections/MainImage'
import GridCard from '../../commons/GridCards'
import { useTranslation } from 'react-i18next';
import SearchBar from './Sections/SearchBar';
import Spinner from './Sections/Spinner';

//custom hook
import { FetchHome } from './Sections/FetchHome'

const { Title } = Typography;

const LandingPage = () => {

    const [
        { state: { Movies, CurrentPage, totalPages, MainMovieImage },
            loading,
            error,
        },
        fetchMovies
    ] = FetchHome()
    //  console.log(state)
    const [searchTerm, setSearchTerm] = useState('');
    const buttonRef = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
    }, [])

    const genres = [
        { id: 28, name: t('genre.Action') },
        { id: 12, name: t('genre.Adventure') },
        { id: 16, name: t('genre.Animation') },
        { id: 35, name: t('genre.Comedy') },
        { id: 80, name: t('genre.Crime') },
        { id: 99, name: t('genre.Documentary')},
        { id: 18, name: t('genre.Drama') },
        { id: 10751, name: t('genre.Family') },
        { id: 14, name: t('genre.Fantasy') },
        { id: 36, name: t('genre.History') },
        { id: 27, name: t('genre.Horror') },
        { id: 10402, name: t('genre.Music') },
        { id: 9648, name: t('genre.Mystery') },
        { id: 10749, name: t('genre.Romance') },
        { id: 878, name: t('genre.Sci-Fi') },
        { id: 10770, name: t('genre.TV-Movie') },
        { id: 53, name: t('genre.Thriller') },
        { id: 10752, name: t('genre.War') },
        { id: 37, name: t('genre.Western') },
    ];

    //search movies function 
    const searchMovies = search => {
        const CurrentLanguage = localStorage.getItem('language')
        const endpoint = search ? `${API_URL}search/movie?api_key=${API_KEY}&language=${CurrentLanguage}&query=` + search : `${API_URL}discover/movie?api_key=${API_KEY}&language=${CurrentLanguage}&sort_by=popularity.desc&include_adult=false&include_video=false`
        setSearchTerm(search)
        fetchMovies(endpoint)
    }


    //loadmoremovies function
    const loadMoreMovies = () => {
        const CurrentLanguage = localStorage.getItem('language')
        const popularEndpoint = `${API_URL}discover/movie?api_key=${API_KEY}&language=${CurrentLanguage}&sort_by=popularity.desc&include_adult=false&include_video=false&page=${CurrentPage + 1}`;
        const searchEndpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=${CurrentLanguage}&query=${searchTerm}&page=${CurrentPage + 1}`

        const endPoint = searchTerm ? searchEndpoint : popularEndpoint

        fetchMovies(endPoint)
    }

    const handleScroll = e => {
        const windowHeight =
            'innerHeight' in window
                ? window.innerHeight
                : document.documentElement.offsetHeight;

        const body = document.body;
        const html = document.documentElement;

        const docHeight = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
        );

        const windowBottom = windowHeight + window.pageYOffset;

        if (windowBottom >= docHeight - 1) {
            buttonRef.current && buttonRef.current.click();
        }
    };

    if (error) return <div>Woops! Something went very wrong...</div>
    // if (!Movies[0]) return <div style={{ width: '100%', margin: '0' }}>No results!</div>
    return (

        <div style={{ width: '100%', margin: '0' }}>
            {MainMovieImage &&
                <MainImage
                    image={`${IMAGE_BASE_URL}${IMAGE_SIZE}${MainMovieImage.backdrop_path}`}
                    title={MainMovieImage.title}
                    text={MainMovieImage.overview}
                />
            }
            <SearchBar callback={searchMovies} />

            <div style={{ width: '85%', margin: '1rem auto' }}>
                <Title level={2} >{searchTerm ? t('landing.searchRes') : t('landing.latest')}</Title>
                <hr />
                <Row gutter={[16, 16]}>
                    {Movies ? Movies && Movies.map((movie, index) => (
                        <React.Fragment key={index}>
                            {movie && movie.poster_path && movie.vote_average > 5 && movie.release_date && movie.vote_count > 200 
                                && movie.imdb_id !== null && movie.backdrop_path !== null && movie.overview !== "" && (
                                <GridCard movie
                                    image={movie.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}` : t('landing.notAvail')}
                                    movieId={movie.id}
                                    movieName={movie.title}
                                    date={movie.release_date}
                                    vote={movie.vote_average ? movie.vote_average : 'N/A'}
                                    movieGenre={movie.genre_ids &&
                                        movie.genre_ids.length &&
                                        movie.genre_ids.map(genreID => (
                                            <span key={genreID}>
                                                {genres.map(
                                                    genre =>
                                                        genreID === genre.id && (
                                                            <Button
                                                                key={genre.name}
                                                                shape="round"
                                                                size="small"          
                                                                style= {{borderColor: "#19ba90", textAlign: "center", fontSize: "0.9em", margin: "1px"}} 
                                                            >{genre.name}
                                                            </Button>
                                                        )
                                                )}
                                            </span>
                                        )).slice(0, 3)}
                                />)
                            }
                        </React.Fragment>
                    )) : <div style={{ width: '100%', margin: '0' }}>No results!</div>}
                </Row>

                {loading && <Spinner />}
                {CurrentPage < totalPages && !loading && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div ref={buttonRef} className="loadMore" onClick={loadMoreMovies}>{t('landing.loadmore')}</div>
                    </div>
                )}



            </div>
        </div>
    )
}

export default LandingPage