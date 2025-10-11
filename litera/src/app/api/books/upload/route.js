import { getCurrentUser } from '@/lib/auth';
import sql from '@/lib/neon';

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'penulis') {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { title, genre, synopsis, coverUrl, content } = await request.json();
    
    if (!title || !content) {
      return Response.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    // Insert book
    const bookResult = await sql`
      INSERT INTO Books (title, genre, synopsis, cover_url, author_id)
      VALUES (${title}, ${genre}, ${synopsis}, ${coverUrl || null}, ${user.id})
      RETURNING id
    `;
    
    const bookId = bookResult[0].id;
    
    // Insert book content
    await sql`
      INSERT INTO BookContent (book_id, content, format)
      VALUES (${bookId}, ${content}, 'text')
    `;
    
    return Response.json({ 
      success: true, 
      bookId,
      message: 'Book uploaded successfully' 
    });
  } catch (error) {
    console.error('Book upload error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
