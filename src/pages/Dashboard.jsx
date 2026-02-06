import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db } from "../firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const Dashboard = () => {
  const totalDays = 75;
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const [habitData, setHabitData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "trackers", "75hard_data"), (doc) => {
      if (doc.exists()) {
        setHabitData(doc.data().habits);
      } else {
        const initialData = [
          { id: 1, name: "৪ লিটার পানি", completions: Array(75).fill(false) },
          { id: 2, name: "ব্যায়াম ১ (৪৫ মি.)", completions: Array(75).fill(false) },
          { id: 3, name: "ব্যায়াম ২ (৪৫ মি.)", completions: Array(75).fill(false) },
          { id: 4, name: "১০ পৃষ্ঠা বই পড়া", completions: Array(75).fill(false) },
          { id: 5, name: "ডায়েট মেনে চলা", completions: Array(75).fill(false) },
        ];
        setHabitData(initialData);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const calculateProgress = (daysCount) => {
    if (habitData.length === 0) return 0;
    const totalPossible = habitData.length * daysCount;
    const done = habitData.reduce((acc, curr) => {
      const lastDays = curr.completions.slice(-daysCount);
      return acc + lastDays.filter(Boolean).length;
    }, 0);
    return Math.round((done / totalPossible) * 100);
  };

  const graphData = daysArray.map((d, index) => {
    const done = habitData.filter(h => h.completions[index]).length;
    return { day: d, val: (done / habitData.length) * 100 };
  });

  const toggleHabit = async (habitId, dayIndex) => {
    const updatedHabits = habitData.map(habit => {
      if (habit.id === habitId) {
        const newCompletions = [...habit.completions];
        newCompletions[dayIndex] = !newCompletions[dayIndex];
        return { ...habit, completions: newCompletions };
      }
      return habit;
    });
    setHabitData(updatedHabits);
    await setDoc(doc(db, "trackers", "75hard_data"), { habits: updatedHabits });
  };

  if (loading) return <div className="mt-10 flex items-center justify-center"><span className="loading loading-spinner text-primary"></span></div>;

  return (
    <div className="text-gray-200 p-4 md:p-6 font-sans">
      <div className="max-w-400 mx-auto space-y-6">
        <div className="flex items-center justify-center"> 
          <h1 className="text-3xl font-black text-secondary uppercase tracking-tighter">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#242631] p-6 rounded-2xl border border-white/5 flex justify-around items-center relative">
            <div className="text-center flex-1">
              <p className="text-[10px] uppercase text-gray-500 mb-2 tracking-widest">Last 7 Days</p>
              <div className="radial-progress text-primary" style={{ "--value": calculateProgress(7), "--size": "5rem", "--thickness": "6px" }} role="progressbar">
                <span className="text-sm font-bold text-white">{calculateProgress(7)}%</span>
              </div>
            </div>
            <div className="h-16 w-px bg-white/10"></div>
            <div className="text-center flex-1">
              <p className="text-[10px] uppercase text-gray-500 mb-2 tracking-widest">Last 30 Days</p>
              <div className="radial-progress text-secondary" style={{ "--value": calculateProgress(30), "--size": "5rem", "--thickness": "6px" }} role="progressbar">
                <span className="text-sm font-bold text-white">{calculateProgress(30)}%</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#242631] p-6 rounded-2xl border border-white/5 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                <XAxis dataKey="day" hide />
                <YAxis hide domain={[0, 100]} />
                <Area type="monotone" dataKey="val" stroke="#6366f1" fillOpacity={0.2} fill="#6366f1" />
                <Tooltip contentStyle={{ backgroundColor: '#242631', border: 'none' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#242631] rounded-2xl border border-white/5 overflow-hidden flex flex-col h-[60vh]">
          <div className="overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#242631] z-20">
                <tr className="text-gray-500 text-[10px] uppercase">
                  <th className="p-4 sticky left-0 bg-[#242631] z-30 min-w-37.5">Habits</th>
                  {daysArray.map(d => <th key={d} className="p-2 text-center min-w-10">D{d}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {habitData.map((habit) => (
                  <tr key={habit.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-sm font-medium sticky left-0 bg-[#242631] z-10 border-r border-white/5">
                      {habit.name}
                    </td>
                    {habit.completions.map((done, index) => (
                      <td key={index} className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={done}
                          onChange={() => toggleHabit(habit.id, index)}
                          className="checkbox checkbox-primary checkbox-xs rounded border-gray-600"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;