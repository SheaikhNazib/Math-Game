import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {

    const links = (
        <>
            <div className='flex gap-14'>

                {/* -------------------- math -------------------- */}
                <div className="dropdown dropdown-start">
                    <div tabIndex={0} role="button" className="btn m-1">Math🔽</div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                        <li><Link className='text-lg font-semibold hover:bg-white p-2 rounded-lg text-black hover:text-blue-600' to='/'>Image Game</Link></li>
                        <li><Link className='text-lg font-semibold hover:bg-white p-2 rounded-lg text-black hover:text-blue-600' to='/mathGame'>Math Game</Link></li>
                        <li><Link className='text-lg font-semibold hover:bg-white p-2 rounded-lg text-black hover:text-blue-600' to='/sumBox'>Sum Box</Link></li>
                        <li><Link className='text-lg font-semibold hover:bg-white p-2 rounded-lg text-black hover:text-blue-600' to='/fractionFactory'>Fraction Factory</Link></li>
                    </ul>
                </div>

                {/* -------------------- english -------------------- */}
                <div className="dropdown dropdown-start">
                    <div tabIndex={0} role="button" className="btn m-1">English 🔽</div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                        <li><Link className='text-lg font-semibold hover:bg-white p-2 rounded-lg text-black hover:text-blue-600' to='/wordScramble'>Word Scramble</Link></li>
                        <li><Link className='text-lg font-semibold hover:bg-white p-2 rounded-lg text-black hover:text-blue-600' to='/vocabularyVolcano'>Vocabulary Volcano</Link></li>
                        <li><Link className='text-lg font-semibold hover:bg-white p-2 rounded-lg text-black hover:text-blue-600' to='/grammarNinja'>Grammar Ninja</Link></li>
                    </ul>
                </div>

                {/* -------------------- science -------------------- */}
                <div className="dropdown dropdown-start">
                    <div tabIndex={0} role="button" className="btn m-1">Science 🔽</div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">

                        <li><Link className='text-lg font-semibold hover:bg-white p-2 rounded-lg text-black hover:text-blue-600' to='/scienceFlashcard'>Flash Card</Link></li>
                        <li><Link className='text-lg font-semibold hover:bg-white p-2 rounded-lg text-black hover:text-blue-600' to='/elementMatcher'>Element Matcher</Link></li>

                    </ul>
                </div>

                {/* -------------------- general knowledge -------------------- */}
                <div className="dropdown dropdown-start">
                    <div tabIndex={0} role="button" className="btn m-1">General Knowledge 🔽</div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                        <li><Link className='text-lg font-semibold hover:bg-white p-2 rounded-lg text-black hover:text-blue-600' to='/flagGames'>Guess Flag</Link></li>

                    </ul>
                </div>







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