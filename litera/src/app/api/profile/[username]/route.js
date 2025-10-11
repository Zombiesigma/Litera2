import sql from '@/lib/neon';

export async function GET(request, { params }) {
  try {
    const username = params.username;
    
    const result = await sql`
      SELECT id, username, name, bio, profile_image_url, role, created_at
      FROM Users
      WHERE username = ${username}
    `;
    
    if (result.length === 0) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return Response.json(result[0]);
  } catch (error) {
    console.error('Get user profile error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
        }
