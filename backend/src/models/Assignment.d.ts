import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IAssignment, {}, {}, {}, mongoose.Document<unknown, {}, IAssignment, {}, mongoose.DefaultSchemaOptions> & IAssignment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAssignment>;
export default _default;
//# sourceMappingURL=Assignment.d.ts.map