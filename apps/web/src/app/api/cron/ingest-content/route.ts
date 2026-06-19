import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { createServiceClient } from '@/lib/supabase/server'
import {
  fetchPopularMovies,
  fetchPopularSeries,
  fetchContentRating,
  mapGenreIds,
  posterUrl,
  releaseYear,
} from '@/lib/content/tmdb'
import { scoreContent } from '@/lib/content/scorer'

export const runtime = 'nodejs'
export const maxDuration = 300

// GET /api/cron/ingest-content — Vercel Cron, daily at 02:00 UTC
export async function GET(request: Request) {
  const auth = request.headers.get('authorization') ?? ''
  const expected = `Bearer ${process.env.CRON_SECRET ?? ''}`
  const a = Buffer.from(auth.padEnd(expected.length))
  const e = Buffer.from(expected.padEnd(auth.length))
  if (a.length !== e.length || !timingSafeEqual(a, e)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const results = { upserted: 0, scored: 0, errors: 0 }

  // Fetch popular movies (pages 1-3 = up to 60 items)
  for (let page = 1; page <= 3; page++) {
    const movies = await fetchPopularMovies(page)
    for (const movie of movies) {
      try {
        const id = `tmdb:movie:${movie.id}`
        const genres = mapGenreIds(movie.genre_ids)
        const ageRating = await fetchContentRating(movie.id, 'movie')

        await supabase.from('content_catalog').upsert({
          id,
          tmdb_id: movie.id,
          content_type: 'movie' as const,
          title: movie.title,
          original_title: movie.original_title,
          description: movie.overview,
          release_year: releaseYear(movie.release_date),
          genres,
          poster_url: posterUrl(movie.poster_path),
          backdrop_url: posterUrl(movie.backdrop_path),
          tmdb_rating: movie.vote_average,
          tmdb_vote_count: movie.vote_count,
          age_rating: ageRating,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' })

        results.upserted++

        // Score only if not already scored this week
        const { data: existing } = await supabase
          .from('content_scores')
          .select('scored_at')
          .eq('content_id', id)
          .single()

        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        if (!existing || existing.scored_at < oneWeekAgo) {
          const score = await scoreContent({
            title: movie.title,
            description: movie.overview,
            genres,
            ageRating,
            releaseYear: releaseYear(movie.release_date),
          })

          await supabase.from('content_scores').upsert({
            content_id: id,
            ...score,
            scored_at: new Date().toISOString(),
          }, { onConflict: 'content_id' })

          results.scored++
        }
      } catch {
        results.errors++
      }
    }
  }

  // Fetch popular series (pages 1-2)
  for (let page = 1; page <= 2; page++) {
    const series = await fetchPopularSeries(page)
    for (const show of series) {
      try {
        const id = `tmdb:series:${show.id}`
        const genres = mapGenreIds(show.genre_ids)
        const ageRating = await fetchContentRating(show.id, 'series')

        await supabase.from('content_catalog').upsert({
          id,
          tmdb_id: show.id,
          content_type: 'series' as const,
          title: show.name,
          original_title: show.original_name,
          description: show.overview,
          release_year: releaseYear(show.first_air_date),
          genres,
          poster_url: posterUrl(show.poster_path),
          backdrop_url: posterUrl(show.backdrop_path),
          tmdb_rating: show.vote_average,
          tmdb_vote_count: show.vote_count,
          age_rating: ageRating,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' })

        results.upserted++

        const { data: existing } = await supabase
          .from('content_scores')
          .select('scored_at')
          .eq('content_id', id)
          .single()

        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        if (!existing || existing.scored_at < oneWeekAgo) {
          const score = await scoreContent({
            title: show.name,
            description: show.overview,
            genres,
            ageRating,
            releaseYear: releaseYear(show.first_air_date),
          })

          await supabase.from('content_scores').upsert({
            content_id: id,
            ...score,
            scored_at: new Date().toISOString(),
          }, { onConflict: 'content_id' })

          results.scored++
        }
      } catch {
        results.errors++
      }
    }
  }

  return NextResponse.json({ ok: true, ...results })
}
