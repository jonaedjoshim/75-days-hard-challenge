import React, { useState, useEffect } from "react";
import { db } from "../firebase";import { doc, onSnapshot } from "firebase/firestore";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "trackers", "75hard_data"), (doc) => {
      if (doc.exists()) {
        const habits = doc.data().habits;
        const historyLogs = Array.from({ length: 75 }, (_, i) => {
          const completedTasks = habits.filter(h => h.completions[i]).length;
          const percentage = Math.round((completedTasks / habits.length) * 100);
          return { day: i + 1, percentage };
        }).filter(log => log.percentage > 0);
        setHistory(historyLogs.reverse())
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div className="mt-10 flex items-center justify-center"><span className="loading loading-spinner text-primary"></span></div>;

  return (
    <div className="mt-10 text-white flex flex-col items-center">
      <h2 className="text-3xl font-black text-secondary mb-10 uppercase tracking-tighter">History Log</h2>
      <div className="w-full max-w-4xl bg-[#242631] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <table className="table w-full">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <th className="text-left">Challenge Day</th>
              <th className="text-center">Stats</th>
              <th className="text-right pr-8">Success</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {history.length > 0 ? history.map((log) => (
              <tr key={log.day} className="hover:bg-white/5 transition-colors">
                <td className="py-4 pl-8 font-bold text-lg">Day {log.day}</td>
                <td className="text-center">
                  <span className={`badge badge-sm font-bold ${log.percentage === 100 ? "badge-success text-green-400" : "badge-warning text-yellow-400"}`}>
                    {log.percentage === 100 ? "PERFECT" : "PARTIAL"}
                  </span>
                </td>
                <td className="text-right pr-8 font-mono text-xl">{log.percentage}%</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" className="py-10 text-center text-gray-500 italic">No history yet!!!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;