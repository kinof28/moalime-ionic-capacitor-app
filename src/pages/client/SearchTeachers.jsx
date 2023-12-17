import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import FilterSearch from "../../components/client/searchList/FilterSearch";
import HeaderSearchList from "../../components/client/searchList/HeaderSearchList";
import TeacherSearchBox from "../../components/client/searchList/TeacherSearchBox";
import Navbar from "../../components/Navbar";
import { useSearchParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
export default function SearchTeachers() {
  const [searchParams, setSearchParams] = useSearchParams();

  //  side bar search

  const [gender, setGender] = useState("all");
  const [curriculum, setCurriculum] = useState("all");
  const [spackArabic, setSpeakArabic] = useState(false);
  const [isVideo, setIsVideo] = useState(false);

  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  // top bar search
  const [level, setLevel] = useState("");
  /** handel categoires */
  const [value, setValue] = useState([]);

  const { currency } = useSelector((state) => state.currency);

  const handleSideFilter = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/search/side?currency=${currency}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            videoLink: isVideo,
            gender: gender,
            LanguageId: spackArabic,
            CurriculumId: curriculum,
          }),
        }
      );
      const resData = await response.json();
      if (resData.status !== 200 && resData.status !== 201) {
        throw new Error("");
      }
      setTeachers(resData.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopFilter = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/search/top?currency=${currency}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            LevelId: level,
            subjects: [value],
          }),
        }
      );
      const resData = await response.json();
      if (resData.status !== 200 && resData.status !== 201) {
        throw new Error("");
      }
      setTeachers(resData.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function getTeachers() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/teacher/search/top?currency=${currency}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              LevelId: +searchParams.get("level"),
              subjects: searchParams
                .get("subjects")
                .split(",")
                .filter((it) => it !== ""),
            }),
          }
        );
        const resData = await response.json();
        if (resData.status !== 200 && resData.status !== 201) {
          throw new Error("");
        }
        setTeachers(resData.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    getTeachers();
  }, [searchParams]);

  return (
    <Navbar>
      <Container
        sx={{ marginBottom: "40px", marginTop: "120px", overflowX: "hidden" }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Box sx={{ marginBottom: "20px" }}>
              <HeaderSearchList
                level={level}
                setLevel={setLevel}
                value={value}
                setValue={setValue}
                onSearch={handleTopFilter}
              />
            </Box>
            {isLoading ? (
              <Loading />
            ) : (
              <>
                {teachers.length > 0 &&
                  teachers.map((teacher) => {
                    return (
                      <TeacherSearchBox
                        key={teacher.id + ",ekm"}
                        teacher={teacher}
                      />
                    );
                  })}
                {teachers.length === 0 && (
                  <Paper sx={{ padding: "16px" }}>
                    <Typography variant="h6">
                      {t("empty_search_result")}
                    </Typography>
                  </Paper>
                )}
              </>
            )}
          </Grid>
          <Grid item xs={12} md={3}>
            <FilterSearch
              gender={gender}
              setGender={setGender}
              curriculum={curriculum}
              setCurriculum={setCurriculum}
              spackArabic={spackArabic}
              setSpeakArabic={setSpeakArabic}
              isVideo={isVideo}
              setIsVideo={setIsVideo}
              onSearch={handleSideFilter}
            />
          </Grid>
        </Grid>
      </Container>
    </Navbar>
  );
}
