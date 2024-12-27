// Refactored App with Material-UI and components split
import React, { useState, useEffect } from 'react';
import {  Box, Paper, Grid } from '@mui/material';

import ChatRoom from './components/ChatRoom';
import LoginForm from './components/LoginForm';
import RoomList from './components/RoomList';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('');
  const [socket, setSocket] = useState(null);
    const [chat, setChat] = useState([]);
  

  useEffect(() => {
    if (loggedIn) {
      fetchRooms();
    }
  }, [loggedIn]);

  const fetchRooms = async () => {
    const response = await fetch('http://127.0.0.1:8080/list_rooms');
    if (response.ok) {
      const roomList = await response.json();
      setRooms(roomList);
    }
  };

  const register = async () => {
    const response = await fetch('http://127.0.0.1:8080/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    alert(response.ok ? 'User registered successfully!' : 'Registration failed.');
  };

  const login = async () => {
    const response = await fetch('http://127.0.0.1:8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      setLoggedIn(true);
    } else {
      alert('Login failed.');
    }
  };

  const joinRoom = (roomId) => {
    console.log('join room')
    setCurrentRoom(roomId);
    connectWebSocket(roomId);
  };

  const connectWebSocket = (roomId) => {
    if (socket && socket.readyState !== WebSocket.CLOSED) {
        socket.close();
    }

    const ws = new WebSocket(`ws://127.0.0.1:8080/ws/?roomId=${roomId}`);
    setSocket(ws);

    ws.onopen = () => {
        console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            setChat((prevChat) => [
                ...prevChat,
                { username: data.username, message: data.message },
            ]);
        } catch (error) {
            console.error('Error parsing message data:', error);
        }
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
        console.error('WebSocket error', error);
    };
};

  return (
    <Box sx={{ padding: 4 }}>
      {!loggedIn ? (
        <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, margin: 'auto' }}>
          <LoginForm
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            onRegister={register}
            onLogin={login}
          />
        </Paper>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <RoomList rooms={rooms} joinRoom={joinRoom} fetchRooms={fetchRooms} username={username} />
          </Grid>
          <Grid item xs={12} md={8}>
            {currentRoom && (
              <ChatRoom roomId={currentRoom} username={username} socket={socket} chat={chat} setChat={setChat} />
            )}
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default App;
