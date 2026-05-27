"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePaper = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
const Assignment_1 = __importDefault(require("../models/Assignment"));
const socket_1 = require("../socket");
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
const generatePaper = async (assignmentId) => {
    try {
        const assignment = await Assignment_1.default.findById(assignmentId);
        if (!assignment)
            throw new Error('Assignment not found');
        await Assignment_1.default.findByIdAndUpdate(assignmentId, { status: 'processing' });
        (0, socket_1.getIO)().emit(`assignment_update_${assignmentId}`, { status: 'processing' });
        // Construct the prompt
        let prompt = `You are an expert AI teacher's assistant. Generate a question paper based on the following criteria. Return ONLY valid JSON and no markdown formatting, backticks, or extra text.\n\n`;
        if (assignment.subject)
            prompt += `Subject: ${assignment.subject}\n`;
        if (assignment.grade)
            prompt += `Class/Grade: ${assignment.grade}\n`;
        if (assignment.schoolName)
            prompt += `School Name: ${assignment.schoolName}\n`;
        prompt += `Total Questions: ${assignment.totalQuestions}\n`;
        prompt += `Total Marks: ${assignment.totalMarks}\n`;
        prompt += `Additional Information: ${assignment.additionalInfo}\n\n`;
        prompt += `Question Types breakdown:\n`;
        assignment.questionTypes.forEach(qt => {
            prompt += `- ${qt.numberOfQuestions} questions of type '${qt.type}' worth ${qt.marksPerQuestion} marks each.\n`;
        });
        prompt += `\nStructure the JSON strictly as follows:
{
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions. Each question carries...",
      "questions": [
        {
          "questionText": "What is the capital of France?",
          "difficulty": "Easy" | "Moderate" | "Hard",
          "marks": 2
        }
      ]
    }
  ]
}
Make sure the total questions and marks match the criteria. Ensure the questions are diverse and relevant if a topic was provided in the additional info.`;
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Using gpt-4o-mini for speed and cost efficiency, but can be updated
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });
        const responseContent = completion.choices[0]?.message?.content;
        if (!responseContent)
            throw new Error('No content returned from OpenAI');
        const generatedPaper = JSON.parse(responseContent);
        // Save to DB
        await Assignment_1.default.findByIdAndUpdate(assignmentId, {
            status: 'completed',
            generatedPaper
        });
        // Notify Frontend
        (0, socket_1.getIO)().emit(`assignment_update_${assignmentId}`, { status: 'completed' });
        (0, socket_1.getIO)().emit('assignment_list_update');
    }
    catch (error) {
        console.error(`Error processing assignment ${assignmentId}:`, error);
        await Assignment_1.default.findByIdAndUpdate(assignmentId, { status: 'failed' });
        (0, socket_1.getIO)().emit(`assignment_update_${assignmentId}`, { status: 'failed' });
        (0, socket_1.getIO)().emit('assignment_list_update');
    }
};
exports.generatePaper = generatePaper;
//# sourceMappingURL=aiService.js.map