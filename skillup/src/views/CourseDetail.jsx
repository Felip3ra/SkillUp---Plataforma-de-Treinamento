// src/views/CourseDetail.jsx
import React, { useEffect, useState } from 'react';
import { VIEWS } from '../constants';
import { getModulesByCourse, getModuleCompletionsByUser } from '../services/skillupApi';
import ModuleItem from '../components/ModuleItem';

const CourseDetail = ({ currentCourse, currentUser, navTo, loadModulePlayer }) => {
  const [modules, setModules] = useState([]);
  const [completedModules, setCompletedModules] = useState([]);

  useEffect(() => {
    async function load() {
      if (!currentCourse || !currentUser) return;

      const [mods, completions] = await Promise.all([
        getModulesByCourse(currentCourse.id),
        getModuleCompletionsByUser(currentUser.id),
      ]);

      setModules(mods);
      setCompletedModules(completions);
    }

    load();
  }, [currentCourse, currentUser]);

  if (!currentCourse) {
    return (
      <div className="text-center text-gray-400">
        Selecione um curso no catálogo.
      </div>
    );
  }

  const isModuleCompleted = (moduleId) =>
    completedModules.some((mc) => mc.module_id === moduleId);

  return (
    <div id="course-detail-view" className="view">
      <button
        onClick={() => navTo(VIEWS.CATALOG)}
        className="mb-4 flex items-center font-medium"
        style={{ color: 'var(--color-accent-blue)' }}
      >
        &larr; Voltar ao Catálogo
      </button>

      <div id="course-details">
        <h2 className="text-3xl font-bold text-dark-theme mb-4">
          {currentCourse.name}
        </h2>

        <div className="flex flex-wrap gap-4 mb-6 text-sm">
          <span style={{ color: 'var(--color-text-subtle)' }}>
            <b>Área:</b> {currentCourse.area}
          </span>
          <span style={{ color: 'var(--color-text-subtle)' }}>
            <b>Duração:</b> {currentCourse.estimated_duration_minutes} minutos
          </span>
          {currentCourse.is_mandatory && (
            <span
              className="px-2 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: 'rgba(248, 113, 113, 0.12)',
                color: '#fecaca',
                border: '1px solid rgba(248, 113, 113, 0.4)',
              }}
            >
              Curso obrigatório
            </span>
          )}
        </div>

        <p className="mb-6" style={{ color: 'var(--color-text-subtle)' }}>
          {currentCourse.description}
        </p>

        <h3 className="text-xl font-semibold text-dark-theme mb-4 border-b border-dark-theme pb-2">
          Lista de Módulos
        </h3>

        <div id="modules-list" className="space-y-3">
          {modules.length === 0 ? (
            <p className="text-gray-400">Nenhum módulo encontrado.</p>
          ) : (
            modules.map((module) => (
              <ModuleItem
                key={module.id}
                module={module}
                completed={isModuleCompleted(module.id)}
                onClick={() => loadModulePlayer(module.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
