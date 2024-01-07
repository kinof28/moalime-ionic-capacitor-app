import { useSelector } from "react-redux";
import { useStudentMap } from "../../../hooks/useStudentMap";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";

const APIKey = process.env.REACT_APP_GOOGLE_API_KEY;
const MapBrowsing = () => {
  const { token, student } = useSelector((state) => state.student);
  const { data, loading } = useStudentMap(student?.id, token);
  const { t } = useTranslation();
  const lang = Cookies.get("i18next") || "en";
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: APIKey,
  });

  const pushRoute = (id) => {
    navigate("/teacher/" + id);
  };

  return (
    <>
      {isLoaded && !loading && (
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
              let subjects = "";
              teacher.TeacherSubjects?.map((subject) => {
                if (lang === "en") subjects += subject.Subject?.titleEN + "\n ";
                else subjects += subject.Subject?.titleAR + "\n ";
                return subject;
              });
              subjects = subjects.slice(0, subjects.length - 2);
              return (
                <Marker
                  key={teacher?.id}
                  position={{ lat: teacher?.lat, lng: teacher?.long }}
                  label={teacher?.firstName?.slice(0, 3)}
                  title={`${teacher?.firstName} ${teacher.lastName}\n ${t(
                    "subjects"
                  )}: ${subjects}
                `}
                  onClick={() => pushRoute(teacher.id)}
                />
              );
            })}
          </GoogleMap>
        </Box>
      )}
    </>
  );
};

export default MapBrowsing;
