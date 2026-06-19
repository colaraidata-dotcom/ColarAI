import Anthropic from '@anthropic-ai/sdk'

export interface ContentScoreInput {
  title: string
  description: string
  genres: string[]
  ageRating: string | null
  releaseYear: number | null
}

export interface ContentScoreResult {
  violence: number
  language: number
  sexual_content: number
  fear_factor: number
  substance_use: number
  themes: {
    bullying: boolean
    darkThemes: boolean
    war: boolean
    romance: boolean
    drugs: boolean
    alcohol: boolean
  }
  recommended_min_age: number
  guardian_safe_age: number
  data_sources: string[]
}

const client = new Anthropic()

export async function scoreContent(input: ContentScoreInput): Promise<ContentScoreResult> {
  const prompt = `You are a family safety content analyst. Score this content for child-safety.

Title: ${input.title}
Year: ${input.releaseYear ?? 'unknown'}
Genres: ${input.genres.join(', ') || 'unknown'}
Age Rating: ${input.ageRating ?? 'not rated'}
Description: ${input.description || 'No description available'}

Return ONLY valid JSON with this exact structure:
{
  "violence": <0-10, 0=none, 10=extreme>,
  "language": <0-10, 0=none, 10=heavy profanity>,
  "sexual_content": <0-10, 0=none, 10=explicit>,
  "fear_factor": <0-10, 0=none, 10=extremely scary>,
  "substance_use": <0-10, 0=none, 10=heavy drug/alcohol>,
  "themes": {
    "bullying": <true/false>,
    "darkThemes": <true/false>,
    "war": <true/false>,
    "romance": <true/false>,
    "drugs": <true/false>,
    "alcohol": <true/false>
  },
  "recommended_min_age": <number, standard age recommendation>,
  "guardian_safe_age": <number, conservative age for safe viewing>
}

Base scores on official rating, genres, and description. Be conservative for child safety.`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in scorer response')

  const parsed = JSON.parse(jsonMatch[0])
  return { ...parsed, data_sources: ['ai_analysis', input.ageRating ? 'age_rating' : ''].filter(Boolean) }
}

export function calculateFitScore(
  score: ContentScoreResult,
  criteria: {
    max_violence: number
    max_language: number
    max_sexual_content: number
    max_fear_factor: number
    max_substance_use: number
    blocked_themes: string[]
    allowed_genres: string[]
  },
  genres: string[]
): number {
  // Any score exceeding max → 0 fit
  if (score.violence > criteria.max_violence) return 0
  if (score.language > criteria.max_language) return 0
  if (score.sexual_content > criteria.max_sexual_content) return 0
  if (score.fear_factor > criteria.max_fear_factor) return 0
  if (score.substance_use > criteria.max_substance_use) return 0

  // Blocked theme → 0 fit
  for (const theme of criteria.blocked_themes) {
    if (score.themes[theme as keyof typeof score.themes]) return 0
  }

  // Genre filter (empty = all allowed)
  if (criteria.allowed_genres.length > 0) {
    const hasAllowed = genres.some(g => criteria.allowed_genres.includes(g))
    if (!hasAllowed) return 0
  }

  // Calculate positive score (100 = perfect match)
  const maxSum = criteria.max_violence + criteria.max_language +
    criteria.max_sexual_content + criteria.max_fear_factor + criteria.max_substance_use
  const actualSum = score.violence + score.language +
    score.sexual_content + score.fear_factor + score.substance_use

  const safetyScore = maxSum > 0 ? Math.round((1 - actualSum / (maxSum * 2)) * 100) : 100

  return Math.max(0, Math.min(100, safetyScore))
}
