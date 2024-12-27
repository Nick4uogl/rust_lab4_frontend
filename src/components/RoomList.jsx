import React, { useState } from "react";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";

const RoomList = ({ rooms, joinRoom, fetchRooms, username }) => {
  const [newRoomName, setNewRoomName] = useState("");

  const createRoom = async () => {
    const response = await fetch("http://127.0.0.1:8080/create_room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newRoomName, creator: username }),
    });
    if (response.ok) {
      alert("Room created successfully!");
      setNewRoomName("");
      fetchRooms();
    } else {
      alert("Failed to create room.");
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Rooms
      </Typography>
      <TextField
        fullWidth
        label="New Room Name"
        value={newRoomName}
        onChange={(e) => setNewRoomName(e.target.value)}
        margin="normal"
      />
      <Button fullWidth variant="contained" onClick={createRoom} sx={{ mb: 2 }}>
        Create Room
      </Button>
      <List>
        {rooms.map((room) => (
          <ListItem key={room.id} button onClick={() => joinRoom(room.id)}>
            <ListItemText primary={room.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default RoomList;
