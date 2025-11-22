import React from 'react';

const CourseCard = ({ course, onClick }) => {
  const isMandatoryClass = course.is_mandatory 
    ? 'bg-red-800/50 text-red-300' 
    : 'bg-accent-blue/50 text-accent-blue';
    
  return (
    <div 
      className="card p-4 cursor-pointer hover:shadow-xl hover:translate-y-[-3px] transition-all duration-300" 
      onClick={onClick} 
    >
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${isMandatoryClass}`}>
        {course.is_mandatory ? 'OBRIGATÓRIO' : course.area.toUpperCase()}
      </span>
      <h3 className="font-bold text-lg mt-2 text-white">{course.name}</h3>
      <p className="text-sm text-gray-400 mt-1">{course.estimated_duration_minutes} min</p>
      <button className="btn-primary w-full mt-3 py-2 rounded-xl text-sm font-bold shadow-md">
        Ver Curso
      </button>
    </div>
  );
};

export default CourseCard;