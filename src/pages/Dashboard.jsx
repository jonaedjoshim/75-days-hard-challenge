const Dashboard = () => {
  return (
    <div className="p-10 text-center flex flex-col items-center">
      <h2 className="text-4xl font-extrabold text-primary mb-6">দৈনিক ড্যাশবোর্ড</h2>
      <div className="radial-progress text-primary shadow-xl border-4 border-primary/10" 
           style={{"--value": 40, "--size": "14rem", "--thickness": "1rem"}} 
           role="progressbar">
        ৪০%
      </div>
      <p className="mt-8 text-xl text-gray-400">আজকের লক্ষ্য পূরণে আপনি দৃঢ়প্রতিজ্ঞ। এগিয়ে চলুন! 🔥</p>
      
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          <div className="card bg-base-100 p-5 border border-primary/20 shadow-sm">
              <h3 className="font-bold text-gray-500">বর্তমান ধারাবাহিকতা</h3>
              <p className="text-3xl text-secondary">০৫ দিন</p>
          </div>
          <div className="card bg-base-100 p-5 border border-primary/20 shadow-sm">
              <h3 className="font-bold text-gray-500">পরবর্তী মাইলফলক</h3>
              <p className="text-3xl text-accent">১০ম দিন</p>
          </div>
      </div>
    </div>
  );
};
export default Dashboard;