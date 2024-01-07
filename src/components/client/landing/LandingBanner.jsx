import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  styled,
  Typography,
} from "@mui/material";
import React from "react";
import cover from "../../../images/Rectangle7.png";
import { useTranslation } from "react-i18next";
import { useSubjectCategoreis } from "../../../hooks/useSubjectCategoreis";
import { useLevels } from "../../../hooks/useLevels";
import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Wrapper = styled(Box)({
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  color: "white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  height: "80vh",
});

export default function LandingBanner() {
  const lang = Cookies.get("i18next");
  const { t } = useTranslation();
  const categoriesData = useSubjectCategoreis();
  const levelsData = useLevels();

  /** handle level */
  const [level, setLevel] = React.useState("");
  const handleChange = (event) => {
    setLevel(event.target.value);
  };

  /** handel categoires */
  const [value, setValue] = useState([]);

  const navigate = useNavigate();
  function searchNavigate() {
    navigate(`/teachers/search?level=${level}&&subjects=${[value]}`);
  }

  return (
    <Wrapper sx={{ backgroundImage: `url(${cover})` }} className="overlay">
      <Container>
        <Typography
          sx={{
            marginBottom: "70px",
            fontSize: { md: "28px", xs: "18px" },
            position: "relative",
            fontWeight: "bold",
          }}
          color="secondary"
        >
          {t("landing_title")}
        </Typography>
        <Grid
          spacing={2}
          alignItems="center"
          sx={{
            backgroundColor: "white",
            padding: "15px",
            borderRadius: "6px",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            gap: "15px",
            zIndex: 3,
          }}
        >
          <Grid item xs={12} md={6} lg={5} sx={{ width: "100%" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                {t("categories")}
              </InputLabel>
              <Select
                sx={{ textAlign: "start" }}
                placeholder="level"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                label={t("studylevel")}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 48 * 3 + 8,
                      width: 160,
                    },
                  },
                }}
              >
                {!categoriesData.isLoading &&
                  categoriesData.data.data.length > 0 &&
                  categoriesData.data.data.map((item, index) => {
                    return (
                      <MenuItem key={index + "zas"} value={item.id}>
                        {lang === "ar" ? item.titleAR : item.titleEN}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} lg={5} sx={{ width: "100%" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                {t("studylevel")}
              </InputLabel>
              <Select
                sx={{ textAlign: "start" }}
                placeholder="level"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={level}
                onChange={handleChange}
                label={t("studylevel")}
                MenuProps={{
                  elevation: 0.3,
                  PaperProps: {
                    style: {
                      maxHeight: 48 * 3 + 8,
                      width: 160,
                    },
                  },
                }}
              >
                {!levelsData.isLoading &&
                  levelsData.data.data.length > 0 &&
                  levelsData.data.data.map((item, index) => {
                    return (
                      <MenuItem key={index + "zas"} value={item.id}>
                        {lang === "ar" ? item.titleAR : item.titleEN}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12} lg={2} sx={{ width: "100%" }}>
            <Button variant="contained" fullWidth onClick={searchNavigate}>
              {t("search")}
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Wrapper>
  );
}
