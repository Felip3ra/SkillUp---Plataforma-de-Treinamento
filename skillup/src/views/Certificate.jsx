// src/views/Certificate.jsx
import React, { useMemo } from 'react';
import { VIEWS } from '../constants';

const Certificate = ({ currentCourse, currentUser, navTo }) => {
    const certificateData = useMemo(() => ({
        studentName: currentUser?.name || 'Nome do Colaborador',
        courseName: currentCourse?.name || 'Nome do Curso',
        hours: (currentCourse?.estimated_duration_minutes / 60)?.toFixed(1) || '--',
        date: new Date().toLocaleDateString('pt-BR'),
        code: crypto.randomUUID().toUpperCase().substring(0, 18)
    }), [currentCourse, currentUser]);

    return (
        <div id="certificate-view" className="view p-0">
            <button 
                onClick={() => navTo(VIEWS.CATALOG)} 
                className="text-accent-blue hover:text-accent-shadow mb-6 flex items-center no-print font-medium"
            >
                &larr; Voltar ao Catálogo
            </button>
            
            <div className="certificate-border shadow-2xl">
                <div className="certificate-inner-border">
                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold text-blue-700 tracking-widest uppercase">CERTIFICADO</h1>
                        <p className="text-blue-500 uppercase tracking-wider text-sm mt-1">de Conclusão</p>
                    </div>
                    
                    <div className="my-8">
                        <p className="text-lg text-gray-600 italic mb-2">Certificamos que</p>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">{certificateData.studentName}</h2>
                        <p className="text-lg text-gray-600 italic mb-2">concluiu com êxito o curso de</p>
                        <h3 className="text-3xl font-bold text-blue-600 mb-6">{certificateData.courseName}</h3>
                        
                        <div className="max-w-xl mx-auto border-t border-b border-gray-200 py-4 my-8">
                            <p className="text-gray-700 text-lg">
                                Carga Horária: <span className="font-bold">{certificateData.hours}</span> horas <br/>
                                Data de Conclusão: <span className="font-bold">{certificateData.date}</span>
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-end mt-16 px-10">
                        <div className="text-center">
                            <div className="border-b border-gray-400 w-48 mb-2"></div>
                            <p className="text-sm text-gray-500 uppercase font-bold">SkillUp Academy</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 mb-1">Código de Validação:</p>
                            <p className="font-mono text-sm text-gray-600 tracking-wider">{certificateData.code}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 text-center no-print">
                <button 
                    onClick={() => window.print()} 
                    className="btn-primary px-8 py-3 rounded-full font-bold shadow-lg transition flex items-center justify-center mx-auto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Baixar / Imprimir PDF
                </button>
            </div>
        </div>
    );
};

export default Certificate;