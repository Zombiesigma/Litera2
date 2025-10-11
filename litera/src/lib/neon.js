import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default sql;

// Initialize database tables if they don't exist
export async function initializeDatabase() {
  try {
    // Create Users table
    await sql`
      CREATE TABLE IF NOT EXISTS Users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        bio TEXT,
        profile_image_url VARCHAR(255),
        role VARCHAR(50) NOT NULL DEFAULT 'pembaca',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create Books table
    await sql`
      CREATE TABLE IF NOT EXISTS Books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        genre VARCHAR(100) NOT NULL,
        synopsis TEXT,
        cover_url VARCHAR(255),
        file_url VARCHAR(255),
        author_id INTEGER REFERENCES Users(id),
        view_count INTEGER DEFAULT 0,
        download_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create BookContent table
    await sql`
      CREATE TABLE IF NOT EXISTS BookContent (
        id SERIAL PRIMARY KEY,
        book_id INTEGER REFERENCES Books(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        format VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create Comments table
    await sql`
      CREATE TABLE IF NOT EXISTS Comments (
        id SERIAL PRIMARY KEY,
        book_id INTEGER REFERENCES Books(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        parent_id INTEGER REFERENCES Comments(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create MessageThreads table
    await sql`
      CREATE TABLE IF NOT EXISTS MessageThreads (
        id SERIAL PRIMARY KEY,
        user1_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
        user2_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user1_id, user2_id)
      );
    `;

    // Create Messages table
    await sql`
      CREATE TABLE IF NOT EXISTS Messages (
        id SERIAL PRIMARY KEY,
        thread_id INTEGER REFERENCES MessageThreads(id) ON DELETE CASCADE,
        sender_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create Notifications table
    await sql`
      CREATE TABLE IF NOT EXISTS Notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        related_id INTEGER,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create Follows table
    await sql`
      CREATE TABLE IF NOT EXISTS Follows (
        id SERIAL PRIMARY KEY,
        follower_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
        following_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(follower_id, following_id)
      );
    `;

    // Create Favorites table
    await sql`
      CREATE TABLE IF NOT EXISTS Favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
        book_id INTEGER REFERENCES Books(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, book_id)
      );
    `;

    // Create AiMessages table
    await sql`
      CREATE TABLE IF NOT EXISTS AiMessages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Database initialized successfully");
    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    return false;
  }
      }
