import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { NewUser } from '@/lib/db/schema';

// GET /api/users - List all users
export async function GET() {
  try {
    const users = await db
      .selectFrom('users')
      .selectAll()
      .orderBy('created_at', 'desc')
      .execute();

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username } = body;

    // Validation
    if (!email || !username) {
      return NextResponse.json(
        { error: 'email and username are required' },
        { status: 400 }
      );
    }

    if (username.length > 100) {
      return NextResponse.json(
        { error: 'username must be 100 characters or less' },
        { status: 400 }
      );
    }

    if (email.length > 255) {
      return NextResponse.json(
        { error: 'email must be 255 characters or less' },
        { status: 400 }
      );
    }

    const newUser: NewUser = {
      email,
      username,
    };

    try {
      const result = await db
        .insertInto('users')
        .values(newUser)
        .executeTakeFirstOrThrow();

      // Fetch the created user
      const createdUser = await db
        .selectFrom('users')
        .selectAll()
        .where('id', '=', Number(result.insertId))
        .executeTakeFirst();

      return NextResponse.json(
        { user: createdUser },
        { status: 201 }
      );
    } catch (dbError: any) {
      // Handle duplicate key errors
      if (dbError.message?.includes('Duplicate entry')) {
        return NextResponse.json(
          { error: 'Email or username already exists' },
          { status: 409 }
        );
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
