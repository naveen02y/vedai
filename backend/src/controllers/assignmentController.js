"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAssignment = exports.getAssignmentById = exports.getAssignments = exports.createAssignment = void 0;
const Assignment_1 = __importDefault(require("../models/Assignment"));
const aiService_1 = require("../services/aiService");
const socket_1 = require("../socket");
const createAssignment = async (req, res) => {
    try {
        const { title, dueDate, additionalInfo, subject, grade, schoolName } = req.body;
        let questionTypes = req.body.questionTypes;
        if (typeof questionTypes === 'string') {
            try {
                questionTypes = JSON.parse(questionTypes);
            }
            catch (e) { }
        }
        const totalQuestions = Number(req.body.totalQuestions);
        const totalMarks = Number(req.body.totalMarks);
        const fileUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
        const newAssignment = new Assignment_1.default({
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
        (0, aiService_1.generatePaper)(savedAssignment._id.toString()).catch(console.error);
        (0, socket_1.getIO)().emit('assignment_list_update'); // Notify everyone that a new assignment was created
        res.status(201).json({ message: 'Assignment created and queued for generation', assignment: savedAssignment });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create assignment', error: error.message });
    }
};
exports.createAssignment = createAssignment;
const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment_1.default.find().sort({ createdAt: -1 }).select('-generatedPaper');
        res.status(200).json(assignments);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch assignments', error: error.message });
    }
};
exports.getAssignments = getAssignments;
const getAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment_1.default.findById(req.params.id);
        if (!assignment) {
            res.status(404).json({ message: 'Assignment not found' });
            return;
        }
        res.status(200).json(assignment);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch assignment', error: error.message });
    }
};
exports.getAssignmentById = getAssignmentById;
const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment_1.default.findByIdAndDelete(req.params.id);
        if (!assignment) {
            res.status(404).json({ message: 'Assignment not found' });
            return;
        }
        (0, socket_1.getIO)().emit('assignment_list_update');
        res.status(200).json({ message: 'Assignment deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete assignment', error: error.message });
    }
};
exports.deleteAssignment = deleteAssignment;
//# sourceMappingURL=assignmentController.js.map