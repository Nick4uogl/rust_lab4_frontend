import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";

const ChatRoom = ({ roomId, username, socket, chat, setChat }) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setChat((prevChat) => [
        ...prevChat,
        { username: data.username, message: data.message },
      ]);
    };

    socket.onclose = () => console.log("WebSocket connection closed");

    return () => {
      socket.close();
    };
  }, [socket]);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ roomId, message, username }));
      setMessage("");
    } else {
      alert("Connection is not open. Please reconnect.");
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Chat Room: {roomId}
      </Typography>
      <Box sx={{ maxHeight: 300, overflowY: "auto", mb: 2 }}>
        {chat.map((msg, index) => (
          <Typography key={index} variant="body2">
            <strong>{msg.username}:</strong> {msg.message}
          </Typography>
        ))}
      </Box>
      <TextField
        fullWidth
        label="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        margin="normal"
      />
      <Button fullWidth variant="contained" onClick={sendMessage}>
        Send
      </Button>
    </Paper>
  );
};

export default ChatRoom;
