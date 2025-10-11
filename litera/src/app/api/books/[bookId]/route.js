import sql from '@/lib/neon';

export async function GET(request, { params }) {
  try {
    const bookId = params.bookId;
    
    const result = await sql`
      SELECT b.*, u.name as author_name, u.username as author_username
      FROM Books b
      JOIN Users u ON b.author_id = u.id
      WHERE b.id = ${bookId}
    `;
    
    if (result.length === 0) {
      return Response.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }
    
    // Increment view count
    await sql`
      UPDATE Books
      SET view_count = view_count + 1
      WHERE id = ${bookId}
    `;
    
    return Response.json(result[0]);
  } catch (error) {
    console.error('Get book error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
    }
