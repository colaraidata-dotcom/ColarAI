const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE = 'https://image.tmdb.org/t/p/w500';

export interface TmdbMovie {
  id: number
  title: string
  original_title: string
  overview: string
  release_date: string
  genre_ids: number[]
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  adult: boolean
}

export interface TmdbSeries {
  id: number
  name: string
  original_name: string
  overview: string
  first_air_date: string
  genre_ids: number[]
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
}

export interface TmdbGenre {
  id: number
  name: string
}

const GENRE_MAP: Record<number, string> = {
  28: 'action', 12: 'adventure', 16: 'animation', 35: 'comedy',
  80: 'crime', 99: 'documentary', 18: 'drama', 10751: 'family',
  14: 'fantasy', 36: 'history', 27: 'horror', 10402: 'music',
  9648: 'mystery', 10749: 'romance', 878: 'science-fiction',
  10770: 'tv-movie', 53: 'thriller', 10752: 'war', 37: 'western',
  10759: 'action-adventure', 10762: 'kids', 10763: 'news',
  10764: 'reality', 10765: 'sci-fi-fantasy', 10766: 'soap',
  10767: 'talk', 10768: 'war-politics',
}

function headers() {
  return {
    Authorization: `Bearer ${process.env.TMDB_API_READ_TOKEN}`,
    'Content-Type': 'application/json',
  }
}

export async function fetchPopularMovies(page = 1): Promise<TmdbMovie[]> {
  const res = await fetch(
    `${TMDB_BASE}/movie/popular?language=en-US&page=${page}&region=TR`,
    { headers: headers(), next: { revalidate: 86400 } }
  )
  if (!res.ok) throw new Error(`TMDB movies error: ${res.status}`)
  const data = await res.json()
  return data.results as TmdbMovie[]
}

export async function fetchPopularSeries(page = 1): Promise<TmdbSeries[]> {
  const res = await fetch(
    `${TMDB_BASE}/tv/popular?language=en-US&page=${page}`,
    { headers: headers(), next: { revalidate: 86400 } }
  )
  if (!res.ok) throw new Error(`TMDB series error: ${res.status}`)
  const data = await res.json()
  return data.results as TmdbSeries[]
}

export async function fetchContentRating(tmdbId: number, type: 'movie' | 'series'): Promise<string | null> {
  const path = type === 'movie'
    ? `${TMDB_BASE}/movie/${tmdbId}/release_dates`
    : `${TMDB_BASE}/tv/${tmdbId}/content_ratings`

  const res = await fetch(path, { headers: headers() })
  if (!res.ok) return null
  const data = await res.json()

  if (type === 'movie') {
    const us = data.results?.find((r: { iso_3166_1: string }) => r.iso_3166_1 === 'US')
    return us?.release_dates?.[0]?.certification ?? null
  } else {
    const us = data.results?.find((r: { iso_3166_1: string }) => r.iso_3166_1 === 'US')
    return us?.rating ?? null
  }
}

export function mapGenreIds(ids: number[]): string[] {
  return ids.map(id => GENRE_MAP[id]).filter(Boolean)
}

export function posterUrl(path: string | null): string | null {
  return path ? `${TMDB_IMAGE}${path}` : null
}

export function releaseYear(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null
  const y = parseInt(dateStr.slice(0, 4), 10)
  return isNaN(y) ? null : y
}
