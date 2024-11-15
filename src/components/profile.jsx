import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import './styles/profile.css';
import Head from './header';
const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [weeklyEmails, setWeeklyEmails] = useState(false);
    const [gender, setGender] = useState('Male');
    const [dateOfBirth, setDateOfBirth] = useState({ day: '', month: '', year: '' });
    const navigate = useNavigate();
    const user = auth.currentUser;
    const email = user?.email;

    useEffect(() => {
        const fetchUserData = async () => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                // Check if user is authenticated
                if (!user) {
                    navigate('/card');
                    return;
                }

                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUserData(data);
                        if (data.dateOfBirth) {
                            const [day, month, year] = data.dateOfBirth.split(' ');
                            setDateOfBirth({ day, month, year });
                        }
                        setWeeklyEmails(data.weeklyEmails || false);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            });

            return () => unsubscribe();
        };

        fetchUserData();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;

        if (user) {
            try {
                const docRef = doc(db, "users", user.uid);
                await updateDoc(docRef, {
                    email,
                    gender,
                    dateOfBirth: `${dateOfBirth.day} ${dateOfBirth.month} ${dateOfBirth.year}`,
                    weeklyEmails,
                });
                alert('Profile updated successfully!');
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('Failed to update profile');
            }
        } else {
            alert('No user is logged in.');
        }
    };

    if (!userData) {
        return (
            <div>
                <Head />
                <div className="container"></div></div>);
    }

    return (
        <div>
            <Head />
            <div className="container profile-container my-4">
                <h1 className="text-center">User Profile</h1>
                <form onSubmit={handleSubmit} className="bg-light p-4 rounded">
                    <div className="flex items-center justify-center mb-4">
                        {auth.currentUser?.photoURL ? (
                            <img
                                src={auth.currentUser.photoURL}
                                alt="Profile"
                                className="w-24 h-24 rounded-full"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-2xl text-gray-600">
                                    {auth.currentUser?.email?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="profile-mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            value={user.email}
                            className="form-control"
                            required
                            readOnly
                        />
                    </div>

                    <div className="profile-mb-3">
                        <label className="form-label">Gender</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="form-select"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="profile-mb-3">
                        <label className="form-label">Date of Birth</label>
                        <div className="profile-d-flex">
                            <input
                                type="number"
                                placeholder="DD"
                                value={dateOfBirth.day}
                                onChange={(e) => setDateOfBirth({ ...dateOfBirth, day: e.target.value })}
                                className="form-control me-2"
                                required
                                style={{ marginRight: 0.5 + 'em' }}
                            />
                            <select
                                value={dateOfBirth.month}
                                onChange={(e) => setDateOfBirth({ ...dateOfBirth, month: e.target.value })}
                                className="form-select me-2"
                                required
                                style={{ marginRight: 0.5 + 'em' }}
                            >
                                <option value="">Month</option>
                                <option value="January">January</option>
                                <option value="February">February</option>
                                <option value="March">March</option>
                                <option value="April">April</option>
                                <option value="May">May</option>
                                <option value="June">June</option>
                                <option value="July">July</option>
                                <option value="August">August</option>
                                <option value="September">September</option>
                                <option value="October">October</option>
                                <option value="November">November</option>
                                <option value="December">December</option>
                            </select>
                            <input
                                type="number"
                                placeholder="YYYY"
                                value={dateOfBirth.year}
                                onChange={(e) => setDateOfBirth({ ...dateOfBirth, year: e.target.value })}
                                className="form-control"
                                required
                                style={{ marginRight: 0.5 + 'em' }}
                            />
                        </div>
                    </div>
                    <div className="profile-mb-3">
                        <div className="profile-form-check">
                            <input
                                type="checkbox"
                                checked={weeklyEmails}
                                onChange={(e) => setWeeklyEmails(e.target.checked)}
                                className="profile-form-check-input"
                            />
                            <label htmlFor="weeklyEmails" className="font-semibold">
                                Receive weekly tarot readings via email
                            </label>
                        </div>
                    </div>
                    <div className="profile-button-container">
                        <button type="submit" className="btn btn-primary">Save Profile</button>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default Profile;
