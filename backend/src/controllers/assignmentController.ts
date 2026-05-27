import { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import { generatePaper } from '../services/aiService';
import { getIO } from '../socket';

export const createAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, dueDate, additionalInfo, subject, grade, schoolName } = req.body;

    let questionTypes = req.body.questionTypes;
    if (typeof questionTypes === 'string') {
      try { questionTypes = JSON.parse(questionTypes); } catch (e) { }
    }

    const totalQuestions = Number(req.body.totalQuestions);
    const totalMarks = Number(req.body.totalMarks);

    const fileUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const newAssignment = new Assignment({
      title,
      dueDate,
      questionTypes,
      totalQuestions,
      totalMarks,
      subject,
      grade,
      schoolName,
      additionalInfo,
      fileUrl,
      status: 'pending'
    });

    const savedAssignment = await newAssignment.save();

    // Start generating paper in background
    generatePaper(savedAssignment._id.toString()).catch(console.error);

    getIO().emit('assignment_list_update'); // Notify everyone that a new assignment was created

    res.status(201).json({ message: 'Assignment created and queued for generation', assignment: savedAssignment });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create assignment', error: error.message });
  }
};

export const getAssignments = async (req: Request, res: Response): Promise<void> => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 }).select('-generatedPaper');
    res.status(200).json(assignments);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch assignments', error: error.message });
  }
};

export const getAssignmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      res.status(404).json({ message: 'Assignment not found' });
      return;
    }
    res.status(200).json(assignment);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch assignment', error: error.message });
  }
};

export const deleteAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      res.status(404).json({ message: 'Assignment not found' });
      return;
    }
    getIO().emit('assignment_list_update');
    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete assignment', error: error.message });
  }
};
