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
      SELECT mt.*, 
        u1.name as user1_name, u1.username as user1_username, u1.profile_image_url as user1_profile_image_url,
        u2.name as user2_name, u2.username as user2_username, u2.profile_image_url as user2_profile_image_url,
        (SELECT content FROM Messages WHERE thread_id = mt.id ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM Messages WHERE thread_id = mt.id ORDER BY created_at DESC LIMIT 1) as last_message_time
      FROM MessageThreads mt
      JOIN Users u1 ON mt.user1_id = u1.id
      JOIN Users u2 ON mt.user2_id = u2.id
      WHERE mt.user1_id = ${user.id} OR mt.user2_id = ${user.id}
      ORDER BY COALESCE(
        (SELECT created_at FROM Messages WHERE thread_id = mt.id ORDER BY created_at DESC LIMIT 1),
        mt.created_at
      ) DESC
    `;
    
    return Response.json(result);
  } catch (error) {
    console.error('Get message threads error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { userId } = await request.json();
    
    if (!userId) {
      return Response.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Check if thread already exists
    const existingThread = await sql`
      SELECT * FROM MessageThreads
      WHERE (user1_id = ${user.id} AND user2_id = ${userId}) 
         OR (user1_id = ${userId} AND user2_id = ${user.id})
    `;
    
    if (existingThread.length > 0) {
      return Response.json(existingThread[0]);
    }
    
    // Create new thread
    const result = await sql`
      INSERT INTO MessageThreads (user1_id, user2_id)
      VALUES (${user.id}, ${userId})
      RETURNING *
    `;
    
    return Response.json(result[0]);
  } catch (error) {
    console.error('Create message thread error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
