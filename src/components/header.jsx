import * as React from 'react';
import { useState } from 'react';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Logo from './logo.png';
import './styles/header.css';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const handleLogout = () => {
  // Remove user data from sessionStorage
  sessionStorage.removeItem("user");
  // Optionally, redirect to the home page or login page
  window.location.href = "/card"; // Redirect to home page after logout
};
export default function DividerStack() {
  const [showDropdown, setShowDropdown] = useState(false);
  const user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : null;
  return (
    <div className="header">
      <img src={Logo} alt="Header Logo" className="logo" />
      <div className="centered-content">
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
        >
          <Item><a href="/">Home</a></Item>
          <Item>About</Item>
          <Item><a href="/card">Cards</a></Item>
          <Item>Tarot Readings</Item>
          {user ? (
            <Item> <a onClick={() => setShowDropdown((prev) => !prev)} style={{cursor: "pointer"}}>{user.displayName}</a>
            {showDropdown && (
              <div className="flex flex-col dropdownProfile">
              <ul className="flex flex-col gap-4">
                <li>
                  <a href="/profile">Profile</a>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
            )}
            </Item>
          ) : (
            <Item><a href="/login">Login</a></Item>
          )}
        </Stack>
      </div>
    </div>
  );
}
