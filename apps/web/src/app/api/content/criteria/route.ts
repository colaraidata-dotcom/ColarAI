import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { VALUE_PROFILE_MAP } from '@guardian/shared/constants'

// GET /api/content/criteria?profile_id=xxx
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profileId = request.nextUrl.searchParams.get('profile_id')
  if (!profileId) return NextResponse.json({ error: 'profile_id required' }, { status: 400 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, type')
    .eq('id', profileId)
    .eq('account_id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const { data } = await supabase
    .from('content_criteria')
    .select('*')
    .eq('profile_id', profileId)
    .single()

  // Return existing or defaults based on profile type
  if (data) return NextResponse.json(data)

  const defaults = defaultCriteria(profile.type)
  return NextResponse.json({ profile_id: profileId, ...defaults })
}

// PUT /api/content/criteria
export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { profile_id, preset_id, ...fields } = body

  if (!profile_id) return NextResponse.json({ error: 'profile_id required' }, { status: 400 })

  // A value-profile preset expands into criteria fields. Explicit fields in the
  // body still win, so the user can fine-tune after picking a preset.
  if (preset_id) {
    const preset = VALUE_PROFILE_MAP[preset_id]
    if (!preset) return NextResponse.json({ error: 'Unknown preset_id' }, { status: 400 })
    Object.assign(fields, { ...preset.criteria, ...fields })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', profile_id)
    .eq('account_id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const { data, error } = await supabase
    .from('content_criteria')
    .upsert({ profile_id, ...fields, updated_at: new Date().toISOString() }, { onConflict: 'profile_id' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

function defaultCriteria(profileType: string) {
  switch (profileType) {
    case 'child':
      return {
        max_violence: 1, max_language: 1, max_sexual_content: 0,
        max_fear_factor: 2, max_substance_use: 0,
        allowed_genres: ['animation', 'family', 'comedy', 'kids'],
        blocked_themes: ['war', 'darkThemes', 'drugs', 'alcohol', 'romance'],
        allowed_platforms: ['netflix', 'disney', 'prime', 'apple'],
        min_fit_score: 80,
      }
    case 'teen':
      return {
        max_violence: 4, max_language: 3, max_sexual_content: 2,
        max_fear_factor: 5, max_substance_use: 2,
        allowed_genres: [],
        blocked_themes: ['drugs'],
        allowed_platforms: ['netflix', 'disney', 'prime', 'apple', 'hbo'],
        min_fit_score: 60,
      }
    default:
      return {
        max_violence: 10, max_language: 10, max_sexual_content: 10,
        max_fear_factor: 10, max_substance_use: 10,
        allowed_genres: [],
        blocked_themes: [],
        allowed_platforms: ['netflix', 'disney', 'prime', 'apple', 'hbo'],
        min_fit_score: 0,
      }
  }
}
