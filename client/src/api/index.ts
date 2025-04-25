import axios, { AxiosResponse } from 'axios';
import { Client, Goal, CheckIn, DietPlan, WorkoutPlan, ProgressEntry } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Client API calls
export const getClients = async (): Promise<Client[]> => {
  const response: AxiosResponse<Client[]> = await api.get('/clients');
  return response.data;
};

export const getClient = async (id: string): Promise<Client> => {
  const response: AxiosResponse<Client> = await api.get(`/clients/${id}`);
  return response.data;
};

export const createClient = async (clientData: Partial<Client>): Promise<Client> => {
  try {
    // Ensure date fields are properly formatted for the server
    const formattedData = {
      ...clientData,
      // Remove client-side generated ID to let MongoDB create its own
      id: undefined,
      _id: undefined,
      // Convert Date objects to ISO strings for proper JSON serialization
      dateOfBirth: clientData.dateOfBirth ? new Date(clientData.dateOfBirth).toISOString() : undefined,
      joinDate: clientData.joinDate ? new Date(clientData.joinDate).toISOString() : new Date().toISOString(),
      nextCheckIn: clientData.nextCheckIn ? new Date(clientData.nextCheckIn).toISOString() : undefined
    };
    
    // Clean up undefined values which might cause validation issues
    Object.keys(formattedData).forEach(key => {
      if (formattedData[key] === undefined) {
        delete formattedData[key];
      }
    });
    
    const response: AxiosResponse<Client> = await api.post('/clients', formattedData);
    
    // Transform dates back to Date objects in the response
    const client = response.data;
    if (client.dateOfBirth) client.dateOfBirth = new Date(client.dateOfBirth);
    if (client.joinDate) client.joinDate = new Date(client.joinDate);
    if (client.nextCheckIn) client.nextCheckIn = new Date(client.nextCheckIn);
    
    return client;
  } catch (error) {
    console.error('Client creation error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateClient = async (id: string, clientData: Partial<Client>): Promise<Client> => {
  const response: AxiosResponse<Client> = await api.patch(`/clients/${id}`, clientData);
  return response.data;
};

export const deleteClient = async (id: string): Promise<void> => {
  await api.delete(`/clients/${id}`);
};

// Goals API calls
export const getGoals = async (): Promise<Goal[]> => {
  const response: AxiosResponse<Goal[]> = await api.get('/goals');
  return response.data;
};

export const getClientGoals = async (clientId: string): Promise<Goal[]> => {
  const response: AxiosResponse<Goal[]> = await api.get(`/goals/client/${clientId}`);
  return response.data;
};

export const createGoal = async (goalData: Partial<Goal>): Promise<Goal> => {
  const response: AxiosResponse<Goal> = await api.post('/goals', goalData);
  return response.data;
};

export const updateGoal = async (id: string, goalData: Partial<Goal>): Promise<Goal> => {
  const response: AxiosResponse<Goal> = await api.patch(`/goals/${id}`, goalData);
  return response.data;
};

export const deleteGoal = async (id: string): Promise<void> => {
  await api.delete(`/goals/${id}`);
};

// CheckIn API calls
export const getCheckIns = async (): Promise<CheckIn[]> => {
  const response: AxiosResponse<CheckIn[]> = await api.get('/check-ins');
  return response.data;
};

export const getClientCheckIns = async (clientId: string): Promise<CheckIn[]> => {
  const response: AxiosResponse<CheckIn[]> = await api.get(`/check-ins/client/${clientId}`);
  return response.data;
};

export const createCheckIn = async (checkInData: Partial<CheckIn>): Promise<CheckIn> => {
  const response: AxiosResponse<CheckIn> = await api.post('/check-ins', checkInData);
  return response.data;
};

export const updateCheckIn = async (id: string, checkInData: Partial<CheckIn>): Promise<CheckIn> => {
  const response: AxiosResponse<CheckIn> = await api.patch(`/check-ins/${id}`, checkInData);
  return response.data;
};

export const deleteCheckIn = async (id: string): Promise<void> => {
  await api.delete(`/check-ins/${id}`);
};

// Diet Plan API calls
export const getClientDietPlan = async (clientId: string): Promise<DietPlan> => {
  const response: AxiosResponse<DietPlan> = await api.get(`/diet-plans/client/${clientId}`);
  return response.data;
};

export const createDietPlan = async (dietPlanData: Partial<DietPlan>): Promise<DietPlan> => {
  const response: AxiosResponse<DietPlan> = await api.post('/diet-plans', dietPlanData);
  return response.data;
};

export const updateDietPlan = async (id: string, dietPlanData: Partial<DietPlan>): Promise<DietPlan> => {
  const response: AxiosResponse<DietPlan> = await api.patch(`/diet-plans/${id}`, dietPlanData);
  return response.data;
};

// Workout Plan API calls
export const getClientWorkoutPlan = async (clientId: string): Promise<WorkoutPlan> => {
  const response: AxiosResponse<WorkoutPlan> = await api.get(`/workout-plans/client/${clientId}`);
  return response.data;
};

export const createWorkoutPlan = async (workoutPlanData: Partial<WorkoutPlan>): Promise<WorkoutPlan> => {
  const response: AxiosResponse<WorkoutPlan> = await api.post('/workout-plans', workoutPlanData);
  return response.data;
};

export const updateWorkoutPlan = async (id: string, workoutPlanData: Partial<WorkoutPlan>): Promise<WorkoutPlan> => {
  const response: AxiosResponse<WorkoutPlan> = await api.patch(`/workout-plans/${id}`, workoutPlanData);
  return response.data;
};

// Progress Entry API calls
export const getClientProgressEntries = async (clientId: string): Promise<ProgressEntry[]> => {
  const response: AxiosResponse<ProgressEntry[]> = await api.get(`/progress-entries/client/${clientId}`);
  return response.data;
};

export const createProgressEntry = async (entryData: Partial<ProgressEntry>): Promise<ProgressEntry> => {
  const response: AxiosResponse<ProgressEntry> = await api.post('/progress-entries', entryData);
  return response.data;
};

export const updateProgressEntry = async (id: string, entryData: Partial<ProgressEntry>): Promise<ProgressEntry> => {
  const response: AxiosResponse<ProgressEntry> = await api.patch(`/progress-entries/${id}`, entryData);
  return response.data;
};

export const deleteProgressEntry = async (id: string): Promise<void> => {
  await api.delete(`/progress-entries/${id}`);
};

export default api;
