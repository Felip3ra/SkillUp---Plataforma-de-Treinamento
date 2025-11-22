import React, { useCallback, useEffect, useState } from 'react';
import { VIEWS } from '../constants';
import { getQuizWithQuestionsByModule } from '../services/skillupApi';

const Quiz = ({ currentModule, currentCourse, navTo, onFinish, quizResult, loadCertificate }) => {
  const [quizData, setQuizData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    async function loadQuiz() {
      if (!currentModule || currentModule.type !== 'QUIZ') {
        setQuizData(null);
        setQuestions([]);
        return;
      }

      const data = await getQuizWithQuestionsByModule(currentModule.id);
      if (!data) {
        setQuizData(null);
        setQuestions([]);
        return;
      }

      setQuizData(data.quiz);
      setQuestions(data.questions);
      setCurrentIndex(0);
      setUserAnswers({});
    }
    loadQuiz();
  }, [currentModule]);
    
  const selectAnswer = (qId, text) => {
    setUserAnswers(prev => ({ ...prev, [qId]: text }));
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach(q => {
      const rightOpt = q.options.find(o => o.is_correct);
      if (rightOpt && userAnswers[q.id] === rightOpt.option_text) {
        correct++;
      }
    });
        
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= quizData.passing_score;
        
    onFinish({ score, passed, passingScore: quizData.passing_score });
  };

  const renderQuestion = useCallback((q) => {
    return (
      <>
        <h3 className="text-xl font-semibold text-dark-theme mb-4">{q.question_text}</h3>
        <div id="options-container" className="space-y-3">
          {q.options.map((opt, index) => {
            const isSelected = userAnswers[q.id] === opt.option_text;
            return (
              <div 
                key={index}
                className="option-button p-4 rounded-xl shadow-sm border cursor-pointer transition duration-150 ease-in-out" 
                onClick={() => selectAnswer(q.id, opt.option_text)}
                style={{
                  // MUDANÇA: Borda do item selecionado para --color-accent-blue
                  borderLeft: `5px solid ${isSelected ? 'var(--color-accent-blue)' : 'var(--color-light-slate)'}`,
                  // MUDANÇA: Fundo do item selecionado para --color-light-slate; Não selecionado para --color-mid-slate
                  backgroundColor: isSelected ? 'var(--color-light-slate)' : 'var(--color-mid-slate)',
                  color: 'var(--color-text-light)',
                  // MUDANÇA: Borda padrão para --color-light-slate
                  borderColor: 'var(--color-light-slate)'
                }}
              >
                {opt.option_text}
              </div>
            );
          })}
        </div>
      </>
    );
  }, [userAnswers]);

  if (!quizData || questions.length === 0) {
    return <div className="text-center text-gray-400">Quiz não encontrado ou sem perguntas.</div>;
  }
    
  const currentQuestion = questions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;
  const isAnswered = !!userAnswers[currentQuestion?.id];

  return (
    <div id="quiz-view" className="view">
      <h2 className="text-2xl font-bold text-dark-theme mb-6 border-b border-dark-theme pb-2">Questionário: {currentModule?.title}</h2>
      <button 
        onClick={() => navTo(VIEWS.COURSE_DETAIL)}
        className="text-accent-blue hover:text-accent-shadow mb-4 flex items-center font-medium"
      >
        &larr; Voltar ao Curso
      </button>

      <div id="quiz-container" className="card p-6 rounded-xl shadow-lg">
        {quizResult ? (
          <div id="result-area" className="text-center">
            <h3 className={`text-3xl font-bold mb-4 ${quizResult.passed ? 'text-green-400' : 'text-red-400'}`}>
              {quizResult.passed ? 'Aprovado! 🎉' : 'Não foi dessa vez 😔'}
            </h3>
            <p className="text-xl mb-4 text-gray-300">
              Sua Pontuação: <span className="font-extrabold text-accent-blue">{quizResult.score}</span>%
            </p>
            <p className="text-lg mb-6 text-gray-400">
              {quizResult.passed 
                ? 'Parabéns! Você completou o módulo com sucesso.' 
                : `Você precisa de ${quizResult.passingScore}% para passar.`
              }
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navTo(VIEWS.CATALOG)}
                className="py-2 px-6 rounded-xl shadow-md text-gray-300 transition font-medium"
                style={{ backgroundColor: 'var(--color-light-slate)', transition: 'background-color 0.2s' }}
              >
                Voltar ao Catálogo
              </button>
              {quizResult.passed && (
                <button 
                  onClick={loadCertificate} 
                  className="btn-primary py-2 px-6 rounded-xl shadow-md transition font-bold" 
                  style={{ background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)' }}
                >
                  🎓 Emitir Certificado
                </button>
              )}
            </div>
          </div>
        ) : (
          <div id="question-area">
            <p className="text-lg text-gray-300 mb-4 font-medium">Questão {currentIndex + 1} de {questions.length}</p>
            
            {renderQuestion(currentQuestion)}
            
            <div className="mt-6 flex justify-between">
              <button 
                id="prev-question-btn" 
                className="py-2 px-4 rounded-xl shadow-md text-sm font-medium text-gray-300 transition" 
                style={{ backgroundColor: 'var(--color-light-slate)' }}
                onClick={() => setCurrentIndex(prev => prev - 1)}
                disabled={isFirst}
              >
                Anterior
              </button>
              
              {isLast ? (
                <button 
                  id="submit-quiz-btn" 
                  className="btn-primary py-2 px-4 rounded-xl shadow-md text-sm font-medium transition" 
                  style={{ background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)' }}
                  onClick={handleSubmit}
                  disabled={!isAnswered}
                >
                  Finalizar Quiz
                </button>
              ) : (
                <button 
                  id="next-question-btn" 
                  className="btn-primary py-2 px-4 rounded-xl shadow-md text-sm font-medium transition"
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  disabled={!isAnswered}
                >
                  Próxima
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;