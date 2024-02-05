import { Box, Divider, Paper, Stack, Typography, styled } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import ContactPerson from "../../components/reusableUi/ContactPerson";
import Conversaition from "../../components/student/Conversaition";
import StudentLayout from "../../components/student/StudentLayout";
import { collection, query, onSnapshot, where, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import lgo from "../../images/messge.jpg";

const Image = styled("img")({
  width: "160px",
});

export default function StudentMessages() {
  const [conversaition, setConversaition] = useState([]);
  const scroll = useRef();
  const { t } = useTranslation();

  const { student } = useSelector((state) => state.student);

  useEffect(() => {
    const q = query(
      collection(db, "chats"),
      where("studentId", "==", `${student.id}`)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let conv = [];
      querySnapshot.forEach((doc) => {
        conv.push({ ...doc.data(), id: doc.id });
      });
      setConversaition(conv.sort((a, b) => b.lastmessage - a.lastmessage));
    });
    return () => unsubscribe();
  }, [student.id]);

  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    if (chatId) {
      const unSub = onSnapshot(doc(db, "chats", chatId), (doc) => {
        doc.exists() && setMessages({ ...doc.data(), id: doc.id });
      });
      return () => {
        unSub();
      };
    }
  }, [chatId]);

  return (
    <StudentLayout>
      <Stack direction={{ md: "row", xs: "column" }} gap="10px">
        <Box sx={{ width: { xs: "100%", md: "70%" } }}>
          {chatId ? (
            <>
              <Conversaition messages={messages} scroll={scroll} />
            </>
          ) : (
            <Paper
              sx={{
                height: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Image src={lgo} alt="" />
              <Typography
                sx={{ fontWeight: 600, marginTop: "12px", fontSize: "22px" }}
              >
                {t("start_message")}
              </Typography>
            </Paper>
          )}
        </Box>
        <Box sx={{ width: { xs: "100%", md: "30%" } }}>
          <Paper sx={{ paddingY: "20px" }}>
            <Typography sx={{ paddingX: "20px" }}>Messages</Typography>
            <Divider sx={{ marginY: "10px" }} />
            <Box sx={{ paddingX: "20px" }}>
              {conversaition.length > 0 &&
                conversaition.map((item, index) => {
                  return (
                    <ContactPerson
                      item={item}
                      key={item.id + "k1"}
                      selectChat={() => setChatId(item.id)}
                      lastMessage={item.messages[item.messages.length - 1]}
                      active={item.id == chatId}
                    />
                  );
                })}
            </Box>
          </Paper>
        </Box>
      </Stack>
    </StudentLayout>
  );
}
