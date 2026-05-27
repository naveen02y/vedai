'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { ArrowLeft, ArrowRight, Plus, X, UploadCloud, Calendar, Mic } from 'lucide-react';
import { format } from 'date-fns';

const questionTypeOptions = [
  'Multiple Choice Questions',
  'Short Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'Long Answer Questions'
];

export default function CreateAssignment() {
  const router = useRouter();
  const { createAssignment, loading } = useAssignmentStore();

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dueDate, setDueDate] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [schoolName, setSchoolName] = useState<string>('');
  const [questionTypes, setQuestionTypes] = useState([
    { id: '1', type: 'Multiple Choice Questions', numberOfQuestions: 4, marksPerQuestion: 1 },
    { id: '2', type: 'Short Questions', numberOfQuestions: 3, marksPerQuestion: 2 },
    { id: '3', type: 'Diagram/Graph-Based Questions', numberOfQuestions: 5, marksPerQuestion: 5 },
    { id: '4', type: 'Numerical Problems', numberOfQuestions: 5, marksPerQuestion: 5 }
  ]);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const totalQuestions = questionTypes.reduce((sum, qt) => sum + qt.numberOfQuestions, 0);
  const totalMarks = questionTypes.reduce((sum, qt) => sum + (qt.numberOfQuestions * qt.marksPerQuestion), 0);

  const handleAddQuestionType = () => {
    setQuestionTypes([
      ...questionTypes,
      { id: Date.now().toString(), type: questionTypeOptions[0], numberOfQuestions: 1, marksPerQuestion: 1 }
    ]);
  };

  const handleRemoveQuestionType = (id: string) => {
    setQuestionTypes(questionTypes.filter(qt => qt.id !== id));
  };

  const updateQuestionType = (id: string, field: string, value: any) => {
    setQuestionTypes(questionTypes.map(qt => {
      if (qt.id === id) {
        return { ...qt, [field]: value };
      }
      return qt;
    }));
  };

  const handleSubmit = async () => {
    if (!dueDate) {
      alert("Please select a due date");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', `Assignment - ${format(new Date(dueDate), 'dd MMM yyyy')}`);
      formData.append('dueDate', dueDate);
      formData.append('subject', subject);
      formData.append('grade', grade);
      formData.append('schoolName', schoolName);
      formData.append('totalQuestions', totalQuestions.toString());
      formData.append('totalMarks', totalMarks.toString());
      formData.append('additionalInfo', additionalInfo);
      formData.append('questionTypes', JSON.stringify(questionTypes.map(({ type, numberOfQuestions, marksPerQuestion }) => ({
        type, numberOfQuestions, marksPerQuestion
      }))));
      
      if (file) {
        formData.append('file', file);
      }

      await createAssignment(formData);
      router.push('/assignments');
    } catch (error) {
      alert("Failed to create assignment");
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 md:pb-8">
      <div className="mb-8 hidden md:block">
        <h1 className="text-xl font-bold text-gray-900">Create Assignment</h1>
        <p className="text-sm text-gray-500">Set up a new assignment for your students</p>
      </div>

      <div className="flex gap-2 mb-8 hidden md:flex">
        <div className="flex-1 h-1 bg-[#1C1C1D] rounded-full"></div>
        <div className="flex-1 h-1 bg-gray-200 rounded-full"></div>
      </div>

      <div className="bg-white md:p-8 md:rounded-3xl md:shadow-[0_2px_24px_rgba(0,0,0,0.02)]">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Assignment Details</h2>
        <p className="text-sm text-gray-500 mb-6">Basic information about your assignment</p>

        {/* Upload Area */}
        <div 
          className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center mb-6 bg-[#FAFAFB] cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              setFile(e.dataTransfer.files[0]);
            }
          }}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/jpeg,image/png,application/pdf"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
              }
            }}
          />
          <UploadCloud size={24} className="text-gray-400 mb-3" />
          <p className="text-sm font-medium text-gray-900 mb-1">
            {file ? file.name : "Choose a file or drag & drop it here"}
          </p>
          <p className="text-xs text-gray-500 mb-4">JPEG, PNG, upto 10MB</p>
          <button 
            className="px-4 py-1.5 border border-gray-200 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          >
            Browse Files
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center mb-8">Upload images of your preferred document/image</p>

        {/* Due Date */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Subject</label>
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Science, Mathematics"
              className="w-full bg-[#F9F9FA] border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-300 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Class / Grade</label>
            <input 
              type="text" 
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="e.g. 8th, Grade 10"
              className="w-full bg-[#F9F9FA] border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-300 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">School Name</label>
            <input 
              type="text" 
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="e.g. Delhi Public School"
              className="w-full bg-[#F9F9FA] border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-300 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Due Date</label>
            <div className="relative">
              <input 
                type="date" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#F9F9FA] border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-300 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Question Types */}
        <div className="mb-6">
          <div className="hidden md:flex justify-between items-end mb-4">
            <label className="block text-sm font-bold text-gray-900">Question Type</label>
            <div className="flex gap-12 mr-2 text-xs font-medium text-gray-500">
              <span>No. of Questions</span>
              <span>Marks</span>
            </div>
          </div>
          <label className="block md:hidden text-sm font-bold text-gray-900 mb-4">Question Type</label>

          <div className="space-y-4 md:space-y-3">
            {questionTypes.map((qt) => (
              <div key={qt.id} className="flex flex-col md:flex-row items-start md:items-center gap-3 bg-white md:bg-transparent border md:border-none border-gray-100 p-4 md:p-0 rounded-xl shadow-sm md:shadow-none">
                <div className="flex justify-between w-full md:w-auto md:flex-1 items-center">
                  <select 
                    value={qt.type}
                    onChange={(e) => updateQuestionType(qt.id, 'type', e.target.value)}
                    className="w-full md:w-auto bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none appearance-none font-medium shadow-sm md:flex-1"
                  >
                    {questionTypeOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => handleRemoveQuestionType(qt.id)}
                    className="text-gray-400 hover:text-gray-600 md:hidden ml-2"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <button 
                  onClick={() => handleRemoveQuestionType(qt.id)}
                  className="hidden md:block text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>

                <div className="flex w-full md:w-auto justify-between md:justify-start gap-4 md:gap-3 mt-2 md:mt-0">
                  <div className="flex flex-col md:hidden">
                    <span className="text-xs text-gray-500 font-medium mb-1 text-center">No. of Questions</span>
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-2 py-1 w-24 justify-between">
                      <button 
                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 bg-white rounded-full shadow-sm"
                        onClick={() => updateQuestionType(qt.id, 'numberOfQuestions', Math.max(1, qt.numberOfQuestions - 1))}
                      >-</button>
                      <span className="text-sm font-medium w-4 text-center">{qt.numberOfQuestions}</span>
                      <button 
                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 bg-white rounded-full shadow-sm"
                        onClick={() => updateQuestionType(qt.id, 'numberOfQuestions', qt.numberOfQuestions + 1)}
                      >+</button>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-2 py-1 w-24 justify-between">
                    <button 
                      className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 bg-white rounded-full shadow-sm"
                      onClick={() => updateQuestionType(qt.id, 'numberOfQuestions', Math.max(1, qt.numberOfQuestions - 1))}
                    >-</button>
                    <span className="text-sm font-medium w-4 text-center">{qt.numberOfQuestions}</span>
                    <button 
                      className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 bg-white rounded-full shadow-sm"
                      onClick={() => updateQuestionType(qt.id, 'numberOfQuestions', qt.numberOfQuestions + 1)}
                    >+</button>
                  </div>

                  <div className="flex flex-col md:hidden">
                    <span className="text-xs text-gray-500 font-medium mb-1 text-center">Marks</span>
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-2 py-1 w-24 justify-between">
                      <button 
                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 bg-white rounded-full shadow-sm"
                        onClick={() => updateQuestionType(qt.id, 'marksPerQuestion', Math.max(1, qt.marksPerQuestion - 1))}
                      >-</button>
                      <span className="text-sm font-medium w-4 text-center">{qt.marksPerQuestion}</span>
                      <button 
                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 bg-white rounded-full shadow-sm"
                        onClick={() => updateQuestionType(qt.id, 'marksPerQuestion', qt.marksPerQuestion + 1)}
                      >+</button>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-2 py-1 w-24 justify-between">
                    <button 
                      className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 bg-white rounded-full shadow-sm"
                      onClick={() => updateQuestionType(qt.id, 'marksPerQuestion', Math.max(1, qt.marksPerQuestion - 1))}
                    >-</button>
                    <span className="text-sm font-medium w-4 text-center">{qt.marksPerQuestion}</span>
                    <button 
                      className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 bg-white rounded-full shadow-sm"
                      onClick={() => updateQuestionType(qt.id, 'marksPerQuestion', qt.marksPerQuestion + 1)}
                    >+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={handleAddQuestionType}
            className="flex items-center gap-2 mt-4 text-sm font-bold text-gray-900"
          >
            <div className="w-6 h-6 bg-[#1C1C1D] rounded-full flex items-center justify-center text-white">
              <Plus size={14} />
            </div>
            Add Question Type
          </button>
        </div>

        {/* Totals */}
        <div className="flex flex-col items-end text-sm font-medium text-gray-900 mb-8 border-t border-gray-100 pt-4">
          <div>Total Questions : {totalQuestions}</div>
          <div>Total Marks : {totalMarks}</div>
        </div>

        {/* Additional Info */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Additional Information (For better output)</label>
          <div className="relative">
            <textarea 
              rows={3}
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
              className="w-full bg-[#F9F9FA] border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-300 resize-none"
            ></textarea>
            <button className="absolute bottom-3 right-3 text-gray-400 hover:text-gray-600">
              <Mic size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 pb-8">
        <button 
          onClick={() => router.back()}
          className="bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-full font-medium hover:bg-gray-50 flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={16} />
          Previous
        </button>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#1C1C1D] text-white px-8 py-2.5 rounded-full font-medium hover:opacity-90 flex items-center gap-2 text-sm disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Next'}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
