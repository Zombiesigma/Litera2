import { login } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    const result = await login(email, password);
    
    if (!result.success) {
      return Response.json(
        { error: result.error },
        { status: 401 }
      );
    }
    
    return Response.json(result.user);
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
       }
