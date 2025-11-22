// src/App.jsx
import React, { useCallback, useState } from 'react';
import { VIEWS } from './constants';

import GlobalStyles from './components/GlobalStyles';
import NavBar from './components/NavBar';

import Login from './views/Login';
import Home from './views/Home';
import Catalog from './views/Catalog';
import CourseDetail from './views/CourseDetail';
import Player from './views/Player';
import Quiz from './views/Quiz';
import Certificate from './views/Certificate';
import DashboardRH from './views/DashboardRH';
import AdminRH from './views/AdminRH';

import {
  login as apiLogin,
  getCourseById,
  getModuleById,
  completeCourse,
} from './services/skillupApi';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState(VIEWS.LOGIN);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
    const [currentCertificate, setCurrentCertificate] = useState(null);

  const isRH = Number(currentUser?.role) === 2;

  const handleLogin = async (email, password) => {
    const user = await apiLogin(email, password);
    if (user) {
      const userIsRH = Number(user.role) === 2;
      setCurrentUser(user);
      setCurrentView(userIsRH ? VIEWS.DASHBOARD : VIEWS.HOME);
    } else {
      console.error('Usuário não encontrado.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentCourse(null);
    setCurrentModule(null);
    setQuizResult(null);
    setCurrentCertificate(null);
    setCurrentView(VIEWS.LOGIN);
  };

  const loadCourseDetail = useCallback(async (courseId) => {
    const course = await getCourseById(courseId);
    if (!course) return;
    setCurrentCourse(course);
    setCurrentView(VIEWS.COURSE_DETAIL);
  }, []);

  const loadModulePlayer = useCallback(async (moduleId) => {
    const moduleData = await getModuleById(moduleId);
    if (!moduleData) return;

    setCurrentModule(moduleData);

    if (moduleData.type === 'QUIZ') {
      // quando entrar no quiz, limpa o resultado anterior
      setQuizResult(null);
      setCurrentView(VIEWS.QUIZ);
    } else {
      setCurrentView(VIEWS.PLAYER);
    }
  }, []);

  const handleQuizFinish = async (result) => {
    setQuizResult(result);

    if (result?.passed && currentUser && currentCourse) {
      await completeCourse(currentUser.id, currentCourse.id);

      const cert = await issueCertificate(currentUser.id, currentCourse.id);
      setCurrentCertificate(cert);
    }

    setCurrentView(VIEWS.QUIZ);
  };

  const loadCertificate = useCallback(() => {
    setCurrentView(VIEWS.CERTIFICATE);
  }, []);

  const navTo = useCallback((view) => {
    setCurrentView(view);

    // quando voltar pras views principais, limpa curso/módulo/resultado
    if ([VIEWS.HOME, VIEWS.CATALOG, VIEWS.DASHBOARD].includes(view)) {
      setCurrentCourse(null);
      setCurrentModule(null);
      setQuizResult(null);
      setCurrentCertificate(null);
    }
  }, []);

  const renderView = () => {
    const viewProps = {
      currentUser,
      currentCourse,
      currentModule,
      loadCourseDetail,
      loadModulePlayer,
      navTo,
      isRH,
      loadCertificate,
      currentCertificate,
    };

    switch (currentView) {
      case VIEWS.HOME:
        return <Home {...viewProps} />;
      case VIEWS.CATALOG:
        return <Catalog {...viewProps} />;
      case VIEWS.COURSE_DETAIL:
        return <CourseDetail {...viewProps} />;
      case VIEWS.PLAYER:
        return <Player {...viewProps} />;
      case VIEWS.QUIZ:
        return (
          <Quiz
            {...viewProps}
            quizResult={quizResult}
            setQuizResult={setQuizResult}
            onFinish={handleQuizFinish}
            loadCertificate={loadCertificate}
          />
        );
      case VIEWS.CERTIFICATE:
        return <Certificate {...viewProps} />;
      case VIEWS.DASHBOARD:
        return <DashboardRH {...viewProps} />;
      case VIEWS.ADMIN_RH:
        return <AdminRH {...viewProps} />; // NOVO
      default:
        return <div className="text-white p-4">Carregando...</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-start p-4">
      <GlobalStyles />

      {/* LOGIN */}
      {(currentView === VIEWS.LOGIN || !currentUser) && (
        <div id="login-form-container" className="w-full flex justify-center mt-8">
          <Login onLogin={handleLogin} />
        </div>
      )}

      {/* APP LOGADO */}
      {currentUser && currentView !== VIEWS.LOGIN && (
        <div
          id="app-container"
          className="w-full mt-4 rounded-xl shadow-2xl max-w-8x1 mx-auto card"
        >
          <NavBar
            currentUser={currentUser}
            currentView={currentView}
            isRH={isRH}
            navTo={navTo}
            currentCourse={currentCourse}
            loadCourseDetail={loadCourseDetail}
            onLogout={handleLogout}
          />

          <div
            id="views-container"
            className="p-6 rounded-b-xl shadow-2xl min-h-[60vh] card"
          >
            {renderView()}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
