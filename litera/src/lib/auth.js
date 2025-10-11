import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import sql from './neon';

export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user data from Neon database
    const result = await sql`
      SELECT * FROM Users WHERE email = ${email}
    `;
    
    if (result.length === 0) {
      throw new Error('User not found in database');
    }
    
    return {
      success: true,
      user: {
        id: result[0].id,
        username: result[0].username,
        email: result[0].email,
        name: result[0].name,
        bio: result[0].bio,
        profileImageUrl: result[0].profile_image_url,
        role: result[0].role,
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

export async function register(email, password, name, username, role, profileImageUrl = null) {
  try {
    // Create user in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Store user data in Neon database
    const result = await sql`
      INSERT INTO Users (email, password, name, username, role, profile_image_url)
      VALUES (${email}, ${password}, ${name}, ${username}, ${role}, ${profileImageUrl})
      RETURNING id
    `;
    
    return {
      success: true,
      user: {
        id: result[0].id,
        username,
        email,
        name,
        role,
        profileImageUrl,
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

export async function logout() {
  try {
    await signOut(auth);
    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

export async function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      unsubscribe();
      
      if (!user) {
        resolve(null);
        return;
      }
      
      try {
        const result = await sql`
          SELECT * FROM Users WHERE email = ${user.email}
        `;
        
        if (result.length === 0) {
          resolve(null);
          return;
        }
        
        resolve({
          id: result[0].id,
          username: result[0].username,
          email: result[0].email,
          name: result[0].name,
          bio: result[0].bio,
          profileImageUrl: result[0].profile_image_url,
          role: result[0].role,
        });
      } catch (error) {
        console.error("Error getting current user:", error);
        resolve(null);
      }
    });
  });
          }
