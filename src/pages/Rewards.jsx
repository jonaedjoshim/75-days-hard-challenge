import React from "react";

const Rewards = () => {
  const badges = [
    { name: "Day 1", icon: "🌱", unlocked: false },
    { name: "Day 7", icon: "🔥", unlocked: false },
    { name: "Day 30", icon: "🛡️", unlocked: false },
    { name: "Day 75", icon: "👑", unlocked: false },
  ];

  return (
    <div className="min-h-screen bg-base-300 p-10 text-white flex flex-col items-center">
      <h2 className="text-3xl font-black text-accent mb-10 uppercase">Achievements</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
        {badges.map((b, i) => (
          <div key={i} className="p-8 bg-base-100 rounded-3xl border border-white/5 flex flex-col items-center opacity-30 grayscale">
            <span className="text-6xl mb-4">{b.icon}</span>
            <p className="font-bold">{b.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;