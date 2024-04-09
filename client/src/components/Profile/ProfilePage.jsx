
import React, { useState,useEffect } from 'react';
import TemporaryDrawer from '../SideDrawer/Sidedrawer';
import "./ProfilePage.css";
import { getCurrentUser, saveUser, updateNoteTitle, updateOldPassword } from '../../appwrite/api';
import { account, avatars } from '../../appwrite/config';
import Loader from '../Loader/Loader';
import { useNavigate } from "react-router";


function ProfilePage() {
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [currUser, setcurrUser] = useState({})
    const [oldPassword, setoldPassword] = useState('')
    const [newPassword, setnewPassword] = useState('')
    const [loading, setloading] = useState(true)
    const [isGoogle, setisGoogle] = useState(false)
    const navigate = useNavigate();
    useEffect(()=> {

        const getUser = async()=> {
            const userData = await getCurrentUser();
            const acc = userData[1];
            console.log(acc);
            if(!acc){
                setloading(false)
                navigate("/login");
                return;
            }
            const accountType = await account.getSession('current');
            if(accountType.provider === 'google'){
                setisGoogle(true)
            }
            
            const user = userData[3];

            if(!user){
                const accountId = account.$id;
                const avatar = avatars.getInitials(account.name);
                const newUser = await saveUser({
                    accountId: accountId,
                    email: account.email,
                    imageurl: avatar,
                    fullname: account.name,
                });
                setcurrUser(newUser.documents[0]);
            }
            setcurrUser(user);
            setloading(false)
        }
        getUser()
    },[])

    

    const toggleForgotPassword = () => {
        setShowForgotPassword(!showForgotPassword);
    };

    const handleChangePassword = async() => {
                await updateOldPassword(oldPassword,newPassword)
                
            
    }

    if(loading ) {
        return (
      <div className="loader">
        <Loader />
      </div>
    );
    }

    return (
        <div className='profile-page-wrapper'>
            <div className="navbar-home">
                <div className='left-navbar-home'>
                    <TemporaryDrawer />
                    <div className="title-navbar">
                        <h1>Scribble</h1>
                    </div>
                </div>
            </div>

            <div className="profile-card">
                {showForgotPassword ? (
                    <div className="forgot-password">
                        <div>
                            <div className="flex-column-forgot-password">
                                <label>Old Password</label>
                            </div>
                            <div className="inputForm">
                                <input
                                    type="password"
                                    className="input"
                                    id="oldPassword"
                                    placeholder="Enter your old password"
                                    onChange={(e)=>setoldPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex-column-forgot-password">
                                <label>New Password </label>
                            </div>
                            <div className="inputForm">
                                <input
                                    type="password"
                                    className="input"
                                    id="newPassword"
                                    placeholder="Enter your new password "
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex-column-forgot-password">
                                <label>Confirm New Password </label>
                            </div>
                            <div className="inputForm">
                                <input
                                    type="password"
                                    className="input"
                                    id="confirmPassword"
                                    placeholder="Retype new password"
                                    onChange={(e)=>setnewPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <button className="profile-btn-dark" onClick={handleChangePassword}>Submit</button>
                    </div>
                ) : (
                    <div className="profile-card-wrraper">
                        <div className="cover-photo">
                            <div className="profile">
                                <img
                                    src={currUser?.imageurl}
                                    alt="profile"
                                    className='profile-image'
                                />
                            </div>
                        </div>

                        <h3 className="profile-name">{currUser?.fullname}</h3>
                        <div className="profile-about">
                            <p className="email">{currUser?.email}</p>
                        </div>
                        {/* <button className="profile-btn-dark">Edit Profile</button> */}
                        {isGoogle ? null : <button className="profile-btn-dark" onClick={toggleForgotPassword}>Change Password</button>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;

