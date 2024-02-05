import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useTranslation } from "react-i18next";
import {
  Box,
  Container,
  Divider,
  Grid,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import Conversaition from "../../components/student/Conversaition";
import { useSelector } from "react-redux";
import { collection, query, onSnapshot, where, doc } from "firebase/firestore";
import { db } from "../../firebase";
import ContactPersonTeacher from "../../components/reusableUi/ContactPersonTeacher";
import lgo from "../../images/messge.jpg";

const Image = styled("img")({
  width: "160px",
});

export default function TeacherMessages() {
  const { t } = useTranslation();
  const [conversaition, setConversaition] = useState([]);
  const { teacher } = useSelector((state) => state.teacher);

  useEffect(() => {
    const q = query(
      collection(db, "chats"),
      where("teacherId", "==", `${teacher.id}`)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let conv = [];
      querySnapshot.forEach((doc) => {
        conv.push({ ...doc.data(), id: doc.id });
      });
      let temp = conv.sort((a, b) => b.lastmessage - a.lastmessage);
      setConversaition(temp);
    });
    return () => unsubscribe();
  }, [teacher.id]);

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
    <Navbar>
      <Container
        sx={{ marginBottom: "50px", marginTop: "120px", overflow: "hidden" }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <Box>
              <Paper sx={{ paddingY: "20px" }}>
                <Typography sx={{ paddingX: "20px" }}>
                  {t("messages")}
                </Typography>
                <Divider sx={{ marginY: "10px" }} />
                <Box sx={{ paddingX: "20px" }}>
                  {conversaition.length > 0 &&
                    conversaition.map((item, index) => {
                      return (
                        <ContactPersonTeacher
                          item={item}
                          key={index + "k1"}
                          selectChat={() => setChatId(item.id)}
                          lastMessage={item.messages[item.messages.length - 1]}
                          active={item.id == chatId}
                        />
                      );
                    })}
                </Box>
              </Paper>
            </Box>
          </Grid>
          <Grid item xs={12} lg={8}>
            {chatId ? (
              <>
                <Conversaition messages={messages} />
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
          </Grid>
        </Grid>
      </Container>
    </Navbar>
  );
}
