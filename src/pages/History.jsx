import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "trackers", "75hard_data"), (docSnap) => {
      if (docSnap.exists()) {
        const habits = docSnap.data().habits;
        
        const historyLogs = Array.from({ length: 75 }, (_, i) => {
          const tasksAtDay = habits.map(h => ({
            name: h.name,
            done: h.completions[i],
            time: h.timestamps ? h.timestamps[i] : null 
          }));

          const completedCount = tasksAtDay.filter(t => t.done).length;
          const percentage = Math.round((completedCount / habits.length) * 100);

          return { 
            day: i + 1, 
            percentage, 
            tasks: tasksAtDay.filter(t => t.done) 
          };
        }).filter(log => log.percentage > 0);

        setHistory(historyLogs.reverse());
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1c23]">
      <span className="loading loading-bars loading-lg text-primary"></span>
    </div>
  );

  return (
    <div className="p-4 md:p-10 max-w-5xl mx-auto min-h-screen text-gray-200">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-secondary uppercase tracking-tighter inline-block">
          History
        </h2>
        <p className="text-gray-500 mt-2 font-bold uppercase tracking-[0.2em] text-[10px]">
          Real-time Progress Logs
        </p>
      </div>

      {/* Timeline Section */}
      <div className="relative space-y-10 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
        
        {history.length > 0 ? history.map((log) => (
          <div key={log.day} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-[#242631] text-primary z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-1/2 top-0">
              <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_12px_#ff0000]"></div>
            </div>

            <div className="w-[calc(100%-4rem)] md:w-[45%] bg-[#242631] p-6 rounded-3xl border border-white/5 shadow-2xl transition-all group-hover:border-primary/40 ml-auto md:ml-0">
              <div className="flex justify-between items-center mb-5">
                <div className="font-black text-2xl italic text-white tracking-tighter">DAY {log.day}</div>
                <div className="flex flex-col items-end">
                  <div className="font-mono text-xl font-black text-secondary">{log.percentage}%</div>
                  <div className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Efficiency</div>
                </div>
              </div>

              <div className="space-y-3">
                {log.tasks.map((task, idx) => (
                  <div key={idx} className="flex flex-col bg-black/40 p-3 rounded-2xl border border-white/5 hover:bg-black/60 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gray-300 uppercase leading-none">{task.name}</span>
                      <span className="text-[9px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-lg border border-primary/20">
                        {task.time || "Done"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-[#242631] rounded-[40px] border border-white/5 border-dashed">
            <p className="text-gray-500 italic font-mono uppercase text-xs tracking-widest text-balance px-4">
              Waiting for your first move, Legend!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;