import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import { useStudent } from "../../hooks/useStudent";

export default function ContactPersonTeacher({
  item,
  selectChat,
  lastMessage,
  active,
}) {
  const { data } = useStudent(item.studentId);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        columnGap: "12px",
        marginBottom: "20px",
        cursor: "pointer",
        backgroundColor: active ? "#eee" : "",
        padding: "12px 8px",
        borderRadius: "6px",
      }}
      onClick={selectChat}
    >
      <Avatar
        alt={data?.data?.name}
        src={`${process.env.REACT_APP_API_KEY}images/${data?.data?.image}`}
        sx={{ width: "45px", height: "45px" }}
      />
      <Box>
        <Typography sx={{ margin: 0 }}>
          {item.studentId === "0" ? "Admin" : data?.data?.name}
        </Typography>
        <Typography sx={{ fontSize: "12px" }}>
          {lastMessage?.text?.slice(0.3)}
        </Typography>
      </Box>
    </Box>
  );
}
