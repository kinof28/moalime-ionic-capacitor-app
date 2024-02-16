import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import Cookies from "js-cookie";
import { Navigate, Route, Routes } from "react-router-dom";
import TeacherAbout from "./pages/teacher/TeacherAbout";
import TeacherPhoto from "./pages/teacher/TeacherPhoto";
import AdminHome from "./pages/admin/AdminHome";
import Subjects from "./pages/admin/Subjects";
import AdditionalInformation from "./pages/teacher/AdditionalInformation";
import TeacherSubjects from "./pages/teacher/TeacherSubjects";
import TeacherResume from "./pages/teacher/TeacherResume";
import InsertCurriculums from "./pages/admin/InsertCurriculums";
import TeacherAvailability from "./pages/teacher/TeacherAvailability";
import TeacherDescription from "./pages/teacher/TeacherDescription";
import TeacherVideo from "./pages/teacher/TeacherVideo";
import Login from "./pages/auth/Login";
import StudentFirstStep from "./pages/auth/registerStudent/StudentFirstStep";
import StudentSecondStep from "./pages/auth/registerStudent/StudentSecondStep";
import StudentThirdStep from "./pages/auth/registerStudent/StudentThirdStep";
import StudentFouthStep from "./pages/auth/registerStudent/StudentFouthStep";
import TeacherFirstStep from "./pages/auth/registerTeacher/TeacherFirstStep";
import TeacherSecondStep from "./pages/auth/registerTeacher/TeacherSecondStep";
import TeacherThirdStep from "./pages/auth/registerTeacher/TeacherThirdStep";
import SingleTeacher from "./pages/client/SingleTeacher";
import SearchTeachers from "./pages/client/SearchTeachers";
import StudentProfile from "./pages/student/StudentProfile";
import StudentSettings from "./pages/student/StudentSettings";
import AdminLogin from "./pages/admin/AdminLogin";
import TeachersApprove from "./pages/admin/TeachersApprove";
import HomeParent from "./pages/parent/HomeParent";
import Home from "./pages/client/Home";
import { useSelector, useDispatch } from "react-redux";
import Landing from "./pages/client/Landing";
import SearchFilterTeacher from "./pages/client/SearchFilterTeacher";
import ParentRegister from "./pages/parent/ParentRegister";
import AdminLevels from "./pages/admin/AdminLevels";
import AdminClasses from "./pages/admin/AdminClasses";
import AdminCurriculums from "./pages/admin/AdminCurriculums";
import AdminSubjectCategories from "./pages/admin/AdminSubjectCategories";
import AdminParentStudent from "./pages/admin/AdminParentStudent";
import StudentMessages from "./pages/student/StudentMessages";
import StudentLessons from "./pages/student/StudentLessons";
import TeacherMessages from "./pages/teacher/TeacherMessages";
import StudentPhoto from "./pages/student/StudentPhoto";
import AboutUs from "./pages/client/AboutUs";
import Privacy from "./pages/client/Privacy";
import Terms from "./pages/client/Terms";
import StudentCredit from "./pages/student/StudentCredit";
import AdminBookedLessons from "./pages/admin/AdminBookedLessons";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminTeachers from "./pages/admin/AdminTeachers";
import DetailsBook from "./pages/student/Book/DetailsBook";
import PayNow from "./pages/student/PayNow";
import SuccessCharge from "./pages/student/SuccessCharge";
import FailCharge from "./pages/student/FailCharge";
import StudentPaymentHistory from "./pages/student/StudentPaymentHistory";
import SuccessPayment from "./pages/student/SuccessPayment";
import FailPayment from "./pages/student/FailPayment";
import AdminStduents from "./pages/admin/AdminStduents";
import AdminStudentHistory from "./pages/admin/AdminStudentHistory";
import AdminTeacherDues from "./pages/admin/AdminTeacherDues";
import TeacherLessons from "./pages/teacher/TeacherLessons";
import TeacherNotifications from "./pages/teacher/TeacherNotifications";
import TeacherCredit from "./pages/teacher/TeacherCredit";
import ParentStudent from "./pages/parent/ParentStudent";
import { changeCurrency } from "./redux/currency";
import AdminSingleTeacher from "./pages/admin/AdminSingleTeacher";
import MapBrowser from "./pages/client/MapBrowser";
import AdminSocialMedia from "./pages/admin/AdminSocialMedia";
import AdminAddProfit from "./pages/admin/AdminAddProfit";
import ForgetPasswordFirstStep from "./pages/auth/forgetPassword/ForgetPassFirstStep";
import AdminMessages from "./pages/admin/AdminMessages";
import SingleBookedLesson from "./pages/admin/SingleBookedLesson";
import AdminHistory from "./pages/admin/AdminHistory";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import StudentTeachers from "./pages/student/StudentTeachers";
import AdminNewStudent from "./pages/admin/AdminNewStudent";
import AdminNewTeacher from "./pages/admin/AdminNewTeacher";
import AdminEditTeacher from "./pages/admin/AdminEditTeacher";
import AdminEditStudent from "./pages/admin/AdminEditStudent";
import AdminCheckoutRequests from "./pages/admin/AdminCheckoutRequests";
import AdminEditTeacherPhoto from "./pages/admin/AdminEditTeacherPhoto";
import AdminEditTeacherAdditionalInfo from "./pages/admin/AdminEditTeacherAdditionalInfo";
import AdminEditTeacherAvailability from "./pages/admin/AdminEditTeacherAvailability";
import AdminEditTeacherDescription from "./pages/admin/AdminEditTeacherDescription";
import AdminEditTeacherResume from "./pages/admin/AdminEditTeacherResume";
import AdminEditTeacherSubjects from "./pages/admin/AdminEditTeacherSubjects";
import AdminEditTeacherVideo from "./pages/admin/AdminEditTeacherVideo";
import StudentFinancialRecords from "./pages/student/StudentFinancialRecords";
import StudentNotifications from "./pages/student/StudentNotifications";

