import React, { useCallback, useEffect, useState } from 'react';
import {
  getUsers,
  getCourses,
  getEnrollments,
  getQuizAttempts,
  getQuizzes,
  getModules,
} from '../services/skillupApi';

const DashboardRH = ({ currentUser, isRH }) => {
  const [metrics, setMetrics] = useState({
    completionRate: '--',
    avgScore: '--',
    pendingCount: '--',
    pendingList: []
  });
  const [allCourses, setAllCourses] = useState([]);
  const [filterCourseId, setFilterCourseId] = useState('all');

  const loadRHDashboard = useCallback(async () => {
    const [allUsers, courses, allEnrollments, allAttempts, quizzes, modules] =
      await Promise.all([
        getUsers(),
        getCourses(),
        getEnrollments(),
        getQuizAttempts(),
        getQuizzes(),
        getModules(),
      ]);

    setAllCourses(courses);

    const filteredEnrollments = allEnrollments.filter(
      e => filterCourseId === 'all' || e.course_id === filterCourseId
    );
    const totalEnrollments = filteredEnrollments.length;
    const totalCompleted = filteredEnrollments.filter(e => e.status === 'COMPLETED').length;
    const completionRate = totalEnrollments > 0
      ? ((totalCompleted / totalEnrollments) * 100).toFixed(1)
      : '0';

    const attemptsInCourses = filterCourseId === 'all'
      ? allAttempts
      : allAttempts.filter(a => {
          const quiz = quizzes.find(q => q.id === a.quiz_id);
          const module = modules.find(m => m.id === quiz?.module_id);
          return module && module.course_id === filterCourseId;
        });

    const totalAttempts = attemptsInCourses.length;
    const scoreSum = attemptsInCourses.reduce((sum, attempt) => sum + attempt.score, 0);
    const avgScore = totalAttempts > 0 ? (scoreSum / totalAttempts).toFixed(0) : '--';

    const mandatoryCourses = courses.filter(c => c.is_mandatory);
    const mandatoryCourseIds = mandatoryCourses.map(c => c.id);
    const coursesMap = courses.reduce((map, course) => ({ ...map, [course.id]: course }), {});

    // todos que NÃO são RH
    const nonRHUsers = allUsers.filter(
      u => !(u.role?.toLowerCase().includes('rh'))
    );
        
    const pendingList = [];
    nonRHUsers.forEach(user => {
      mandatoryCourseIds.forEach(courseId => {
        const enrollment = allEnrollments.find(
          e => e.user_id === user.id && e.course_id === courseId
        );

        if (filterCourseId === 'all' && (!enrollment || enrollment.status !== 'COMPLETED')) {
          pendingList.push({
            user,
            course: coursesMap[courseId],
            status: enrollment?.status || 'NOT_STARTED'
          });
        }

        if (
          filterCourseId !== 'all' &&
          courseId === filterCourseId &&
          (!enrollment || enrollment.status !== 'COMPLETED')
        ) {
          pendingList.push({
            user,
            course: coursesMap[courseId],
            status: enrollment?.status || 'NOT_STARTED'
          });
        }
      });
    });

    setMetrics({
      completionRate,
      avgScore,
      pendingCount: pendingList.length,
      pendingList
    });
  }, [filterCourseId]);

  useEffect(() => {
    if (isRH) {
      loadRHDashboard();
    }
  }, [isRH, loadRHDashboard]);

  if (!isRH) {
    return (
      <div className="text-center text-red-400">
        Acesso negado. Esta é uma visualização para Gestores/RH.
      </div>
    );
  }

  return (
    <div id="dashboard-rh-view" className="view">
      <h2 className="text-2xl font-bold text-dark-theme mb-6 border-b border-dark-theme pb-2">
        Dashboard de Treinamento (RH/Gestor)
      </h2>

      {/* FILTROS: Usando --color-light-slate para o fundo, --color-mid-slate nos selects */}
      <div
        className="p-4 rounded-xl mb-6 flex flex-wrap gap-4 items-center"
        style={{ backgroundColor: 'var(--color-light-slate)', border: '1px solid var(--color-light-slate)' }}
      >
        <label className="text-sm font-medium text-white">Filtros:</label>
        <select 
          id="dashboard-filter-course" 
          className="px-3 py-1 border border-gray-600 rounded-lg text-sm text-white" 
          style={{ backgroundColor: 'var(--color-mid-slate)', borderColor: 'var(--color-mid-slate)' }}
          value={filterCourseId}
          onChange={(e) => setFilterCourseId(e.target.value)}
        >
          <option value="all">Todos os Cursos</option>
          {allCourses.map(course => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
        <select
          id="dashboard-filter-time"
          className="px-3 py-1 border border-gray-600 rounded-lg text-sm text-white"
          style={{ backgroundColor: 'var(--color-mid-slate)', borderColor: 'var(--color-mid-slate)' }}
        >
          <option>Período: Últimos 30 dias</option>
        </select>
        <button
          onClick={loadRHDashboard}
          className="btn-primary py-1 px-3 rounded-lg text-sm transition font-medium"
        >
          Aplicar
        </button>
      </div>

      {/* MÉTRICAS */}
      <div id="dashboard-metrics" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Taxa de Conclusão (Verde) */}
        <div className="metric-card border-l-4 border-green-400" style={{ backgroundColor: 'var(--color-mid-slate)' }}> 
          <p className="text-sm font-medium text-gray-400">Taxa Média de Conclusão</p>
          <p className="text-3xl font-extrabold text-green-400 mt-1">{metrics.completionRate}%</p>
        </div>
        
        {/* Média de Notas (Roxo -> Azul Acento) */}
        <div className="metric-card border-l-4 border-accent-blue" style={{ backgroundColor: 'var(--color-mid-slate)' }}> 
          <p className="text-sm font-medium text-gray-400">Média de Notas (Quizzes)</p>
          <p className="text-3xl font-extrabold text-accent-blue mt-1">{metrics.avgScore}</p>
        </div>
        
        {/* Pendências (Vermelho) */}
        <div className="metric-card border-l-4 border-red-400" style={{ backgroundColor: 'var(--color-mid-slate)' }}> 
          <p className="text-sm font-medium text-gray-400">Colaboradores Pendentes</p>
          <p className="text-3xl font-extrabold text-red-400 mt-1">{metrics.pendingCount}</p>
        </div>
      </div>

      {/* TABELA */}
      <h3 className="text-xl font-semibold text-dark-theme mb-4 border-b border-dark-theme pb-2">
        Pendências em Cursos Obrigatórios
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y" style={{ borderColor: 'var(--color-light-slate)' }}> 
          <thead style={{ backgroundColor: 'var(--color-light-slate)' }}> 
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Colaborador</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Curso Obrigatório</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status (Simulado)</th>
            </tr>
          </thead>
          <tbody
            id="pending-list"
            className="divide-y"
            style={{ backgroundColor: 'var(--color-mid-slate)', borderColor: 'var(--color-light-slate)' }} 
          >
            {metrics.pendingList.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-sm text-green-400 text-center">
                  Nenhuma pendência encontrada.
                </td>
              </tr>
            ) : (
              metrics.pendingList.map((item, index) => (
                <tr key={index} className="hover:bg-light-slate/50"> 
                  <td className="px-6 py-4 text-sm font-medium text-white">{item.user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{item.course.name}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-red-400">
                    {item.status.replace('_', ' ')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardRH;