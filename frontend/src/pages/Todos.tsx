import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Todo } from "../types";

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newTodo, setNewTodo] = useState<Partial<Todo>>({
    title: "",
    description: "",
    due_date: "",
    completed: false,
  });

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await api.get<Todo[]>("/api/todos");
        setTodos(response.data);
      } catch (err) {
        setError("Failed to fetch todos.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleCreateTodo = async () => {
    try {
      const response = await api.post<Todo>("/api/todos", newTodo);
      setTodos((prev) => [...prev, response.data]);
      setNewTodo({ title: "", description: "", due_date: "", completed: false });
    } catch (err) {
      setError("Failed to create todo.");
    }
  };

  const handleUpdateTodo = async (id: string, updatedTodo: Partial<Todo>) => {
    try {
      const response = await api.put<Todo>(`/api/todos/${id}`, updatedTodo);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? response.data : todo))
      );
    } catch (err) {
      setError("Failed to update todo.");
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await api.delete(`/api/todos/${id}`);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      setError("Failed to delete todo.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todos</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Create New Todo</h2>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Title"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={newTodo.description}
            onChange={(e) =>
              setNewTodo({ ...newTodo, description: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <input
            type="datetime-local"
            value={newTodo.due_date || ""}
            onChange={(e) =>
              setNewTodo({ ...newTodo, due_date: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleCreateTodo}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Create Todo
          </button>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Todo List</h2>
        {todos.length === 0 ? (
          <div className="text-center text-gray-500">No todos found.</div>
        ) : (
          <ul className="space-y-4">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="p-4 border rounded flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-bold">{todo.title}</h3>
                  <p className="text-sm text-gray-500">{todo.description}</p>
                  <p className="text-sm text-gray-500">
                    Due: {todo.due_date || "No due date"}
                  </p>
                  <p
                    className={`text-sm ${
                      todo.completed ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {todo.completed ? "Completed" : "Incomplete"}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() =>
                      handleUpdateTodo(todo.id, {
                        completed: !todo.completed,
                      })
                    }
                    className="px-4 py-2 bg-yellow-500 text-white rounded"
                  >
                    Toggle Complete
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}