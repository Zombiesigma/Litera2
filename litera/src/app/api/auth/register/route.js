import { register } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password, name, username, role, profileImageUrl } = await request.json();
    
    if (!email || !password || !name || !username || !role) {
      return Response.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    const result = await register(email, password, name, username, role, profileImageUrl);
    
    if (!result.success) {
      return Response.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return Response.json(result.user);
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
        }
