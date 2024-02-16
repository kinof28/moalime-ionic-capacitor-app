import { useSelector } from "react-redux";
import { useStudentMap } from "../../../hooks/useStudentMap";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { deepOrange } from "@mui/material/colors";

const APIKey = process.env.REACT_APP_GOOGLE_API_KEY;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const MapBrowsing = () => {
  const { token, student } = useSelector((state) => state.student);
  const { data, loading } = useStudentMap(student?.id, token);
  const { t } = useTranslation();
  const lang = Cookies.get("i18next") || "en";
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const handleOpen = (teacher) => {
    setOpen(true);
    setTeacher(teacher);
    setSubjects(getSubjects(teacher));
  };
  const handleClose = () => setOpen(false);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: APIKey,
  });

  const pushRoute = (id) => {
    navigate("/teacher/" + id);
  };
  const getSubjects = (teacher) => {
    let subjects = [];
    teacher.TeacherSubjects?.map((subject) => {
      if (lang === "en") subjects.push(subject.Subject?.titleEN);
      else subjects.push(subject.Subject?.titleAR);
      return subject;
    });
    return subjects;
  };
  return (
    <>
      {isLoaded && !loading && (
        <>
          <Box width="100%" height="100vh" sx={{ marginTop: "60px" }}>
            <GoogleMap
              mapContainerStyle={{
                width: "100%",
                height: "100%",
              }}
              center={{ lat: student?.lat, lng: student?.long }}
              zoom={10}
              options={{
                zoomControl: false,
                fullscreenControl: false,
                streetViewControl: false,
                mapTypeControl: false,
              }}
            >
              {data?.result?.map((teacher) => {
                let subjects = getSubjects(teacher);
                return (
                  <Marker
                    key={teacher?.id}
                    position={{ lat: teacher?.lat, lng: teacher?.long }}
                    label={teacher?.firstName?.slice(0, 3)}
                    title={`${teacher?.firstName} ${teacher.lastName}\n ${t(
                      "subjects"
                    )}: ${subjects.join("\n")}
                `}
                    onClick={() => handleOpen(teacher)}
                  />
                );
              })}
            </GoogleMap>
          </Box>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexDirection: lang === "ar" ? "row" : "row-revert",
                }}
                onClick={() => pushRoute(teacher?.id)}
              >
                <Avatar
                  src={`${process.env.REACT_APP_API_KEY}images/${teacher?.image}`}
                  alt={teacher?.firstName}
                  sx={{
                    width: "95px",
                    height: "95px",
                    fontSize: "36px",
                    bgcolor: deepOrange[500],
                  }}
                />
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  {teacher?.firstName + " " + teacher?.lastName}
                </Typography>
              </Box>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <span style={{ fontWeight: "bold" }}>
                  {t("subjects") + ": "}
                </span>
                {subjects?.join(",\t")}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mb: 1 }}>
                <span style={{ fontWeight: "bold" }}>{t("city") + ": "}</span>
                {teacher?.city},
                <span style={{ fontWeight: "bold" }}>
                  {t("country") + ": "}
                </span>
                {teacher?.country}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  marginTop: "5px",
                  width: "100%",
                }}
                onClick={() => pushRoute(teacher?.id)}
              >
                View details
              </Button>
            </Box>
          </Modal>
        </>
      )}
    </>
  );
};

export default MapBrowsing;
