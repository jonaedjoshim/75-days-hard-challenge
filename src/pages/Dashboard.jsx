import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db } from "../firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { format } from 'date-fns';

const Dashboard = () => {
  const totalDays = 75;
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const [habitData, setHabitData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "trackers", "75hard_data"), (docSnap) => {
      if (docSnap.exists()) {
        setHabitData(docSnap.data().habits);
      } else {
        const initialData = [
          { id: 1, name: "Academic Study", time: "06:00 AM - 09:30 AM", completions: Array(75).fill(false), timestamps: Array(75).fill(null) },
          { id: 2, name: "React & MongoDB Learning", time: "09:30 AM - 12:30 PM", completions: Array(75).fill(false), timestamps: Array(75).fill(null) },
          { id: 3, name: "Zohr Namaz & Rest", time: "12:30 PM - 02:30 PM", completions: Array(75).fill(false), timestamps: Array(75).fill(null) },
          { id: 4, name: "Data Analysis Learning", time: "02:30 PM - 05:00 PM", completions: Array(75).fill(false), timestamps: Array(75).fill(null) },
          { id: 5, name: "Prayer", time: "Flexible", completions: Array(75).fill(false), timestamps: Array(75).fill(null) },
          { id: 6, name: "Sound Sleep (After Esha)", time: "Post Esha", completions: Array(75).fill(false), timestamps: Array(75).fill(null) },
        ];
        setHabitData(initialData);
        setDoc(doc(db, "trackers", "75hard_data"), { habits: initialData });
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const calculateProgress = (daysCount) => {
    if (habitData.length === 0) return 0;

    let todayIndex = 0;
    habitData.forEach(habit => {
      const lastTrue = habit.completions.lastIndexOf(true);
      if (lastTrue > todayIndex) todayIndex = lastTrue;
    });

    const end = todayIndex + 1;
    const start = Math.max(0, end - daysCount);

    const totalPossible = habitData.length * daysCount;

    const done = habitData.reduce((acc, curr) => {
      const slice = curr.completions.slice(start, end);
      return acc + slice.filter(Boolean).length;
    }, 0);

    return Math.round((done / totalPossible) * 100) || 0;
  };

  const graphData = daysArray.map((d, index) => {
    const done = habitData.filter(h => h.completions[index]).length;
    return { day: d, val: (done / habitData.length) * 100 };
  });

  const toggleHabit = async (habitId, dayIndex) => {
    const now = format(new Date(), 'hh:mm:ss a');
    const updatedHabits = habitData.map(habit => {
      if (habit.id === habitId) {
        const newCompletions = [...habit.completions];
        const newTimestamps = habit.timestamps ? [...habit.timestamps] : Array(75).fill(null);
        newCompletions[dayIndex] = !newCompletions[dayIndex];
        newTimestamps[dayIndex] = newCompletions[dayIndex] ? now : null;
        return { ...habit, completions: newCompletions, timestamps: newTimestamps };
      }
      return habit;
    });
    setHabitData(updatedHabits);
    await setDoc(doc(db, "trackers", "75hard_data"), { habits: updatedHabits });
  };

  if (loading) return <div className="mt-10 flex items-center justify-center"><span className="loading loading-spinner text-primary"></span></div>;

  return (
    <div className="text-gray-200 p-4 md:p-6 font-sans max-h-screen overflow-hidden">
      <div className="max-w-[1600px] mx-auto space-y-4">
        <div className="flex items-center justify-center">
          <h1 className="text-3xl font-black text-secondary uppercase tracking-tighter">Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#242631] p-6 rounded-2xl border border-white/5 flex justify-around items-center h-48">
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

        {/* Insights Row */}
        <div className="grid grid-cols-3 gap-4 h-[60px]">
          {[
            { label: "Hardcore Study", val: "37.5%", color: "text-primary" },
            { label: "Deep Sleep", val: "33.3%", color: "text-secondary" },
            { label: "Life Balance", val: "29.2%", color: "text-white" }
          ].map((item, i) => (
            <div key={i} className="bg-[#242631] px-5 rounded-2xl border border-white/5 flex justify-between items-center shadow-md">
              <span className="text-[9px] uppercase text-gray-400 tracking-widest font-bold">{item.label}</span>
              <span className={`text-sm font-black ${item.color}`}>{item.val}</span>
            </div>
          ))}
        </div>

        <div className="bg-[#242631] rounded-2xl border border-white/5 overflow-hidden flex flex-col h-[50vh]">
          <div className="overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#242631] z-20">
                <tr className="text-gray-500 text-[10px] uppercase">
                  <th className="p-4 sticky left-0 bg-[#242631] z-30 min-w-[220px] border-r border-white/5">Habits</th>
                  {daysArray.map(d => <th key={d} className="p-2 text-center min-w-[55px]">D{d}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {habitData.map((habit) => (
                  <tr key={habit.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 sticky left-0 bg-[#242631] z-10 border-r border-white/5 shadow-[5px_0_10px_rgba(0,0,0,0.3)]">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white leading-tight">{habit.name}</span>
                        <span className="text-[10px] text-primary font-medium mt-1">{habit.time}</span>
                      </div>
                    </td>
                    {habit.completions.map((done, index) => (
                      <td key={index} className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={done}
                          onChange={() => toggleHabit(habit.id, index)}
                          className="checkbox checkbox-primary checkbox-sm rounded-full border-gray-600 transition-all duration-300"
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