import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? "btn-primary" : "btn-ghost";

    return (
        <div className="navbar bg-base-100/50 backdrop-blur-md sticky top-0 z-50 border-b border-primary/10 px-4 md:px-10">
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

            <div className="flex-none gap-2">
                <ul className="menu menu-horizontal px-1 gap-2">
                    <li>
                        <Link to="/" className={`btn btn-sm ${isActive('/')}`}>
                            ড্যাশবোর্ড
                        </Link>
                    </li>
                    <li>
                        <Link to="/history" className={`btn btn-sm ${isActive('/history')}`}>
                            ইতিহাস
                        </Link>
                    </li>
                    <li>
                        <Link to="/rewards" className={`btn btn-sm ${isActive('/rewards')}`}>
                            পুরস্কার
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;