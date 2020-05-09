import React from 'react'
import { Descriptions } from 'antd';
import moment from 'moment';
import numeral from 'numeral';
import { useTranslation } from 'react-i18next';

function MovieInfo(props) {

  const { t } = useTranslation();

  const calcTime = (time) => {
    const hours = Math.floor(time / 60);
    let mins = time % 60;
    if (mins < 10) { mins = "0" + mins; }
    return `${hours}h ${mins}min`;
  }

  const { movie, directors } = props;

  return (
    <Descriptions title={t('movieInfo.title')} bordered>
      <Descriptions.Item label={t('movieInfo.movietitle')}>{movie.original_title}</Descriptions.Item>
      <Descriptions.Item label={t('movieInfo.release')}>{movie.release_date
                  ? moment(new Date(movie.release_date)).format('YYYY') : 'N/A'}</Descriptions.Item>
      <Descriptions.Item label={t('movieInfo.runtime')}>{movie.runtime ? calcTime(movie.runtime) : 'N/A'}</Descriptions.Item>
      <Descriptions.Item label={t('movieInfo.director')}>
        {directors.map((element) => {
          return element.name;
        }).join(", ")}</Descriptions.Item>
      <Descriptions.Item label={t('movieInfo.genre')}>
        {movie.genres.map(function (genre) {
          return genre.name;
        }).slice(0, 3).join(" / ")}
      </Descriptions.Item>
      <Descriptions.Item label={t('movieInfo.vote')}>{movie.vote_average ? movie.vote_average : 'N/A'} {movie.vote_average ? '/ 10' : ''}</Descriptions.Item>
      <Descriptions.Item label={t('movieInfo.budget')}>{movie.budget ? numeral(movie.budget).format('0,0[.]00 $') : 'N/A'}</Descriptions.Item>
      <Descriptions.Item label={t('movieInfo.revenue')}>{movie.revenue ? numeral(movie.revenue).format('0,0[.]00 $') : 'N/A'}</Descriptions.Item>
      <Descriptions.Item label={t('movieInfo.prod')}>{movie.production_companies.map(function (company) {
        return company.name;
      }).shift()}</Descriptions.Item>
    </Descriptions>
  )
}

export default MovieInfo
