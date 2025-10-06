import { NextRequest, NextResponse } from 'next/server'

export async function POST(request) {
  try {
    // Parse request body
    const { prompt, gradeLevel, subject } = await request.json()

    // Validate required fields
    if (!prompt || !gradeLevel || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt, gradeLevel, and subject are required' },
        { status: 400 }
      )
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not configured')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    // Create the lesson generation prompt
    const systemPrompt = `You are an expert K-12 educator. Create a comprehensive, engaging lesson plan that is age-appropriate for ${gradeLevel} students in the subject of ${subject}.

The lesson plan should include:
1. A clear title and duration
2. 3-4 specific learning objectives
3. List of required materials
4. Introduction/Hook (2-3 sentences)
5. Main content with 3-4 sections, each with a heading and detailed content
6. Interactive activities with names, descriptions, and durations
7. Assessment questions with correct answers
8. Lesson closure summary
9. Extension activities
10. Differentiation strategies

Format your response as valid JSON with the following structure:
{
  "title": "string",
  "duration": "string (e.g., '45 minutes')",
  "objectives": ["objective1", "objective2", ...],
  "materials": ["material1", "material2", ...],
  "introduction": "string",
  "mainContent": {
    "sections": [
      {
        "heading": "string",
        "content": "string"
      }
    ]
  },
  "activities": [
    {
      "name": "string",
      "description": "string",
      "duration": "string (e.g., '10 mins')"
    }
  ],
  "assessment": [
    {
      "question": "string",
      "type": "string (e.g., 'Multiple Choice', 'Open Ended')",
      "correctAnswer": "string"
    }
  ],
  "closure": "string",
  "extensions": ["activity1", "activity2", ...],
  "differentiation": ["strategy1", "strategy2", ...]
}

Make it engaging, age-appropriate, and aligned with educational standards.`

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Create a lesson plan for: ${prompt}`
          }
        ]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Claude API Error:', response.status, errorText)
      return NextResponse.json(
        { error: 'Failed to generate lesson plan' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Extract the content from Claude's response
    const lessonContent = data.content[0].text
    
    // Try to parse as JSON
    let parsedLesson
    try {
      // Remove any markdown formatting if present
      const cleanContent = lessonContent.replace(/```json\n?|```\n?/g, '').trim()
      parsedLesson = JSON.parse(cleanContent)
    } catch (parseError) {
      console.error('Failed to parse lesson content as JSON:', parseError)
      console.error('Raw content:', lessonContent)
      return NextResponse.json(
        { error: 'Failed to parse generated lesson plan' },
        { status: 500 }
      )
    }

    // Return the generated lesson
    return NextResponse.json({
      success: true,
      lesson: parsedLesson
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
