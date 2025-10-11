import { getCurrentUser } from '@/lib/auth';
import sql from '@/lib/neon';

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const result = await sql`
      SELECT * FROM Notifications
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
    `;
    
    return Response.json(result);
  } catch (error) {
    console.error('Get notifications error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { notificationId } = await request.json();
    
    if (!notificationId) {
      return Response.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }
    
    // Mark notification as read
    await sql`
      UPDATE Notifications
      SET is_read = TRUE
      WHERE id = ${notificationId} AND user_id = ${user.id}
    `;
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
                        }
