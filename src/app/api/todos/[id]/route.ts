import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { TodoUpdate } from '@/lib/db/schema';

// GET /api/todos/[id] - Get a specific todo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const todo = await db
      .selectFrom('todos')
      .selectAll()
      .where('id', '=', Number(id))
      .executeTakeFirst();

    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ todo });
  } catch (error) {
    console.error('Error fetching todo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todo' },
      { status: 500 }
    );
  }
}

// PATCH /api/todos/[id] - Update a todo
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, is_completed, due_date } = body;

    // Check if todo exists
    const existingTodo = await db
      .selectFrom('todos')
      .selectAll()
      .where('id', '=', Number(id))
      .executeTakeFirst();

    if (!existingTodo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    // Build update object with only provided fields
    const updates: TodoUpdate = {};

    if (title !== undefined) {
      if (title.length > 500) {
        return NextResponse.json(
          { error: 'title must be 500 characters or less' },
          { status: 400 }
        );
      }
      updates.title = title;
    }

    if (description !== undefined) {
      updates.description = description || null;
    }

    if (is_completed !== undefined) {
      updates.is_completed = is_completed ? 1 : 0;
    }

    if (due_date !== undefined) {
      updates.due_date = due_date ? new Date(due_date) : null;
    }

    // Only update if there are changes
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    await db
      .updateTable('todos')
      .set(updates)
      .where('id', '=', Number(id))
      .execute();

    // Fetch updated todo
    const updatedTodo = await db
      .selectFrom('todos')
      .selectAll()
      .where('id', '=', Number(id))
      .executeTakeFirst();

    return NextResponse.json({ todo: updatedTodo });
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

// DELETE /api/todos/[id] - Delete a todo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if todo exists
    const existingTodo = await db
      .selectFrom('todos')
      .selectAll()
      .where('id', '=', Number(id))
      .executeTakeFirst();

    if (!existingTodo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    await db
      .deleteFrom('todos')
      .where('id', '=', Number(id))
      .execute();

    return NextResponse.json(
      { message: 'Todo deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}
