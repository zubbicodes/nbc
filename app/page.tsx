"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Clock, Calendar, CheckCircle2, Circle, 
  FileText, Plus, Bell, ChevronDown, 
  Check, X, Search, FileSignature, Loader2, Users, LayoutDashboard
} from "lucide-react";

type Role = "Worker" | "Manager" | "Client";

// --- START: SUB-COMPONENTS --- //

// 1. Worker View
function WorkerView({ onToast }: { onToast: (m: string) => void }) {
  const [clockedIn, setClockedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, title: "Unload delivery truck", status: "pending" },
    { id: 2, title: "Site safety briefing", status: "completed" },
    { id: 3, title: "Install temporary fencing", status: "pending" },
  ]);
  const [documents, setDocuments] = useState([
    { id: 1, title: "RAMS Document", status: "pending" },
    { id: 2, title: "Site Safety Plan", status: "signed" },
  ]);
  const [activeDoc, setActiveDoc] = useState<number | null>(null);

  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const int = setInterval(updateTime, 1000);
    return () => clearInterval(int);
  }, []);

  const handleClockToggle = () => {
    setLoading(true);
    setTimeout(() => {
      setClockedIn(!clockedIn);
      setLoading(false);
      onToast(clockedIn ? "Clocked out successfully" : "Clocked in successfully");
    }, 800);
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const newStatus = t.status === "pending" ? "completed" : "pending";
        if (newStatus === "completed") {
          onToast("Task completed");
        }
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  const handleSignDoc = (id: number) => {
    setDocuments(documents.map(d => d.id === id ? { ...d, status: "signed" } : d));
    setActiveDoc(null);
    onToast("Document signed successfully");
  };

  return (
    <div className="p-6 space-y-8">
      {/* Clock In Section */}
      <section className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
        <div className="text-3xl font-light text-gray-900 mb-1 tracking-tight">{time || "--:--"}</div>
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
          <MapPin size={14} /> Site A - London
        </div>
        
        <button
          onClick={handleClockToggle}
          disabled={loading}
          className={`relative w-48 h-48 rounded-full flex flex-col items-center justify-center text-white transition-all shadow-xl active:scale-95 overflow-hidden ${
            clockedIn ? 'bg-gray-900 shadow-gray-900/20' : 'bg-blue-600 shadow-blue-600/30'
          }`}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={32} />
          ) : (
            <>
              <motion.div
                initial={false}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-full border border-white/30"
              />
              <Clock size={32} className="mb-2" />
              <span className="text-xl font-medium tracking-wide">
                {clockedIn ? 'CLOCK OUT' : 'CLOCK IN'}
              </span>
            </>
          )}
        </button>
      </section>

      {/* Tasks Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Today's Tasks</h2>
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {tasks.filter(t => t.status === "completed").length}/{tasks.length}
          </span>
        </div>
        <div className="space-y-3">
          {tasks.map(task => (
            <motion.button
              layout
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="w-full bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100 hover:border-gray-200 active:scale-[0.98] transition-all text-left"
            >
              <span className={`text-base transition-colors ${task.status === "completed" ? "text-gray-400 line-through" : "text-gray-700 font-medium"}`}>
                {task.title}
              </span>
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${task.status === "completed" ? "bg-green-100 text-green-600" : "border-2 border-gray-300 text-transparent"}`}>
                {task.status === "completed" && <Check size={14} strokeWidth={3} />}
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Documents Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents to Sign</h2>
        <div className="space-y-3">
          {documents.map(doc => (
            <button
              key={doc.id}
              onClick={() => doc.status === "pending" && setActiveDoc(doc.id)}
              className="w-full bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-all text-left"
            >
              <div className={`p-3 rounded-xl ${doc.status === "signed" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}>
                <FileText size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{doc.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {doc.status === "signed" ? "Signed today" : "Awaiting signature"}
                </p>
              </div>
              {doc.status === "signed" ? (
                <CheckCircle2 size={20} className="text-green-500" />
              ) : (
                <div className="text-sm font-medium text-blue-600">Review</div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Document Modal */}
      <AnimatePresence>
        {activeDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full h-[85%] sm:h-auto sm:max-h-[80%] bg-white rounded-t-[2rem] sm:rounded-[2rem] p-6 flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 shrink-0 sm:hidden" />
              
              <div className="flex items-center justify-between mb-6 shrink-0">
                <h2 className="text-xl font-bold text-gray-900">Review Document</h2>
                <button 
                  onClick={() => setActiveDoc(null)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:text-gray-900"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto bg-gray-50 rounded-2xl p-4 mb-6 relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-5">
                  <FileText size={120} />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed relative z-10">
                  By signing this document, I acknowledge that I have read and understood the Risk Assessment and Method Statement (RAMS) for the current site operations. I agree to comply with all safety procedures and guidelines outlined herein.
                  <br/><br/>
                  Failure to comply may result in removal from the site. This digital signature is legally binding.
                </p>
              </div>

              <button
                onClick={() => handleSignDoc(activeDoc)}
                className="w-full bg-blue-600 text-white font-medium py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-600/20 shrink-0"
              >
                <FileSignature size={18} />
                Sign Document
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 2. Manager View
function ManagerView({ onToast }: { onToast: (m: string) => void }) {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Pour concrete foundation", assignee: "P. Mason", date: "Today" },
    { id: 2, title: "Delivery: Steel Beams", assignee: "Unassigned", date: "Tomorrow" },
  ]);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;
    setTasks([{ id: Date.now(), title: newTaskTitle, assignee: "Unassigned", date: "Today" }, ...tasks]);
    setNewTaskTitle("");
    setShowNewTask(false);
    onToast("Task created successfully");
  };

  return (
    <div className="p-6 space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-1">
          <div className="text-gray-500 mb-2 font-medium">Active Tasks</div>
          <div className="text-3xl font-bold text-gray-900">12</div>
          <div className="text-sm text-green-500 font-medium">+2 today</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-1">
          <div className="text-gray-500 mb-2 font-medium">Site Output</div>
          <div className="text-3xl font-bold text-gray-900">85%</div>
          <div className="text-sm text-blue-500 font-medium">On schedule</div>
        </div>
      </div>

      {/* Schedule */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Weekly Schedule</h2>
          <button className="text-sm text-blue-600 font-medium px-3 py-1 bg-blue-50 rounded-full">Full View</button>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 overflow-x-auto hide-scrollbar">
          <div className="flex gap-4 min-w-max pb-2">
            {[
              { day: 'Mon', num: 12, tasks: 4, active: false },
              { day: 'Tue', num: 13, tasks: 6, active: true },
              { day: 'Wed', num: 14, tasks: 2, active: false },
              { day: 'Thu', num: 15, tasks: 3, active: false },
              { day: 'Fri', num: 16, tasks: 1, active: false },
            ].map(d => (
              <div key={d.day} className={`flex flex-col items-center p-3 rounded-2xl min-w-[60px] ${d.active ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-transparent text-gray-600'}`}>
                <span className={`text-xs font-medium mb-1 ${d.active ? 'text-blue-100' : 'text-gray-400'}`}>{d.day}</span>
                <span className="text-xl font-bold mb-1">{d.num}</span>
                <span className={`text-[10px] w-1.5 h-1.5 rounded-full ${d.tasks > 3 ? (d.active ? 'bg-white' : 'bg-blue-500') : 'bg-transparent'}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Task Management */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Site Tasks</h2>
          <button 
            onClick={() => setShowNewTask(true)}
            className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Plus size={18} />
          </button>
        </div>

        <AnimatePresence>
          {showNewTask && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Task title..."
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  className="w-full bg-white p-3 rounded-xl border border-blue-200 outline-none focus:ring-2 focus:ring-blue-500 mb-3 text-sm"
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowNewTask(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-blue-100 rounded-xl transition-colors">Cancel</button>
                  <button onClick={handleCreateTask} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20">Add Task</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          <AnimatePresence>
            {tasks.map(task => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={task.id}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900 text-base">{task.title}</h3>
                  <button className="text-gray-400 hover:text-gray-900">
                    <CheckCircle2 size={18} />
                  </button>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                  <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                    <Users size={12} /> {task.assignee}
                  </div>
                  <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                    <Calendar size={12} /> {task.date}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

// 3. Client View
function ClientView({ onToast }: { onToast: (m: string) => void }) {
  const [options, setOptions] = useState([
    { id: 1, category: "Kitchen Flooring", title: "Premium Oak Hardwood", imageColor: "bg-amber-800", status: "pending", price: "Included" },
    { id: 2, category: "Living Room Paint", title: "Classic White Satin", imageColor: "bg-gray-100 border border-gray-200", status: "pending", price: "Included" },
    { id: 3, category: "Bathroom Fixtures", title: "Matte Black Finishes", imageColor: "bg-gray-900", status: "approved", price: "+$450.00" },
  ]);

  const handleAction = (id: number, action: "approved" | "rejected") => {
    setOptions(options.map(o => o.id === id ? { ...o, status: action } : o));
    onToast(`Option ${action} successfully`);
  };

  return (
    <div className="p-6 space-y-8">
      
      <div className="bg-gray-900 rounded-[2rem] p-6 text-white overflow-hidden relative shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[60px] opacity-40 -translate-y-1/2 translate-x-1/2" />
        <h2 className="text-2xl font-bold mb-2 relative z-10">Your Home Selections</h2>
        <p className="text-gray-400 text-sm relative z-10">Please review and approve the pending materials for your build.</p>
        
        <div className="mt-6 flex gap-4 relative z-10">
          <div>
            <div className="text-2xl font-bold">2</div>
            <div className="text-xs text-gray-400 font-medium">Pending</div>
          </div>
          <div className="w-px bg-gray-700" />
          <div>
            <div className="text-2xl font-bold text-green-400">1</div>
            <div className="text-xs text-gray-400 font-medium">Approved</div>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Pending Actions</h3>
        <div className="space-y-5">
          {options.map(item => (
            <motion.div 
              layout
              key={item.id} 
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            >
               <div className="flex p-4 gap-4">
                 <div className={`w-20 h-20 rounded-2xl shrink-0 shadow-inner ${item.imageColor}`} />
                 <div className="flex-1 pt-1">
                   <div className="text-xs font-semibold text-blue-600 mb-1">{item.category}</div>
                   <h4 className="font-bold text-gray-900 text-base leading-tight mb-2">{item.title}</h4>
                   <div className="text-sm font-medium text-gray-500">{item.price}</div>
                 </div>
               </div>

               {item.status === "pending" ? (
                 <div className="flex border-t border-gray-50">
                   <button 
                     onClick={() => handleAction(item.id, "rejected")}
                     className="flex-1 py-4 text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors active:bg-gray-100"
                   >
                     Reject
                   </button>
                   <div className="w-px bg-gray-50" />
                   <button 
                     onClick={() => handleAction(item.id, "approved")}
                     className="flex-1 py-4 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors active:bg-gray-100"
                   >
                     Approve
                   </button>
                 </div>
               ) : (
                 <div className="px-4 py-3 border-t border-gray-50 bg-gray-50/50">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      item.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.status === 'approved' ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                      {item.status}
                    </div>
                 </div>
               )}
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}

// --- MAIN COMPONENT --- //
export default function App() {
  const [role, setRole] = useState<Role>("Worker");
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: "", show: false });

  const triggerToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: "", show: false }), 3000);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex sm:items-center justify-center p-0 sm:p-6 font-sans">
      <div className="w-full h-screen sm:h-[844px] sm:max-w-[390px] bg-gray-50/50 sm:rounded-[3rem] sm:shadow-2xl overflow-hidden flex flex-col relative sm:border-[8px] sm:border-gray-900">
        
        {/* Header */}
        <header className="px-6 pt-12 pb-4 bg-white z-20 sticky top-0 border-b border-gray-100 shadow-sm shadow-gray-100/50">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                <LayoutDashboard size={14} className="text-white" />
              </div>
              NBC SiteFlow
            </h1>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors">
              <Bell size={20} />
            </button>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowRoleSelector(!showRoleSelector)}
              className="flex items-center justify-between w-full bg-white px-4 py-3.5 rounded-2xl border border-gray-200 font-semibold text-gray-800 active:scale-[0.98] transition-all shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                  {role[0]}
                </div>
                {role} View
              </div>
              <ChevronDown size={18} className={`text-gray-400 transition-transform ${showRoleSelector ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showRoleSelector && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowRoleSelector(false)}
                    className="fixed inset-0 z-30"
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-200 overflow-hidden z-40"
                  >
                    {(["Worker", "Manager", "Client"] as Role[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => { setRole(r); setShowRoleSelector(false); }}
                        className={`w-full text-left px-5 py-4 flex items-center gap-3 transition-colors ${role === r ? 'bg-blue-50/50 text-blue-700 font-semibold' : 'hover:bg-gray-50 text-gray-600 font-medium'}`}
                      >
                        <div className={`w-2 h-2 rounded-full ${role === r ? 'bg-blue-600' : 'bg-transparent'}`} />
                        {r}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth hide-scrollbar bg-gray-50/30">
           <AnimatePresence mode="wait">
             <motion.div
               key={role}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.2, ease: "easeInOut" }}
               className="pb-24" // App padding bottom
             >
                {role === "Worker" && <WorkerView onToast={triggerToast} />}
                {role === "Manager" && <ManagerView onToast={triggerToast} />}
                {role === "Client" && <ClientView onToast={triggerToast} />}
             </motion.div>
           </AnimatePresence>
        </main>

        {/* Home Indicator line wrapper for mobile feeling */}
        <div className="absolute bottom-0 left-0 w-full h-6 bg-transparent flex items-center justify-center p-2 z-20 pointer-events-none hidden sm:flex">
          <div className="w-1/3 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast.show && (
            <div className="absolute bottom-8 left-0 w-full px-6 z-50 pointer-events-none flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-gray-900 text-white px-5 py-3.5 rounded-2xl flex items-center gap-3 shadow-xl shadow-gray-900/20 whitespace-nowrap text-sm font-semibold w-auto max-w-full"
              >
                <CheckCircle2 size={18} className="text-green-400 shrink-0" />
                <span className="truncate">{toast.message}</span>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        
      </div>
    </div>
  );
}
