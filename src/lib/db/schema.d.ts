import { Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface UsersTable {
  id: Generated<number>;
  email: string;
  username: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface TodosTable {
  id: Generated<number>;
  user_id: number;
  title: string;
  description: string | null;
  is_completed: Generated<number>;
  due_date: Date | null;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface DB {
  users: UsersTable;
  todos: TodosTable;
}

export type User = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;

export type Todo = Selectable<TodosTable>;
export type NewTodo = Insertable<TodosTable>;
export type TodoUpdate = Updateable<TodosTable>;