'use client';

import { useState, useEffect } from 'react';
import TodoList from '@/components/TodoList';
import AddTodoForm from '@/components/AddTodoForm';
import FilterBar from '@/components/FilterBar';

export default function Home() {
  const [userId] = useState(1); // For demo purposes, using user_id = 1
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ user_id: userId.toString() });

      if (filter === 'active') {
        params.append('is_completed', 'false');
      } else if (filter === 'completed') {
        params.append('is_completed', 'true');
      }

      const response = await fetch(`/api/todos?${params}`);
      const data = await response.json();
      setTodos(data.todos || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [filter]);

  const handleAddTodo = async (title: string, description: string, dueDate: string) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          title,
          description: description || undefined,
          due_date: dueDate || undefined,
        }),
      });

      if (response.ok) {
        await fetchTodos();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding todo:', error);
      return false;
    }
  };

  const handleToggleTodo = async (id: number, isCompleted: number) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_completed: isCompleted ? 0 : 1,
        }),
      });

      if (response.ok) {
        await fetchTodos();
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchTodos();
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const stats = {
    total: todos.length,
    active: todos.filter((t: any) => !t.is_completed).length,
    completed: todos.filter((t: any) => t.is_completed).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Todo List
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize your tasks efficiently
          </p>
        </header>

        <div className="mb-6 flex justify-center gap-6 text-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow">
            <span className="text-gray-600 dark:text-gray-400">Total: </span>
            <span className="font-semibold text-gray-900 dark:text-white">{stats.total}</span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow">
            <span className="text-gray-600 dark:text-gray-400">Active: </span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">{stats.active}</span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow">
            <span className="text-gray-600 dark:text-gray-400">Completed: </span>
            <span className="font-semibold text-green-600 dark:text-green-400">{stats.completed}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-6">
          <AddTodoForm onAdd={handleAddTodo} />
        </div>

        <FilterBar currentFilter={filter} onFilterChange={setFilter} />

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading todos...</p>
            </div>
          ) : (
            <TodoList
              todos={todos}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
            />
          )}
        </div>
      </div>
    </div>
  );
}
