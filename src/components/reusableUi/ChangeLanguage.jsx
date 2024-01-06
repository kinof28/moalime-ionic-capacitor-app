import React from "react";
import { useNavigate } from "react-router-dom";
import i18next from "i18next";
import Flag from "react-world-flags";
import { useTranslation } from "react-i18next";

import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
export default function ChangeLanguage({ lang }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const languages = [
    {
      code: "en",
      name: t("english"),
      country_code: "gb",
    },
    {
      code: "ar",
      name: t("arabic"),
      country_code: "SAU",
      dir: "rtl",
    },
  ];
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClose = (code) => {
    i18next.changeLanguage(code);
    navigate(0);
  };

  const outClick = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <IconButton
        sx={{ color: "white" }}
        onClick={handleClick}
        disableTouchRipple
        disableRipple
      >
        <Box sx={{ display: "flex", columnGap: "6px", alignItems: "center" }}>
          <Flag
            code={languages.find((l) => l.code === lang).country_code}
            height={20}
            width={30}
          />
          {/* <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "600",
              display: { xs: "none" },
            }}
          >
            {languages.find((l) => l.code === lang).name}
          </Typography> */}
        </Box>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={outClick}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        elevation={0.5}
      >
        {languages.map((lang) => {
          return (
            <MenuItem
              onClick={() => handleClose(lang.code)}
              key={lang.name}
              sx={{ display: "flex", columnGap: "6px", alignItems: "center" }}
            >
              <Flag code={lang.country_code} height={20} width={30} />
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {lang.name}
              </Typography>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
