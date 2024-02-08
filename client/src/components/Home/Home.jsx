import React from 'react'

// import component 
import TemporaryDrawer from '../SideDrawer/Sidedrawer'
import Divider from '@mui/material/Divider';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// import css
import "./Home.css"
import FolderCard from './FolderCard';
import NotesCard from './NotesCard';
import { getSession } from '../../appwrite/api';

function Home() {
    const session = getSession();
    return (
        <div>
            <div className="navbar-home">
                <div className='left-navbar-home'>
                    <TemporaryDrawer />
                    <div className="title-navbar">
                        <h1>Scribble</h1>
                    </div>
                </div>

                <div class="group">
                    <svg viewBox="0 0 24 24" aria-hidden="true" class="icon">
                        <g>
                            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                        </g>
                    </svg>
                    <input class="search-input" type="search" placeholder="Search" />
                </div>

            </div>

            <div className="home-folder-notes">

                <div className="home-folder">
                    <div className="folder-title">
                        <h1>Recent Folders: </h1>
                    </div>
                    <Divider />
                    <div className="card-wrapper">
                        <FolderCard />
                        <FolderCard />
                        <FolderCard />
                    </div>
                </div>

                <div className="home-notes">
                    <div className="folder-title">
                        <h1>Recent Notes: </h1>
                    </div>
                    <Divider />
                    <div className="card-wrapper">
                        <NotesCard />
                        <NotesCard />
                        <NotesCard />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home