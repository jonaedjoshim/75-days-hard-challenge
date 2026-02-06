import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const Rewards = () => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "trackers", "75hard_data"), (doc) => {
      if (doc.exists()) {
        const habits = doc.data().habits;
        let streak = 0;
        for (let i = 0; i < 75; i++) {
          const dayDone = habits.every(h => h.completions[i] === true);
          if (dayDone) streak++;
          else break;
        }
        setCurrentStreak(streak);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const badges = [
    { name: "Day 1", icon: "🌱", criteria: 1 },
    { name: "Day 7", icon: "🔥", criteria: 7 },
    { name: "Day 30", icon: "🛡️", criteria: 30 },
    { name: "Day 75", icon: "👑", criteria: 75 },
  ];

  if (loading) return <div className="mt-10 flex items-center justify-center"><span className="loading loading-spinner text-primary"></span></div>;

  return (
    <div className="p-10 text-white flex flex-col items-center">
      <h2 className="text-3xl font-black text-primary mb-2 uppercase tracking-tighter">Achievements</h2>
      <p className="text-gray-500 mb-10">Current Streak: <span className="text-accent font-bold">{currentStreak} Days</span></p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
        {badges.map((b, i) => {
          const isUnlocked = currentStreak >= b.criteria;
          return (
            <div key={i} className={`p-8 rounded-3xl border flex flex-col items-center transition-all duration-500 ${isUnlocked ? "bg-[#242631] border-white/10 shadow-lg shadow-indigo-500/10" : "bg-[#1a1c23] border-white/5 opacity-20 grayscale"}`}>
              <span className="text-6xl mb-4">{b.icon}</span>
              <p className="font-bold uppercase text-sm tracking-widest">{b.name}</p>
              <span className="text-[10px] mt-2 font-black">{isUnlocked ? "UNLOCKED" : "LOCKED"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Rewards;