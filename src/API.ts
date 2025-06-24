import {
  SEARCH_BASE_URL,
  POPULAR_BASE_URL,
  API_URL,
  API_KEY,
  REQUEST_TOKEN_URL,
  LOGIN_URL,
  SESSION_ID_URL,
} from './config'

const defaultConfig = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
}

// Types
export type Movie = {
  backdrop_path: string
  id: number
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  title: string
  vote_average: number
  vote_count: number
  budget: number
  runtime: number
  revenue: number
  release_date: string
  adult: boolean
}

export type Movies = {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export type Cast = {
  id: number
  character: string
  credit_id: number
  name: string
  profile_path: string
}

export type Crew = {
  job: string
  name: string
  credit_id: number
}

export type Credits = {
  id: number
  cast: Cast[]
  crew: Crew[]
}

export type Person = {
  birthday: string
  known_for_department: string
  deathday: string
  id: number
  name: string
  gender: number
  biography: string
  place_of_birth: string
  profile_path: string
}

export type PersonCredits = {
  cast: Movie[]
}

export default {
  fetchMovies: async (searchTerm: string, page: number): Promise<Movies> => {
    const endpoint: string = searchTerm
      ? `${SEARCH_BASE_URL}${searchTerm}&page=${page}`
      : `${POPULAR_BASE_URL}&page=${page}`
    return await (await fetch(endpoint)).json()
  },
  fetchMovie: async (movieId: string | undefined): Promise<Movie> => {
    const endpoint: string = `${API_URL}movie/${movieId}?api_key=${API_KEY}`
    return await (await fetch(endpoint)).json()
  },
  fetchCredits: async (movieId: string | undefined): Promise<Credits> => {
    const creditsEndpoint: string = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`
    return await (await fetch(creditsEndpoint)).json()
  },
  searchMovie: async (searchTerm: string): Promise<Movies> => {
    const endpoint: string = `${API_URL}search/movie?api_key=${API_KEY}&query=${searchTerm}`
    return await (await fetch(endpoint)).json()
  },
  fetchPerson: async (personId: string | undefined): Promise<Person> => {
    const endpoint: string = `${API_URL}person/${personId}?api_key=${API_KEY}`
    return await (await fetch(endpoint)).json()
  },
  fetchPersonCredits: async (
    personId: string | undefined
  ): Promise<PersonCredits> => {
    const endpoint: string = `${API_URL}person/${personId}/movie_credits?api_key=${API_KEY}`
    return await (await fetch(endpoint)).json()
  },
  // Bonus material below for login
  getRequestToken: async () => {
    const reqToken = await (await fetch(REQUEST_TOKEN_URL)).json()
    return reqToken.request_token
  },
  authenticate: async (
    requestToken: string,
    username: string,
    password: string
  ) => {
    const bodyData = {
      username,
      password,
      request_token: requestToken,
    }
    // First authenticate the requestToken
    const data = await (
      await fetch(LOGIN_URL, {
        ...defaultConfig,
        body: JSON.stringify(bodyData),
      })
    ).json()
    // Then get the sessionId with the requestToken
    if (data.success) {
      const sessionId = await (
        await fetch(SESSION_ID_URL, {
          ...defaultConfig,
          body: JSON.stringify({ request_token: requestToken }),
        })
      ).json()
      return sessionId
    }
  },
  getAccountDetails: async (sessionId: number) => {
    const endpoint = `${API_URL}account?api_key=${API_KEY}&session_id=${sessionId}`
    const account = await (await fetch(endpoint)).json()
    return account
  },
  rateMovie: async (sessionId: number, movieId: number, value: number) => {
    const endpoint = `${API_URL}movie/${movieId}/rating?api_key=${API_KEY}&session_id=${sessionId}`

    const rating = await (
      await fetch(endpoint, {
        ...defaultConfig,
        body: JSON.stringify({ value }),
      })
    ).json()

    return rating
  },
  getMovieState: async (sessionId: number, movieId: number) => {
    const endpoint = `${API_URL}movie/${movieId}/account_states?api_key=${API_KEY}&session_id=${sessionId}`

    const data = await (await fetch(endpoint)).json()

    return data
  },
  favorite: async (
    sessionId: number,
    movieId: number,
    accountId: number,
    isFavorite: boolean
  ) => {
    const endpoint = `${API_URL}account/${accountId}/favorite?api_key=${API_KEY}&session_id=${sessionId}`
    const data = await (
      await fetch(endpoint, {
        ...defaultConfig,
        body: JSON.stringify({
          media_type: 'movie',
          media_id: movieId,
          favorite: !isFavorite,
        }),
      })
    ).json()
    return data
  },
  watchlist: async (
    sessionId: number,
    movieId: number,
    accountId: number,
    watchlist: boolean
  ) => {
    const endpoint = `${API_URL}account/${accountId}/watchlist?api_key=${API_KEY}&session_id=${sessionId}`
    const data = await (
      await fetch(endpoint, {
        ...defaultConfig,
        body: JSON.stringify({
          media_type: 'movie',
          media_id: movieId,
          watchlist: !watchlist,
        }),
      })
    ).json()
    return data
  },
  fetchFavoritehMovies: async (
    sessionId: number,
    accountId: number
  ): Promise<Movies> => {
    const endpoint = `${API_URL}account/${accountId}/favorite/movies?api_key=${API_KEY}&session_id=${sessionId}`
    return await (await fetch(endpoint)).json()
  },
}