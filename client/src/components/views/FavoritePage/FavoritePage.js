import React, { useEffect, useState } from 'react'
import { Typography, Popover, Button } from 'antd';
import axios from 'axios';
import './favorite.css';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { IMAGE_BASE_URL, POSTER_SIZE } from '../../Config'

const { Title } = Typography;

function FavoritePage() {
    const { t } = useTranslation();
    const user = useSelector(state => state.user)

    const [Favorites, setFavorites] = useState([])
    const [Loading, setLoading] = useState(true)
    let variable = { userFrom: localStorage.getItem('userId') }

    const calcTime = (time) => {
        const hours = Math.floor(time / 60);
        let mins = time % 60;
        if (mins < 10) { mins = "0" + mins; }
        return `${hours}h ${mins}min`;
      }

    useEffect(() => {
        fetchFavoredMovie()
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

    const fetchFavoredMovie = () => {
        axios.post('/api/favorite/getFavoredMovie', variable)
            .then(response => {
                if (response.data.success) {
                    // console.log(response.data.favorites)
                    setFavorites(response.data.favorites)
                    setLoading(false)
                } else {
                    alert('Failed to get subscription videos')
                }
            })
    }

    const onClickDelete = (movieId, userFrom) => {

        const variables = {
            movieId: movieId,
            userFrom: userFrom,
        }

        axios.post('/api/favorite/removeFromFavorite', variables)
            .then(response => {
                if (response.data.success) {
                    fetchFavoredMovie()
                } else {
                    alert('Failed to Remove From Favorite')
                }
            })
    }


    const renderCards = Favorites.map((favorite, index) => {


        const content = (
            <div>
                {favorite.moviePost ?
                    <img src={`${IMAGE_BASE_URL}${POSTER_SIZE}${favorite.moviePost}`} alt="" />
                    : "no image"}
            </div>
        );

        return <tr key={index}>

            <Popover content={content} title={`${favorite.movieTitle}`}>
                <td><strong><a href={`/movie/${favorite.movieId}`}>{favorite.movieTitle}</a></strong></td>
            </Popover>

            <td>{calcTime(favorite.movieRunTime)}</td>
            <td><Button type="primary" onClick={() => onClickDelete(favorite.movieId, favorite.userFrom)}>{t('favorites.removeButton')}</Button></td>
        </tr>
    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2}>{t('favorites.title')}</Title>
            <hr />
            {user.userData && !user.userData.isAuth ?
                <div style={{ width: '100%', fontSize: '2rem', height: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <p>{t('favorites.login')}</p>
                    <a href="/login">{t('favorites.accessLogin')}</a>
                </div>
                :
                !Loading &&
                <table>
                    <thead>
                        <tr>
                            <th>{t('favorites.movieTitle')}</th>
                            <th>{t('favorites.movieRuntime')}</th>
                            <td>{t('favorites.remove')}</td>
                        </tr>
                    </thead>
                    <tbody>
                        {renderCards}
                    </tbody>
                </table>
            }
        </div>
    )
}

export default FavoritePage
