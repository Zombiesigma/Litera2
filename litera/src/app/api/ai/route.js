import { getCurrentUser } from '@/lib/auth';
import { generateGeminiResponse } from '@/lib/gemini';
import sql from '@/lib/neon';

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { prompt, history } = await request.json();
    
    if (!prompt) {
      return Response.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }
    
    // Get AI response
    const response = await generateGeminiResponse(prompt, history);
    
    if (!response.success) {
      return Response.json(
        { error: response.error },
        { status: 500 }
      );
    }
    
    // Save user message
    await sql`
      INSERT INTO AiMessages (user_id, role, content)
      VALUES (${user.id}, 'user', ${prompt})
    `;
    
    // Save AI response
    await sql`
      INSERT INTO AiMessages (user_id, role, content)
      VALUES (${user.id}, 'assistant', ${response.content})
    `;
    
    return Response.json({
      success: true,
      content: response.content
    });
  } catch (error) {
    console.error('AI response error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
    }
