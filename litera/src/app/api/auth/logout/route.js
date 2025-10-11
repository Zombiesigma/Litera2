import { logout } from '@/lib/auth';

export async function POST() {
  try {
    const result = await logout();
    
    if (!result.success) {
      return Response.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
       }
