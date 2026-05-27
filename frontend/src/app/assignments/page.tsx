'use client';

import { useEffect, useState } from 'react';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { Search, Filter, MoreVertical, Plus } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { socket } from '@/lib/socket';

export default function AssignmentsDashboard() {
  const { assignments, fetchAssignments, loading, updateAssignmentStatus, deleteAssignment } = useAssignmentStore();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchAssignments();

    if (!socket.connected) {
      socket.connect();
    }

    socket.on('assignment_list_update', () => {
      fetchAssignments();
    });

    return () => {
      socket.off('assignment_list_update');
    };
  }, [fetchAssignments]);

  // Subscribe to specific assignment status updates
  useEffect(() => {
    assignments.forEach(assignment => {
      if (assignment.status === 'processing') {
        socket.on(`assignment_update_${assignment._id}`, (data) => {
          updateAssignmentStatus(assignment._id, data.status);
          if (data.status === 'completed' || data.status === 'failed') {
            fetchAssignments();
          }
        });
      }
    });

    return () => {
      assignments.forEach(assignment => {
        socket.off(`assignment_update_${assignment._id}`);
      });
    };
  }, [assignments, updateAssignmentStatus, fetchAssignments]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#34C759] rounded-full shadow-[0_0_8px_rgba(52,199,89,0.5)]"></div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Assignments</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-4.5">Manage and create assignments for your classes.</p>
        </div>
      </div>

      {assignments.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-[32px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] px-6 py-3 flex items-center justify-between gap-4 mb-6">
          {/* Filter Section */}
          <div className="flex items-center gap-2 text-gray-500 hover:text-gray-700 cursor-pointer font-bold text-sm">
            <Filter size={16} className="text-gray-400" />
            <span>Filter By</span>
          </div>

          {/* Search Input Section */}
          <div className="w-80 bg-[#F6F6F8]/60 border border-gray-100 rounded-full flex items-center px-4 py-1.5 shadow-sm transition-all focus-within:border-gray-200">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search Assignment"
              className="outline-none bg-transparent flex-1 text-sm text-gray-700 placeholder-gray-400 font-semibold"
            />
          </div>
        </div>
      )}

      {loading && assignments.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#F95016] border-t-transparent rounded-full"></div>
        </div>
      ) : assignments.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="relative w-48 h-48 mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            {/* Simple vector representation for empty state */}
            <div className="absolute w-24 h-32 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
              <div className="w-16 h-2 bg-gray-200 rounded mt-4 mx-auto"></div>
              <div className="w-12 h-2 bg-gray-200 rounded mt-2 mx-auto"></div>
              <div className="w-16 h-2 bg-gray-200 rounded mt-4 mx-auto"></div>
            </div>
            <div className="absolute right-8 bottom-8 w-16 h-16 bg-red-100 rounded-full border-4 border-white flex items-center justify-center">
              <span className="text-red-500 font-bold text-3xl">×</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No assignments yet</h2>
          <p className="text-gray-500 text-sm mb-8">
            Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
          </p>
          <Link href="/assignments/new">
            <button className="bg-gradient-to-b from-[#2D2D2F] to-[#171718] text-white px-6 py-3 rounded-full font-bold hover:opacity-95 shadow-xl flex items-center gap-2 border border-[#FF5E3A]/20 transition-all hover:scale-105">
              <Plus size={18} strokeWidth={2.5} />
              Create Your First Assignment
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">
          {assignments.map(assignment => (
            <div key={assignment._id} className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all flex flex-col justify-between h-[180px] relative hover:scale-[1.02]">
              <div className="flex justify-between items-start">
                <h3 className="font-extrabold text-lg text-gray-900 truncate pr-6 tracking-tight">{assignment.title || 'Untitled Assignment'}</h3>
                <div className="relative dropdown-container">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdownId(openDropdownId === assignment._id ? null : assignment._id);
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded-full transition-colors"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {openDropdownId === assignment._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.08)] z-50 border border-gray-100 p-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="flex flex-col gap-1">
                        <Link href={`/assignments/output/${assignment._id}`} className="block w-full text-left px-3 py-2 text-[13px] font-medium text-gray-800 hover:bg-gray-50 rounded-xl transition-colors">
                          View Assignment
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this assignment?')) {
                              deleteAssignment(assignment._id);
                            }
                            setOpenDropdownId(null);
                          }}
                          className="block w-full text-left px-3 py-2 text-[13px] font-medium text-[#D92D20] bg-gray-50 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center text-sm font-bold text-gray-800">
                <div>
                  <span className="text-gray-400 font-medium">Assigned on : </span>
                  {format(new Date(assignment.createdAt), 'dd-MM-yyyy')}
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Due : </span>
                  {format(new Date(assignment.dueDate), 'dd-MM-yyyy')}
                </div>
              </div>

              {assignment.status === 'processing' && (
                <div className="absolute bottom-6 left-6 flex items-center gap-2 text-orange-500 text-xs font-semibold bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                  <div className="w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  Generating AI Paper...
                </div>
              )}
              {assignment.status === 'failed' && (
                <div className="absolute bottom-6 left-6 flex items-center gap-1.5 text-red-500 text-xs font-semibold bg-red-50 px-3 py-1 rounded-full border border-red-100">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Generation Failed
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {assignments.length > 0 && (
        <>
          {/* Desktop Create Button */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 ml-32 hidden md:block z-30">
            <Link href="/assignments/new">
              <button className="bg-gradient-to-b from-[#2D2D2F] to-[#171718] text-white px-6 py-3.5 rounded-full font-bold hover:opacity-95 shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-center gap-2 border border-[#FF5E3A]/20 transition-all hover:scale-105">
                <Plus size={18} strokeWidth={2.5} />
                Create Assignment
              </button>
            </Link>
          </div>

          {/* Mobile FAB */}
          <div className="fixed bottom-24 right-6 md:hidden z-40">
            <Link href="/assignments/new">
              <button className="bg-white text-[#F95016] w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100">
                <Plus size={28} strokeWidth={2.5} />
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
