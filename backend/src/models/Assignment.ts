import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  questionText: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IAssignment extends Document {
  title: string;
  dueDate: Date;
  fileUrl?: string;
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
  createdAt: Date;
}

const QuestionSchema = new Schema({
  questionText: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard'], required: true },
  marks: { type: Number, required: true }
});

const SectionSchema = new Schema({
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: [QuestionSchema]
});

const AssignmentSchema = new Schema({
  title: { type: String, default: 'Untitled Assignment' },
  dueDate: { type: Date, required: true },
  fileUrl: { type: String },
  questionTypes: [{
    type: { type: String, required: true },
    numberOfQuestions: { type: Number, required: true },
    marksPerQuestion: { type: Number, required: true }
  }],
  totalQuestions: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  subject: { type: String, default: '' },
  grade: { type: String, default: '' },
  schoolName: { type: String, default: '' },
  additionalInfo: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  generatedPaper: {
    sections: [SectionSchema]
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
