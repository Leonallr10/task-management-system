import React from 'react';
import { Toaster } from 'react-hot-toast';
import { ListTodo, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { getTasks } from './services/taskService';
import { Task } from './types';

function App() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchTasks = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      console.log('Fetched tasks:', data);
      setTasks(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred while fetching tasks';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);
  

  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <ListTodo size={32} className="text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={fetchTasks}
                  className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          )}
          <TaskForm onTaskCreated={fetchTasks} />
          <TaskList
            tasks={tasks}
            onTaskDeleted={fetchTasks}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isLoading={isLoading}
          />
        </div>
      </main>

      <footer className="bg-white shadow mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Task Manager &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;