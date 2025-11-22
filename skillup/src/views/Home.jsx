import React, { useEffect, useState } from 'react';
import { getCourses, getEnrollmentsByUser } from '../services/skillupApi';

const Home = ({ currentUser }) => {
  const [totalEnrollments, setTotalEnrollments] = useState(0);
  const [completedEnrollments, setCompletedEnrollments] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    async function load() {
      const [enrollments, courses] = await Promise.all([
        getEnrollmentsByUser(currentUser.id),
        getCourses(),
      ]);

      const total = enrollments.length;
      const completed = enrollments.filter(e => e.status === 'COMPLETED').length;

      const mandatoryCourse = courses.find(c => c.is_mandatory);
      let pending = 0;
      if (mandatoryCourse) {
        const enrollment = enrollments.find(e => e.course_id === mandatoryCourse.id);
        pending = enrollment && enrollment.status === 'COMPLETED' ? 0 : 1;
      }

      setTotalEnrollments(total);
      setCompletedEnrollments(completed);
      setPendingCount(pending);
    }
    load();
  }, [currentUser.id]);

  const progress = totalEnrollments > 0
    ? ((completedEnrollments / totalEnrollments) * 100).toFixed(0)
    : '0';

  return (
    <div id="home-view" className="view">
      {/* O título agora segue a cor padrão do texto no dark theme e tem uma borda sutil */}
      <h2 className="text-2xl font-bold text-dark-theme mb-6 border-b border-color-light-slate pb-2">Minha Home</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Minhas Trilhas - Gradiente de Azul/Roxo Sutil */}
        <div className="card p-4 rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 border-none">
          <h3 className="font-semibold text-lg text-white">Minhas Trilhas</h3>
          <p className="text-sm text-blue-200 mt-1"> 
            {totalEnrollments > 0 ? `${totalEnrollments} trilhas ativas` : 'Nenhuma trilha iniciada.'}
          </p>
        </div>
        
        {/* Card 2: Cursos Recomendados - Gradiente de Azul/Ciano Sutil */}
        <div className="card p-4 rounded-xl bg-gradient-to-br from-sky-700 to-blue-800 border-none">
          <h3 className="font-semibold text-lg text-white">Cursos Recomendados</h3>
          <p className="text-sm text-sky-200 mt-1">Soft Skills para Liderança.</p>
        </div>
        
        {/* Card 3: Progresso Geral - Gradiente de Cinza/Azul Escuro */}
        <div className="card p-4 rounded-xl bg-gradient-to-br from-slate-700 to-gray-800 border-none">
          <h3 className="font-semibold text-lg text-white">Progresso Geral</h3>
          <p className="text-sm text-slate-200 mt-1">{progress}% de conclusão.</p>
        </div>
        
        {/* Card 4: Cursos Pendentes - Gradiente de Azul Escuro/Acento */}
        <div className="card p-4 rounded-xl bg-gradient-to-br from-blue-800 to-blue-900 border-none">
          <h3 className="font-semibold text-lg text-white">Cursos Pendentes</h3>
          <p className="text-sm text-blue-300 mt-1">{pendingCount} curso obrigatório pendente.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;