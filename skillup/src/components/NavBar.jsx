import React, { useState, useRef, useEffect } from 'react';
import UserAvatar from './UserAvatar';
import { VIEWS } from '../constants';

const NavBar = ({
  currentUser,
  currentView,
  isRH,
  navTo,
  currentCourse,
  loadCourseDetail,
  onLogout,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const avatarMenuRef = useRef(null);

  const showBackToCourse =
    (currentView === VIEWS.PLAYER || currentView === VIEWS.QUIZ) && currentCourse;

  const handleBackToCourse = () => {
    if (currentCourse) {
      loadCourseDetail(currentCourse.id);
    }
  };

  // fecha o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className="rounded-t-xl shadow-md p-4 mb-4 sticky top-0 z-10 no-print"
      style={{ backgroundColor: 'var(--color-mid-slate)' }}
    >
      <nav className="flex justify-between items-center">
        {/* ESQUERDA – logo e navegação */}
        <div className="flex items-center space-x-6">
          <div className="text-xl font-bold text-white">SkillUp</div>
          <div className="flex space-x-2 sm:space-x-4">
            <button
              className={`nav-item ${currentView === VIEWS.HOME ? 'active-nav' : ''}`}
              onClick={() => navTo(VIEWS.HOME)}
            >
              Home
            </button>

            <button
              className={`nav-item ${
                currentView === VIEWS.CATALOG || currentView === VIEWS.COURSE_DETAIL
                  ? 'active-nav'
                  : ''
              }`}
              onClick={() => navTo(VIEWS.CATALOG)}
            >
              Catálogo
            </button>

            {isRH && (
              <button
                className={`nav-item ${
                  currentView === VIEWS.DASHBOARD ? 'active-nav' : ''
                }`}
                onClick={() => navTo(VIEWS.DASHBOARD)}
              >
                Dashboard RH
              </button>
            )}

            {/* NOVO: Admin RH */}
            {isRH && (
              <button
                className={`nav-item ${
                  currentView === VIEWS.ADMIN_RH ? 'active-nav' : ''
                }`}
                onClick={() => navTo(VIEWS.ADMIN_RH)}
              >
                Admin RH
              </button>
            )}
          </div>
        </div>

        {/* DIREITA – usuário, menu de sair e voltar para curso */}
        <div className="flex items-center space-x-3">
          <div className="flex flex-col text-right">
            <span
              id="user-display-name"
              className="text-sm font-semibold text-white"
            >
              {currentUser.name}
            </span>
            <span
              id="user-display-role"
              className="text-xs text-gray-400"
            >
              {currentUser.role}
            </span>
          </div>

          {/* Avatar + menu dropdown */}
          <div className="relative" ref={avatarMenuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <UserAvatar initials={currentUser.initials} />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-300"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-40 rounded-xl shadow-lg card py-2 z-20"
                style={{ backgroundColor: 'var(--color-mid-slate)' }}
              >
                {/* Placeholder pra futuro: Meu Perfil, Configurações, etc */}
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-[rgba(255,255,255,0.06)]"
                >
                  Sair
                </button>
              </div>
            )}
          </div>

          {/* Botão voltar para curso */}
          {showBackToCourse && (
            <button
              id="nav-back-to-course"
              className="nav-item"
              onClick={handleBackToCourse}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
