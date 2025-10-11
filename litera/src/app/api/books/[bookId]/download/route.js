import sql from '@/lib/neon';

export async function POST(request, { params }) {
  try {
    const bookId = params.bookId;
    
    // Increment download count
    await sql`
      UPDATE Books
      SET download_count = download_count + 1
      WHERE id = ${bookId}
    `;
    
    return Response.json({ 
      success: true,
      message: 'Download count updated' 
    });
  } catch (error) {
    console.error('Download book error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
