import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';

const Navbar = () => {
    const location = useLocation();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const isActive = (path) => location.pathname === path ? "btn-primary" : "btn-ghost";

    return (
        <div className="navbar p-4 md:p-6 bg-base-100/50 backdrop-blur-md sticky top-0 z-50 border-b border-primary/10 px-4 md:px-10">
            <div className="max-w-380 mx-auto w-full flex items-center">
                <div className="flex-1">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,0,0,0.4)]">
                            <span className="text-white font-black text-xl">৭৫</span>
                        </div>
                        <span className="text-xl font-bold tracking-tighter text-white hidden sm:block">
                            হার্ড চ্যালেঞ্জ
                        </span>
                    </Link>
                </div>

                <div className="flex-none gap-4 flex items-center">
                    <div className="hidden md:flex flex-col items-end border-r border-white/10 pr-4">
                        <span className="text-lg font-bold text-white tabular-nums">
                            {format(currentTime, 'hh:mm:ss bbb',)}
                        </span>
                        <span className="text-xs text-gray-500 uppercase">
                            {format(currentTime, 'EEEE, do MMMM',)}
                        </span>
                    </div>

                    <ul className="menu menu-horizontal px-1 gap-2">
                        <li>
                            <Link to="/" className={`btn btn-sm ${isActive('/')}`}>ড্যাশবোর্ড</Link>
                        </li>
                        <li>
                            <Link to="/history" className={`btn btn-sm ${isActive('/history')}`}>ইতিহাস</Link>
                        </li>
                        <li>
                            <Link to="/rewards" className={`btn btn-sm ${isActive('/rewards')}`}>পুরস্কার</Link>
                        </li>
                    </ul>

                    

                </div>
            </div>
        </div>
    );
};

export default Navbar;