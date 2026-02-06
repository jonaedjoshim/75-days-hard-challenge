import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [tasks, setTasks] = useState([
    { id: 1, name: "৪ লিটার পানি পান", completed: false },
    { id: 2, name: "৪৫ মিনিট ব্যায়াম (১ম)", completed: false },
    { id: 3, name: "৪৫ মিনিট ব্যায়াম (২য়)", completed: false },
    { id: 4, name: "১০ পৃষ্ঠা বই পড়া", completed: false },
    { id: 5, name: "ডায়েট মেনে চলা", completed: false },
  ]);

  const [weeklyData] = useState([
    { name: 'শনি', uv: 0 }, { name: 'রবি', uv: 0 }, { name: 'সোম', uv: 0 },
    { name: 'মঙ্গল', uv: 0 }, { name: 'বুধ', uv: 0 }, { name: 'বৃহস্পতি', uv: 0 }, { name: 'শুক্র', uv: 0 }
  ]);

  const progressPercentage = (tasks.filter(t => t.completed).length / tasks.length) * 100;

  return (
    <div className="p-6 md:p-10 flex flex-col items-center bg-base-300 min-h-screen text-white">
      <h2 className="text-3xl font-black text-primary mb-10 uppercase italic">Control Center</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-5xl">
        {/* Progress & Tasks */}
        <div className="bg-base-100 p-8 rounded-3xl shadow-xl border border-primary/10 flex flex-col items-center">
          <div className="radial-progress text-primary mb-8" style={{"--value": progressPercentage, "--size": "12rem", "--thickness": "1rem"}}>
            <span className="text-3xl font-bold">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full space-y-3">
            {tasks.map(task => (
              <label key={task.id} className="flex items-center p-3 bg-base-200 rounded-xl cursor-pointer hover:bg-primary/5 transition-all">
                <input type="checkbox" checked={task.completed} onChange={() => {/* Toggle Logic */}} className="checkbox checkbox-primary mr-4" />
                <span className={task.completed ? 'line-through text-gray-500' : ''}>{task.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Analytics Graph */}
        <div className="bg-base-100 p-8 rounded-3xl shadow-xl border border-primary/10">
          <h3 className="text-lg font-bold mb-6 text-secondary uppercase">Weekly Growth</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={12} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{backgroundColor: '#1a1a1a', border: 'none'}} />
                <Line type="monotone" dataKey="uv" stroke="#570df8" strokeWidth={4} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;