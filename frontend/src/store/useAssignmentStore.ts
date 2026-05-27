import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface IQuestion {
  _id?: string;
  questionText: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
}

export interface ISection {
  _id?: string;
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IAssignment {
  _id: string;
  title: string;
  dueDate: string;
  questionTypes: {
    type: string;
    numberOfQuestions: number;
    marksPerQuestion: number;
  }[];
  totalQuestions: number;
  totalMarks: number;
  subject?: string;
  grade?: string;
  schoolName?: string;
  additionalInfo: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  generatedPaper?: {
    sections: ISection[];
  };
  createdAt: string;
}

interface AssignmentState {
  assignments: IAssignment[];
  currentAssignment: IAssignment | null;
  loading: boolean;
  error: string | null;
  fetchAssignments: () => Promise<void>;
  fetchAssignmentById: (id: string) => Promise<void>;
  createAssignment: (data: FormData | Partial<IAssignment>) => Promise<IAssignment>;
  updateAssignmentStatus: (id: string, status: IAssignment['status']) => void;
  deleteAssignment: (id: string) => Promise<void>;
}

export const useAssignmentStore = create<AssignmentState>((set, get) => ({
  assignments: [],
  currentAssignment: null,
  loading: false,
  error: null,
  
  fetchAssignments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/assignments`);
      set({ assignments: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchAssignmentById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/assignments/${id}`);
      set({ currentAssignment: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createAssignment: async (data: FormData | Partial<IAssignment>) => {
    set({ loading: true, error: null });
    try {
      const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined;
      const response = await axios.post(`${API_URL}/assignments`, data, { headers });
      const newAssignment = response.data.assignment;
      set((state) => ({ 
        assignments: [newAssignment, ...state.assignments],
        loading: false 
      }));
      return newAssignment;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateAssignmentStatus: (id: string, status: IAssignment['status']) => {
    set((state) => ({
      assignments: state.assignments.map(a => 
        a._id === id ? { ...a, status } : a
      ),
      currentAssignment: state.currentAssignment?._id === id 
        ? { ...state.currentAssignment, status } 
        : state.currentAssignment
    }));
  },

  deleteAssignment: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/assignments/${id}`);
      set((state) => ({
        assignments: state.assignments.filter(a => a._id !== id)
      }));
    } catch (error: any) {
      console.error('Failed to delete assignment:', error);
    }
  }
}));
