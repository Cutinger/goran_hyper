import React from 'react'
import { Col, Card, Badge } from 'antd';
import { IMAGE_BASE_URL } from '../Config';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

function GridCards(props) {

    const { t } = useTranslation();
    let { actor, movie, key, image, movieId, movieName, characterName, date, vote, movieGenre } = props
    const POSTER_SIZE = "w154";

    if (actor !== undefined) {
        return (
            <Col key={key} lg={4} md={6} xs={24}>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Card
                        hoverable
                        style={{ width: '100%' }}
                        alt={movieName}
                        cover={<img alt={characterName} src={image ? `${IMAGE_BASE_URL}${POSTER_SIZE}${image}` : 'https://res.cloudinary.com/dkyqbngya/image/upload/v1586537514/twdjio2duy8ebxulqwti.png'} />}
                    >
                        <p style={{ textAlign: "center", fontWeight: "bold" }}>{characterName}</p>
                    </Card>
                </div>
            </Col>
        )
    } else {
        if (movie !== undefined) {
            return (
                <Col lg={4} md={6} xs={24}>
                    <div style={{ position: 'relative' }}>
                        <a href={`/movie/${movieId}`} >
                            {/* .ant-badge-count in result.css to change props */}
                            <Badge
                                style={{ backgroundColor: '#52c41a' }}
                                offset={[-15, 15]}
                                count={vote}>
                                <Card
                                    hoverable
                                    style={{ width: '100%', height: '100%' }}
                                    alt={movieName}
                                    cover={<img alt={movieName} src={image ? `${image}` : t('landing.notAvail')} />}
                                >
                                    <div style={{ textAlign: "center", fontWeight: "bold" }}>{movieName} ({date ? moment(new Date(date)).format('YYYY') : 'N/A'})</div>
                                    <br />
                                    <div style={{ textAlign: "center" }}>{movieGenre}</div>
                                    {/* <div style={{ textAlign: "center" }}>VU OU PAS</div> */}
                                </Card>
                            </Badge>
                        </a>
                    </div>
                </Col>
            )
        }
    }

}

export default GridCards
