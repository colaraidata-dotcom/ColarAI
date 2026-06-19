import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateFitScore } from '@/lib/content/scorer'

// GET /api/content/catalog?profile_id=xxx&genre=animation&platform=netflix&page=1
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = request.nextUrl
  const profileId = searchParams.get('profile_id')
  const genre = searchParams.get('genre')
  const platform = searchParams.get('platform')
  const contentType = searchParams.get('type')
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = 24
  const offset = (page - 1) * limit

  // Fetch profile criteria if profile_id given
  let criteria = null
  if (profileId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', profileId)
      .eq('account_id', user.id)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const { data } = await supabase
      .from('content_criteria')
      .select('*')
      .eq('profile_id', profileId)
      .single()

    criteria = data
  }

  // Build catalog query
  let query = supabase
    .from('content_catalog')
    .select(`
      id, title, content_type, release_year, genres,
      poster_url, tmdb_rating, age_rating, platforms,
      content_scores (
        violence, language, sexual_content, fear_factor,
        substance_use, themes, recommended_min_age, guardian_safe_age
      )
    `)

  if (genre) query = query.contains('genres', [genre])
  if (platform) query = query.contains('platforms', [platform])
  if (contentType === 'movie' || contentType === 'series') {
    query = query.eq('content_type', contentType)
  }
  if (criteria?.allowed_platforms?.length) {
    query = query.overlaps('platforms', criteria.allowed_platforms)
  }

  const { data: catalog, error } = await query
    .order('tmdb_rating', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Apply profile fit scoring and filter
  const items = (catalog ?? [])
    .map(item => {
      const scores = Array.isArray(item.content_scores)
        ? item.content_scores[0]
        : item.content_scores

      const fitScore = criteria && scores
        ? calculateFitScore(scores as Parameters<typeof calculateFitScore>[0], criteria, item.genres)
        : 100

      return { ...item, content_scores: scores ?? null, fit_score: fitScore }
    })
    .filter(item => !criteria || item.fit_score >= (criteria.min_fit_score ?? 70))
    .sort((a, b) => b.fit_score - a.fit_score)

  return NextResponse.json({ items, page, has_more: items.length === limit })
}
