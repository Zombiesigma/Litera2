import sql from '@/lib/neon';

export async function GET(request, { params }) {
  try {
    const bookId = params.bookId;
    
    const result = await sql`
      SELECT * FROM BookContent
      WHERE book_id = ${bookId}
      ORDER BY id
    `;
    
    return Response.json(result);
  } catch (error) {
    console.error('Get book content error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
