import React, { useState, useEffect } from "react";
import TemporaryDrawer from "../SideDrawer/Sidedrawer";
import Divider from "@mui/material/Divider";
import "./Home.css";
import NotesCard from "../Home/NotesCard";
import {
 saveNote,
 getNotes,
 getCurrentUser,
 saveUser,
} from "../../appwrite/api";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { userSaveNoteMutation } from "../../reactQuery/queries";
import { avatars } from "../../appwrite/config";
import Loader from "../Loader/Loader";

function Home() {
 const [notes, setNotes] = useState([]);
 const [searchQuery, setSearchQuery] = useState(""); // State for search query
 const navigate = useNavigate();
 const [user, setUser] = useState({});
 const { mutateAsync: createNote } = userSaveNoteMutation();
 const [loading, setLoading] = useState(true);

 useEffect(() => {
    const getUserNotes = async () => {
      try {
        const data = await getCurrentUser();
        const account = data[1];
        const user = data[3];
        if (!account) {
          navigate("/login");
          return;
        }
        if (!user) {
          const accountId = account.$id;
          const avatar = avatars.getInitials(account.name);
          const newUser = await saveUser({
            accountId: accountId,
            email: account.email,
            imageurl: avatar,
            fullname: account.name,
          });
          setUser(newUser);
        }
        setUser(user);
        const userNotes = await getNotes(user.$id);
        setNotes(userNotes.documents);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getUserNotes();
 }, []);

 const handleNewNote = async () => {
    try {
      const note = await createNote({
        user: user?.$id,
      });
      navigate(`/notes/${note.$id}`);
    } catch (error) {
      console.log(error);
    }
 };

 const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
 };

 if (loading) {
    return (
      <div className="loader">
        <Loader />
      </div>
    );
 }

 return (
    <div>
      <div className="navbar-home">
        <div className="left-navbar-home">
          <TemporaryDrawer />
          <div className="title-navbar">
            <h1>Scribble</h1>
          </div>
        </div>

        <div className="group">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
          <input
            className="search-input"
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="add-new-note">
        <button class="button" type="button" onClick={handleNewNote}>
          <span class="button__text">Add New Note</span>
          <span class="button__icon"><svg class="svg" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg></span>
        </button>
      </div>

      {/* Search Results Section */}
        {searchQuery.length > 0 && (
          <div className="home-notes">
            <div className="folder-title">
              <h1>Search Results: </h1>
            </div>
            <Divider />
            <div className="card-wrapper">
              {notes
                .filter((note) =>
                 note.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((note) => (
                 <div key={note.$id}>
                    <NotesCard title={note.title} id={note.$id} />
                 </div>
                ))}
            </div>
          </div>
        )}

      <div className="home-folder-notes">
        <div className="home-notes">
          <div className="folder-title">
            <h1>Previous Notes: </h1>
          </div>
          <Divider />

          <div className="card-wrapper">
            {notes.map((note) => (
              <div key={note.$id}>
                <NotesCard title={note.title} id={note.$id} />
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </div>
 );
}

export default Home;
