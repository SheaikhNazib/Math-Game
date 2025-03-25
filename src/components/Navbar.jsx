import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {

    const links = (
        <>
            <div className='flex gap-14'>
                <Link className='text-lg font-semibold hover:bg-white p-2 rounded-lg hover:text-black' to='/'>Image Game</Link>
                <Link className='text-lg font-semibold hover:bg-white p-2 rounded-lg hover:text-black' to='/mathGame'>Math Game</Link>
                <Link className='text-lg font-semibold hover:bg-white p-2 rounded-lg hover:text-black' to='/sumBox'>Sum Box</Link>
                <Link className='text-lg font-semibold hover:bg-white p-2 rounded-lg hover:text-black' to='/flagGames'>Guess Flag</Link>
                <Link className='text-lg font-semibold hover:bg-white p-2 rounded-lg hover:text-black' to='/wordScramble'>Word Scramble</Link>
                {/* <Link className='text-lg font-semibold hover:bg-white p-2 rounded-lg hover:text-black' to='/runningGame'>Running Game</Link> */}
            </div>
        </>
    )


    return (
        <div className="navbar bg-neutral text-neutral-content">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        {links}
                    </ul>
                </div>
                <Link to='/'>
                    <h2 className="text-2xl font-bold glow-effect">MATH GAME</h2>
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {links}
                </ul>
            </div>
            <div className="navbar-end">
                <button className="btn rounded-full"><FontAwesomeIcon icon={faUser} /></button>
            </div>
        </div>
    );
};

export default Navbar;