import OpenAI from 'openai';
import dotenv from 'dotenv';
import Assignment from '../models/Assignment';
import { getIO } from '../socket';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generatePaper = async (assignmentId: string) => {
  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) throw new Error('Assignment not found');

    await Assignment.findByIdAndUpdate(assignmentId, { status: 'processing' });
    getIO().emit(`assignment_update_${assignmentId}`, { status: 'processing' });

    // Construct the prompt
    let prompt = `You are an expert AI teacher's assistant. Generate a question paper based on the following criteria. Return ONLY valid JSON and no markdown formatting, backticks, or extra text.\n\n`;
    if (assignment.subject) prompt += `Subject: ${assignment.subject}\n`;
    if (assignment.grade) prompt += `Class/Grade: ${assignment.grade}\n`;
    if (assignment.schoolName) prompt += `School Name: ${assignment.schoolName}\n`;
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
    if (!responseContent) throw new Error('No content returned from OpenAI');

    const generatedPaper = JSON.parse(responseContent);

    // Save to DB
    await Assignment.findByIdAndUpdate(assignmentId, {
      status: 'completed',
      generatedPaper
    });

    // Notify Frontend
    getIO().emit(`assignment_update_${assignmentId}`, { status: 'completed' });
    getIO().emit('assignment_list_update');

  } catch (error) {
    console.error(`Error processing assignment ${assignmentId}:`, error);
    await Assignment.findByIdAndUpdate(assignmentId, { status: 'failed' });
    getIO().emit(`assignment_update_${assignmentId}`, { status: 'failed' });
    getIO().emit('assignment_list_update');
  }
};
