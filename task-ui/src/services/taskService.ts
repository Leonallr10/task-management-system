import axios from 'axios';
import { Task, TaskFormData } from '../types';

const API_URL = 'http://localhost:30080';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Increase timeout to 10 seconds
});

export const createTask = async (task: TaskFormData): Promise<Task> => {
  try {
    const response = await api.put('/tasks', task);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please try again.');
      }
      if (!error.response) {
        throw new Error('Cannot connect to the task service. Please ensure it is running.');
      }
      throw new Error(error.response.data?.message || 'Failed to create task');
    }
    throw error;
  }
};

export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get('/tasks');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please try again.');
      }
      if (!error.response) {
        throw new Error('Cannot connect to the task service. Please ensure it is running.');
      }
      throw new Error(error.response.data?.message || 'Failed to fetch tasks');
    }
    throw error;
  }
};

export const executeTask = async (id: string): Promise<string> => {
  try {
    // Calling the endpoint to execute the task command.
    const response = await api.post(`/tasks/${id}/execute`, {}, { timeout: 10000 });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please try again.');
      }
      if (!error.response) {
        throw new Error('Cannot connect to the task service. Please ensure it is running.');
      }
      throw new Error(error.response.data?.message || 'Failed to execute task');
    }
    throw error;
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    await api.delete(`/tasks/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please try again.');
      }
      if (!error.response) {
        throw new Error('Cannot connect to the task service. Please ensure it is running.');
      }
      throw new Error(error.response.data?.message || 'Failed to delete task');
    }
    throw error;
  }
};
