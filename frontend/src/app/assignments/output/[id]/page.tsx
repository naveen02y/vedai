'use client';

import { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { Download } from 'lucide-react';
import { format } from 'date-fns';

export default function AssignmentOutput() {
  const { id } = useParams();
  const { currentAssignment, fetchAssignmentById, loading } = useAssignmentStore();
  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetchAssignmentById(id as string);
    }
  }, [id, fetchAssignmentById]);

  const handleDownloadPDF = async () => {
    if (!paperRef.current) return;
    
    // We can use html2pdf.js dynamically
    const html2pdf = (await import('html2pdf.js')).default;
    const opt = {
      margin: 10,
      filename: `${currentAssignment?.title || 'Assignment'}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };
    
    html2pdf().set(opt).from(paperRef.current).save();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-[50vh]">
         <div className="animate-spin w-8 h-8 border-4 border-[#F95016] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!currentAssignment || currentAssignment.status !== 'completed' || !currentAssignment.generatedPaper) {
    return (
      <div className="text-center py-20 text-gray-500">
        Assignment not found or paper generation not completed yet.
      </div>
    );
  }

  const { generatedPaper } = currentAssignment;

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="bg-[#1C1C1D] text-white p-6 rounded-t-3xl flex justify-between items-center shadow-lg">
        <div className="max-w-2xl">
          <p className="text-sm text-gray-300">
            {currentAssignment.subject && currentAssignment.grade 
              ? `Here is the customized Question Paper for your ${currentAssignment.grade} ${currentAssignment.subject} class.`
              : 'Here is the customized Question Paper for your class based on your requirements.'}
          </p>
        </div>
        <button 
          onClick={handleDownloadPDF}
          className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors"
        >
          <Download size={16} />
          Download as PDF
        </button>
      </div>

      <div 
        ref={paperRef}
        className="bg-white p-12 shadow-md min-h-[1000px] border border-gray-100 rounded-b-3xl text-gray-900"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold mb-6">{currentAssignment.schoolName || 'School Name'}</h1>
          <h2 className="text-lg font-bold mb-1">Subject: {currentAssignment.subject || '__________'}</h2>
          <h3 className="text-lg font-bold mb-6">Class: {currentAssignment.grade || '__________'}</h3>
        </div>

        <div className="mb-8 font-bold text-base space-y-4">
          <div>Time Allowed: 45 minutes</div>
          <div>Maximum Marks: {currentAssignment.totalMarks}</div>
        </div>

        <div className="mb-8 font-bold text-base">
          All questions are compulsory unless stated otherwise.
        </div>

        <div className="space-y-2 mb-12 font-bold text-base">
          <div>Name: ________________________</div>
          <div>Roll Number: _________________</div>
          <div>Class: {currentAssignment.grade || '___'} Section: __________</div>
        </div>

        {generatedPaper.sections.map((section, sIndex) => (
          <div key={sIndex} className="mb-10">
            <h3 className="text-center text-lg font-bold mb-6">{section.title}</h3>
            <div className="mb-6">
              {/* If instruction has a period, assume the first sentence is the section type like 'Short Answer Questions' */}
              {section.instruction.includes('.') ? (
                <>
                  <h4 className="font-bold mb-1">{section.instruction.split('.')[0]}</h4>
                  <p className="italic">{section.instruction.split('.').slice(1).join('.').trim()}</p>
                </>
              ) : (
                <p className="italic">{section.instruction}</p>
              )}
            </div>
            
            <div className="space-y-6">
              {section.questions.map((q, qIndex) => (
                <div key={qIndex} className="flex gap-2 text-base">
                  <div className="shrink-0">{qIndex + 1}.</div>
                  <div className="flex-1">
                    <span className="mr-1">[{q.difficulty}]</span> 
                    {q.questionText} 
                    <span className="ml-2">[{q.marks} Marks]</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
