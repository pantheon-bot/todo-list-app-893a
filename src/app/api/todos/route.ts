import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { NewTodo } from '@/lib/db/schema';

// GET /api/todos - List all todos for a user
// Query params: user_id (required), is_completed (optional)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');
    const isCompletedParam = searchParams.get('is_completed');

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    let query = db
      .selectFrom('todos')
      .selectAll()
      .where('user_id', '=', Number(userId))
      .orderBy('created_at', 'desc');

    // Filter by completion status if provided
    if (isCompletedParam !== null) {
      const isCompleted = isCompletedParam === 'true' ? 1 : 0;
      query = query.where('is_completed', '=', isCompleted);
    }

    const todos = await query.execute();

    return NextResponse.json({ todos });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

// POST /api/todos - Create a new todo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, title, description, due_date } = body;

    // Validation
    if (!user_id || !title) {
      return NextResponse.json(
        { error: 'user_id and title are required' },
        { status: 400 }
      );
    }

    if (title.length > 500) {
      return NextResponse.json(
        { error: 'title must be 500 characters or less' },
        { status: 400 }
      );
    }

    const newTodo: NewTodo = {
      user_id: Number(user_id),
      title,
      description: description || null,
      due_date: due_date ? new Date(due_date) : null,
    };

    const result = await db
      .insertInto('todos')
      .values(newTodo)
      .executeTakeFirstOrThrow();

    // Fetch the created todo
    const createdTodo = await db
      .selectFrom('todos')
      .selectAll()
      .where('id', '=', Number(result.insertId))
      .executeTakeFirst();

    return NextResponse.json(
      { todo: createdTodo },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}