const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#005B8E",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#FFC93C",
      contrastText: "#ffffff",
    },
    Gray: {
      main: "#F6F6F6",
      contrastText: "#6D6D6D",
    },
    Blue: {
      main: "#ffffff33",
      contrastText: "#ffffff",
    },
  },
});

function App() {
  const dispatch = useDispatch();
  const queryClient = new QueryClient();

  useEffect(() => {
    const lang = Cookies.get("i18next") || "en";
    if (lang === "ar") {
      document.body.dir = "rtl";
    } else {
      document.body.dir = "ltr";
    }
  }, []);

  const { admin } = useSelector((state) => state.admin);
  const { teacher } = useSelector((state) => state.teacher);
  const { parent } = useSelector((state) => state.parent);
  const { student } = useSelector((state) => state.student);
  const { currency } = useSelector((state) => state.currency);

  useEffect(() => {
    async function getCurrency() {
      const response = await fetch(`https://ipapi.co/json/`);
      const data = await response.json();
      dispatch(changeCurrency({ currency: data?.currency }));
    }
    if (!currency) {
      getCurrency();
    }
  }, []);

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <Routes>
            {/** client pages */}
            <Route path="/" element={<Home />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="teachers/search" element={<SearchTeachers />} />
            <Route path="teacher/:id" element={<SingleTeacher />} />
            <Route
              path="/filter/:subjectId"
              element={<SearchFilterTeacher />}
            />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="PrivacyPolicy" element={<Privacy />} />
            <Route path="TermsAndConditions" element={<Terms />} />
            <Route
              path="map-browser"
              element={student ? <MapBrowser /> : <Navigate to="/" />}
            />

            {/** login page */}
            <Route path="login" element={<Login />} />

            {/** student auth */}
            <Route
              path="studentregister/step1"
              element={<StudentFirstStep />}
            />
            <Route
              path="studentregister/step2"
              element={<StudentSecondStep />}
            />
            <Route
              path="studentregister/step3"
              element={<StudentThirdStep />}
            />
            <Route
              path="studentregister/step4"
              element={<StudentFouthStep />}
            />

            {/** teacher auth */}
            <Route
              path="teacherRegister/step1"
              element={<TeacherFirstStep />}
            />
            <Route
              path="teacherRegister/step2"
              element={<TeacherSecondStep />}
            />
            <Route
              path="teacherRegister/step3"
              element={<TeacherThirdStep />}
            />
            <Route
              path="forgetPassword/step1"
              element={<ForgetPasswordFirstStep />}
            />

            {/** student pages */}
            <Route
              path="student/profile"
              element={student ? <StudentProfile /> : <Navigate to="/login" />}
            />
            <Route
              path="student/settings"
              element={student ? <StudentSettings /> : <Navigate to="/login" />}
            />
            <Route
              path="/student/messages"
              element={student ? <StudentMessages /> : <Navigate to="/login" />}
            />
            <Route
              path="/student/lessons"
              element={student ? <StudentLessons /> : <Navigate to="/login" />}
            />
            <Route
              path="/student/profile_photo"
              element={student ? <StudentPhoto /> : <Navigate to="/login" />}
            />
            <Route
              path="/student/credit"
              element={student ? <StudentCredit /> : <Navigate to="/login" />}
            />
            <Route
              path="/book/:teacherId"
              element={student ? <DetailsBook /> : <Navigate to="/login" />}
            />
            <Route
              path="/pay-now"
              element={student ? <PayNow /> : <Navigate to="/login" />}
            />
            <Route
              path="/student/payment-history"
              element={
                student ? <StudentPaymentHistory /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/student/financial-records"
              element={
                student ? <StudentFinancialRecords /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/student/teachers"
              element={student ? <StudentTeachers /> : <Navigate to="/login" />}
            />
            <Route
              path="student/notifications"
              element={
                student ? <StudentNotifications /> : <Navigate to="/login" />
              }
            />
            {/** teacher pages */}
            <Route
              path="teacher/about"
              element={teacher ? <TeacherAbout /> : <Navigate to="/login" />}
            />
            <Route
              path="teacher/photo"
              element={teacher ? <TeacherPhoto /> : <Navigate to="/login" />}
            />
            <Route
              path="teacher/additionalInformation"
              element={
                teacher ? <AdditionalInformation /> : <Navigate to="/login" />
              }
            />
            <Route
              path="teacher/subjects"
              element={teacher ? <TeacherSubjects /> : <Navigate to="/login" />}
            />
            <Route
              path="teacher/resume"
              element={teacher ? <TeacherResume /> : <Navigate to="/login" />}
            />
            <Route
              path="teacher/availability"
              element={
                teacher ? <TeacherAvailability /> : <Navigate to="/login" />
              }
            />
            <Route
              path="teacher/description"
              element={
                teacher ? <TeacherDescription /> : <Navigate to="/login" />
              }
            />
            <Route
              path="teacher/video"
              element={teacher ? <TeacherVideo /> : <Navigate to="/login" />}
            />
            <Route
              path="teacher/messages"
              element={teacher ? <TeacherMessages /> : <Navigate to="/login" />}
            />
            <Route
              path="teacher/lessons"
              element={teacher ? <TeacherLessons /> : <Navigate to="/login" />}
            />
            <Route
              path="teacher/notifications"
              element={
                teacher ? <TeacherNotifications /> : <Navigate to="/login" />
              }
            />
            <Route
              path="teacher/credit"
              element={teacher ? <TeacherCredit /> : <Navigate to="/login" />}
            />
            <Route
              path="teacher/students"
              element={teacher ? <TeacherStudents /> : <Navigate to="/login" />}
            />
            {/** admin pages */}
            <Route
              path="admin/login"
              element={!admin ? <AdminLogin /> : <Navigate to="/admin" />}
            />
            <Route
              path="admin"
              element={admin ? <AdminHome /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="admin/levels"
              element={admin ? <AdminLevels /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="admin/years"
              element={
                admin ? <AdminClasses /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/curriculums"
              element={
                admin ? <AdminCurriculums /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/subjects"
              element={admin ? <Subjects /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="admin/categories"
              element={
                admin ? (
                  <AdminSubjectCategories />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
            <Route
              path="admin/Curriculums_insert"
              element={
                admin ? <InsertCurriculums /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/teachers_approve"
              element={
                admin ? <TeachersApprove /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/parent-student"
              element={
                admin ? <AdminParentStudent /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/booked-lessons"
              element={
                admin ? <AdminBookedLessons /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/payments"
              element={
                admin ? <AdminPayments /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/teachers"
              element={
                admin ? <AdminTeachers /> : <Navigate to="/admin/login" />
              }
            />

            <Route
              path="admin/students"
              element={
                admin ? <AdminStduents /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/social-media"
              element={
                admin ? <AdminSocialMedia /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/add-profit"
              element={
                admin ? <AdminAddProfit /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/student/:id/payment"
              element={
                admin ? <AdminStudentHistory /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/teacher/:id/dues"
              element={
                admin ? <AdminTeacherDues /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/teacher/:teacherId"
              element={
                admin ? <AdminSingleTeacher /> : <Navigate to="/admin/login" />
              }
            />
            {/* Edited by Abdelwahab */}
            <Route
              path="admin/messages"
              element={
                admin ? <AdminMessages /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/history"
              element={
                admin ? <AdminHistory /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/booked-lesson/:bookedLessonId"
              element={
                admin ? <SingleBookedLesson /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/new/student"
              element={
                admin ? <AdminNewStudent /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/new/teacher"
              element={
                admin ? <AdminNewTeacher /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/edit/student/:studentId"
              element={
                admin ? <AdminEditStudent /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/edit/teacher/:teacherId"
              element={
                admin ? <AdminEditTeacher /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="admin/edit/teacher/photo/:teacherId"
              element={
                admin ? (
                  <AdminEditTeacherPhoto />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
            <Route
              path="admin/edit/teacher/additionalInformation/:teacherId"
              element={
                admin ? (
                  <AdminEditTeacherAdditionalInfo />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
            <Route
              path="admin/edit/teacher/availability/:teacherId"
              element={
                admin ? (
                  <AdminEditTeacherAvailability />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
            <Route
              path="admin/edit/teacher/description/:teacherId"
              element={
                admin ? (
                  <AdminEditTeacherDescription />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
            <Route
              path="admin/edit/teacher/resume/:teacherId"
              element={
                admin ? (
                  <AdminEditTeacherResume />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
            <Route
              path="admin/edit/teacher/subjects/:teacherId"
              element={
                admin ? (
                  <AdminEditTeacherSubjects />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
            <Route
              path="admin/edit/teacher/video/:teacherId"
              element={
                admin ? (
                  <AdminEditTeacherVideo />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
            <Route
              path="admin/checkout-requests"
              element={
                admin ? (
                  <AdminCheckoutRequests />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
            {/** parent pages */}
            <Route path="parent/register" element={<ParentRegister />} />
            <Route
              path="parent"
              element={parent ? <HomeParent /> : <Navigate to="/" />}
            />
            <Route
              path="parent-dash/student/:id"
              element={parent ? <ParentStudent /> : <Navigate to="/" />}
            />

            {/** success and fail pages */}
            <Route path="/success-charge" element={<SuccessCharge />} />
            <Route path="/fail-charge" element={<FailCharge />} />
            <Route path="/success-payment" element={<SuccessPayment />} />
            <Route path="/fail-payment" element={<FailPayment />} />
            <Route />
          </Routes>
        </ThemeProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
