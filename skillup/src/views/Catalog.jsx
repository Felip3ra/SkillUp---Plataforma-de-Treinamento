import React, { useEffect, useMemo, useState } from 'react';
import { getCourses } from '../services/skillupApi';
import CourseCard from '../components/CourseCard';

const Catalog = ({ loadCourseDetail }) => {
  const [courses, setCourses] = useState([]);
    
  useEffect(() => {
    async function load() {
      const data = await getCourses();
      setCourses(data);
    }
    load();
  }, []);

  const areas = useMemo(() => [...new Set(courses.map(c => c.area))], [courses]);
  const levels = useMemo(() => [...new Set(courses.map(c => c.level))], [courses]);

  return (
    <div id="catalog-view" className="view">
      <h2 className="text-2xl font-bold text-dark-theme mb-6 border-b border-dark-theme pb-2">Catálogo de Cursos</h2>
      
 
      <div 
        className="p-4 rounded-xl mb-6 flex flex-wrap gap-4 items-center" 
        style={{ 
          backgroundColor: 'var(--color-light-slate)', 
          border: '1px solid var(--color-light-slate)' 
        }}
      >
        <label className="text-sm font-medium text-white">Filtros:</label>
        
        <select 
          className="px-3 py-1 border border-gray-600 rounded-lg text-sm text-white" 
          style={{ 
            backgroundColor: 'var(--color-mid-slate)',
            borderColor: 'var(--color-mid-slate)' 
          }}
        >
          <option>Área: Todas</option>
          {areas.map(a => <option key={a}>{a}</option>)}
        </select>
        
        <select 
          className="px-3 py-1 border border-gray-600 rounded-lg text-sm text-white" 
          style={{ 
            backgroundColor: 'var(--color-mid-slate)',
            borderColor: 'var(--color-mid-slate)' 
          }}
        >
          <option>Nível: Todos</option>
          {levels.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>
      
      <div id="courses-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 italic">Carregando cursos...</p>
        ) : (
          courses.map(course => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onClick={() => loadCourseDetail(course.id)} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Catalog;