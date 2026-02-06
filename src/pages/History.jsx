import React from "react";

const History = () => {
  return (
    <div className="min-h-screen bg-base-300 p-10 text-white flex flex-col items-center">
      <h2 className="text-3xl font-black text-secondary mb-10 uppercase">History Log</h2>
      <div className="w-full max-w-4xl bg-base-100 rounded-3xl overflow-hidden shadow-2xl border border-white/5">
        <table className="table w-full">
          <thead className="bg-base-200">
            <tr><th className="py-5">তারিখ</th><th>স্ট্যাটাস</th><th className="text-right">প্রগ্রেস</th></tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="py-4 text-gray-500 italic">No history found yet...</td>
              <td>-</td>
              <td className="text-right">০%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;