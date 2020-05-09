import { useState, useEffect } from 'react'
import { API_URL, API_KEY } from '../../../Config'

//custom hook
export const FetchHome = () => {
  const [state, setState] = useState({ Movies: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  // console.log(state)

  const fetchMovies = async endpoint => {
    setError(false)
    setLoading(true)

    const isLoadMore = endpoint.search('page')
    try {
      const result = await (await fetch(endpoint)).json()
      console.log(result)

      setState(prev => ({
        ...prev,
        Movies:
          isLoadMore !== -1
            ? [...prev.Movies, ...result.results]
            : [...result.results],
        MainMovieImage : prev.MainMovieImage || result.results[0],
        CurrentPage: result.page,
        totalPages: result.total_pages,
      }))
    } catch (error) {
      setError(true)
      // console.log(error)
    }
    setLoading(false)

  }

  useEffect(() => {
    const CurrentLanguage = localStorage.getItem('language')
    fetchMovies(`${API_URL}discover/movie?api_key=${API_KEY}&language=${CurrentLanguage}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`)
  }, [])

  return [{ state, loading, error }, fetchMovies ]
}