import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { Link, useNavigate } from "react-router-dom";
import ChangeLanguage from "./reusableUi/ChangeLanguage";
import {
  Badge,
  Button,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  styled,
} from "@mui/material";
import SelectCurrency from "./reusableUi/SelectCurrency";
import logoImage from "../images/logo.png";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { logoutTeacher } from "../redux/teacherSlice";
import { logoutParent } from "../redux/parentSlice";
import cookies from "js-cookie";
import { studentLogout } from "../redux/studentSlice";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import EmailIcon from "@mui/icons-material/Email";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import Groups2Icon from "@mui/icons-material/Groups2";
import call from "../images/callsvg.svg";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useSocialMedia } from "../hooks/useSocialMedia";

const drawerWidth = 240;

const ImageLogo = styled("img")({
  height: "30px",
  objectFit: "cover",
  padding: 5,
  margin: "0px 10px",
});

const ImageCall = styled("img")({
  width: "18px",
  height: "18px",
});

function Navbar(props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { teacher } = useSelector((state) => state.teacher);
  const { parent } = useSelector((state) => state.parent);
  const lang = cookies.get("i18next") || "en";
  const { student } = useSelector((state) => state.student);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  function handleTeacherLogout() {
    dispatch(logoutTeacher());
    navigate("/login");
  }

  function handleStudentLogout() {
    dispatch(studentLogout());
    navigate("/login");
  }

  const [notSeen, setNotSeen] = React.useState(0);
  React.useEffect(() => {
    if (teacher) {
      const q = query(
        collection(db, "Notifications"),
        where("TeacherId", "==", `${teacher.id}`)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let conv = [];
        querySnapshot.forEach((doc) => {
          conv.push({ ...doc.data(), id: doc.id });
        });
        setNotSeen(conv.filter((not) => not.seen === false).length);
      });
      return () => unsubscribe();
    }
  }, [teacher]);

  const container =
    window !== undefined ? () => window().document.body : undefined;

  /** teacher profile links */
  const teacherProfile = [
    {
      title: t("profile"),
      link: "/about",
      icon: <ManageAccountsIcon fontSize="small" />,
    },
    {
      title: t("lessons"),
      link: "/lessons",
      icon: <CastForEducationIcon fontSize="small" />,
    },
    {
      title: t("my_students"),
      link: "/students",
      icon: <Groups2Icon fontSize="small" />,
    },
    {
      title: t("messages"),
      link: "/messages",
      icon: <EmailIcon fontSize="small" />,
    },
    {
      title: t("credit"),
      link: "/credit",
      icon: <CreditCardIcon fontSize="small" />,
    },
  ];

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ textAlign: "center", height: "100vh", backgroundColor: "#005B8E" }}
    >
      <Typography variant="h6" sx={{ my: 2 }}>
        <ImageLogo src={logoImage} />
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <ListItemText primary="" />
          </ListItemButton>
        </ListItem>
        <a href="mailto:info@moalime.com">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              columnGap: "4px",
              justifyContent: "center",
              color: "white",
              marginBottom: "12px",
            }}
          >
            <EmailOutlinedIcon sx={{ fontSize: "15px" }} />
            <Typography sx={{ fontSize: "14px" }}>info@moalime.com</Typography>
          </Box>
        </a>
        <a
          target="_black"
          href="https://api.whatsapp.com/send?phone=96894414423"
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              columnGap: "8px",
              justifyContent: "center",
              color: "white",
              marginBottom: "12px",
            }}
          >
            <ImageCall src={call} />
            <Typography sx={{ fontSize: "14px" }}>{t("call")}</Typography>
          </Box>
        </a>
        <SelectCurrency />
        {teacher && (
          <>
            <Link to="/teacher/notifications">
              <ListItem
                sx={{
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {t("notifications")}
              </ListItem>
            </Link>
            {teacherProfile.map((item, index) => {
              return (
                <Link to={`/teacher${item.link}`} key={index + "a1"}>
                  <ListItem
                    sx={{
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {item.title}
                  </ListItem>
                </Link>
              );
            })}
            <Link to="/" onClick={handleTeacherLogout}>
              <ListItem
                sx={{
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {t("logout")}
              </ListItem>
            </Link>
          </>
        )}
        {student && (
          <>
            <Link to="/student/profile">
              <ListItem
                sx={{
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {t("profile")}
              </ListItem>
            </Link>
            <Link to="/" onClick={handleStudentLogout}>
              <ListItem
                sx={{
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {t("logout")}
              </ListItem>
            </Link>
          </>
        )}
        {parent && (
          <>
            <Link to="/" onClick={() => dispatch(logoutParent())}>
              <ListItem
                sx={{
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {t("logout")}
              </ListItem>
            </Link>
          </>
        )}
        {!teacher && !parent && !student && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              sx={{
                my: 1,
                color: "white",
                display: "block",
                textTransform: "capitalize",
                padding: "1px 18px",
              }}
              variant="text"
              onClick={() => navigate("/login")}
            >
              {t("login")}
            </Button>
            <Button
              onClick={() => navigate("/teacherRegister/step1")}
              sx={{
                color: "white",
                display: "block",
                textTransform: "capitalize",
                padding: "1px 13px",
                backgroundColor: "#ffffff33",
                fontSize: "14px",
                height: "50px",
                borderRadius: "10px",
              }}
              variant="text"
            >
              {t("becometeacher")}
            </Button>
          </Box>
        )}
      </List>
    </Box>
  );
  const { data } = useSocialMedia();
  const links = data?.data;
  const whatsAppLink = links
    ?.filter((obj) => obj.type === "Whatsapp")
    .map((obj) => obj.link);

  return (
    <Box
      sx={{ display: "flex", alignItems: "baseline", justifyContent: "center" }}
    >
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              paddingY: "10px",
              alignItems: "center",
            }}
          >
            <Link to="/">
              <ImageLogo src={logoImage} />
            </Link>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              columnGap: "10px",
            }}
          >
            <Link to="/landing">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  marginX: 2,
                }}
              >
                <Typography sx={{ fontSize: "14px" }}>
                  {t("search_for_teachers")}
                </Typography>
                <SearchIcon />
              </Box>
            </Link>
            <a href="mailto:info@moalime.com">
              <Box
                sx={{ display: "flex", alignItems: "center", columnGap: "4px" }}
              >
                <EmailOutlinedIcon sx={{ fontSize: "15px" }} />
                <Typography sx={{ fontSize: "14px" }}>
                  info@moalime.com
                </Typography>
              </Box>
            </a>
            <a target="_black" href={whatsAppLink}>
              <Box
                sx={{ display: "flex", alignItems: "center", columnGap: "8px" }}
              >
                <ImageCall src={call} />
                <Typography sx={{ fontSize: "14px" }}>{t("call")}</Typography>
              </Box>
            </a>
            <ChangeLanguage lang={lang} />
            <SelectCurrency />
            {!teacher && !parent && !student && (
              <>
                <Button
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    textTransform: "capitalize",
                    padding: "1px 18px",
                  }}
                  variant="text"
                  onClick={() => navigate("/login")}
                >
                  {t("login")}
                </Button>
                <Button
                  onClick={() => navigate("/teacherRegister/step1")}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    textTransform: "capitalize",
                    padding: "1px 13px",
                    backgroundColor: "#ffffff33",
                    fontSize: "14px",
                    height: "50px",
                    borderRadius: "10px",
                  }}
                  variant="text"
                >
                  {t("becometeacher")}
                </Button>
              </>
            )}
            {teacher && (
              <Stack alignItems={"center"} direction="row" gap="12px">
                <Box
                  sx={{
                    width: "35px",
                    height: "35px",
                    backgroundColor: "#fc5a5a",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/teacher/notifications")}
                >
                  <Badge badgeContent={notSeen} color="success">
                    <NotificationsIcon sx={{ fontSize: "22px" }} />
                  </Badge>
                </Box>
                <Box>
                  <Box
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      columnGap: "6px",
                    }}
                    onClick={handleClick}
                  >
                    <Box
                      sx={{
                        width: "35px",
                        height: "35px",
                        backgroundColor: "#ffffff33",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                      }}
                    >
                      <PersonIcon sx={{ fontSize: "22px" }} />
                    </Box>
                    {teacher?.firstName
                      ? teacher?.firstName + " " + teacher?.lastName
                      : t("username")}
                  </Box>
                  <Menu
                    id="account-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&:before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                  >
                    {teacherProfile.map((item) => {
                      return (
                        <MenuItem
                          sx={{ fontSize: "14px" }}
                          onClick={() => {
                            navigate(`/teacher${item.link}`);
                            handleClose();
                          }}
                        >
                          <ListItemIcon>{item.icon}</ListItemIcon>
                          {item.title}
                        </MenuItem>
                      );
                    })}
                    <MenuItem
                      sx={{ fontSize: "14px" }}
                      onClick={handleTeacherLogout}
                    >
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      {t("logout")}
                    </MenuItem>
                  </Menu>
                </Box>
              </Stack>
            )}
            {student && (
              <Stack direction="row" alignItems={"center"}>
                <Button
                  color="Blue"
                  variant="contained"
                  sx={{ mx: "8px" }}
                  onClick={() => navigate("/student/profile")}
                >
                  {student?.name ? student.name : t("username")}
                </Button>
                <Button
                  color="Blue"
                  variant="contained"
                  onClick={handleStudentLogout}
                >
                  {t("logout")}
                </Button>
              </Stack>
            )}
            {parent && (
              <Stack alignItems={"center"}>
                <Button
                  color="Blue"
                  variant="contained"
                  onClick={() => dispatch(logoutParent())}
                >
                  {t("logout")}
                </Button>
              </Stack>
            )}
          </Box>
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              columnGap: "10px",
            }}
          >
            <Link to="/landing">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <Typography sx={{ fontSize: "10px" }}>
                  {t("search_for_teachers")}
                </Typography>
                <SearchIcon />
              </Box>
            </Link>
            <ChangeLanguage lang={lang} />
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ paddingY: 0, width: "100%" }}>
        {props.children}
      </Box>
    </Box>
  );
}

Navbar.propTypes = {
  window: PropTypes.func,
};

export default Navbar;
