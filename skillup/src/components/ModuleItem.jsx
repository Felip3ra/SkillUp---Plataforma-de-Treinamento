import React from 'react';

const ModuleItem = ({ module, onClick }) => {
  const icon = module.type === 'VIDEO' ? '🎥' : (module.type === 'QUIZ' ? '📝' : '📄');

  return (
    <div 
      className="module-item p-4 rounded-xl flex justify-between items-center cursor-pointer hover:opacity-90 transition" 
      onClick={onClick} 
      style={{ backgroundColor: 'var(--color-light-slate)' }} 
    >
      <div className="flex items-center text-white">
        <span className="text-2xl mr-3">{icon}</span>
        <span>{module.order_index}. {module.title}</span>
      </div>
      <span 
        className="text-xs text-gray-400 px-2 py-1 rounded-full" 
        style={{ backgroundColor: 'var(--color-mid-slate)' }} 
      >
        {module.type}
      </span>
    </div>
  );
};

export default ModuleItem;