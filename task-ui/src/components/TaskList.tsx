import React, { useState } from 'react';
import { Search, Trash2, Loader2, Play } from 'lucide-react';
import { Modal, Button } from 'antd';
import toast from 'react-hot-toast';
import { Task } from '../types';
import { deleteTask, executeTask } from '../services/taskService';

interface TaskListProps {
  tasks: Task[];
  onTaskDeleted: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoading: boolean;
}

export default function TaskList({ tasks, onTaskDeleted, searchQuery, onSearchChange, isLoading }: TaskListProps) {
  const [executingTaskId, setExecutingTaskId] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      onTaskDeleted();
      toast.success('Task deleted successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete task';
      toast.error(message);
      console.error('Error deleting task:', message);
    }
  };

  const handleExecute = async (task: Task) => {
    setExecutingTaskId(task.id);
    try {
      const result = await executeTask(task.id);
      setOutput(result);
      setIsModalVisible(true);
      toast.success('Command executed successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to execute command';
      toast.error(message);
      console.error('Error executing task:', message);
    } finally {
      setExecutingTaskId(null);
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.command.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Command</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center text-gray-500">
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Loading tasks...
                  </div>
                </td>
              </tr>
            ) : filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.owner}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{task.command}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                    {/* <Button
                      type="primary"
                      icon={<Play size={20} />}
                      onClick={() => handleExecute(task)}
                      loading={executingTaskId === task.id}
                      className="flex items-center gap-1"
                    >
                      Run
                    </Button> */}
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-600 hover:text-red-900 focus:outline-none"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal
        title="Command Output"
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <pre className="bg-gray-100 p-4 rounded">{output || 'No output available'}</pre>
      </Modal>
    </div>
  );
}
