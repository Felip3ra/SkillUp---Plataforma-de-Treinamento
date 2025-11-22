// src/views/AdminRH.jsx
import React, { useEffect, useState } from 'react';
import {
  createUser,
  createCourse,
  createModule,
  createQuizWithQuestions,
  getCourses,
} from '../services/skillupApi';

const AdminRH = ({ currentUser, isRH }) => {
  if (!isRH) {
    return (
      <div className="text-center text-red-400">
        Acesso negado. Esta é uma área restrita ao RH.
      </div>
    );
  }

  // ---- FORM USUÁRIO ----
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 1, // 1 = Colaborador, 2 = RH/Admin, 3 = Gestor
    department: '',
  });
  const [userLoading, setUserLoading] = useState(false);
  const [userMessage, setUserMessage] = useState(null);
  const [userError, setUserError] = useState(null);

  // ---- FORM CURSO ----
  const [courseForm, setCourseForm] = useState({
    code: '',
    name: '',
    description: '',
    area: '',
    level: 'BASIC',
    estimated_duration_minutes: 60,
    is_mandatory: false,
    thumbnail_url: '',
  });
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseMessage, setCourseMessage] = useState(null);
  const [courseError, setCourseError] = useState(null);

  // ---- FORM MÓDULO (ETAPA) ----
  const [courses, setCourses] = useState([]);
  const [moduleForm, setModuleForm] = useState({
    course_id: '',
    title: '',
    type: 'VIDEO',
    order_index: 1,
    content_url: '',
    description: '',
  });
  const [moduleLoading, setModuleLoading] = useState(false);
  const [moduleMessage, setModuleMessage] = useState(null);
  const [moduleError, setModuleError] = useState(null);

  // ---- QUIZ (ligado ao módulo, se type === 'QUIZ') ----
  const [quizPassingScore, setQuizPassingScore] = useState(70);
  const [quizQuestions, setQuizQuestions] = useState([
    {
      text: '',
      options: ['', '', ''], // mínimo 2 opções
      correctIndex: 0,
    },
  ]);

  useEffect(() => {
    async function loadCourses() {
      const list = await getCourses();
      setCourses(list);
    }
    loadCourses();
  }, []);

  // ===== HANDLERS USUÁRIO =====
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({
      ...prev,
      [name]: name === 'role' ? Number(value) : value,
    }));
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setUserLoading(true);
    setUserMessage(null);
    setUserError(null);

    try {
      await createUser(userForm); // role já vai numérica (1, 2, 3)
      setUserMessage('Usuário criado com sucesso.');
      setUserForm({
        name: '',
        email: '',
        role: 1,
        department: '',
      });
    } catch (err) {
      setUserError(err.message || 'Erro ao criar usuário.');
    } finally {
      setUserLoading(false);
    }
  };

  // ===== HANDLERS CURSO =====
  const handleCourseChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourseForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setCourseLoading(true);
    setCourseMessage(null);
    setCourseError(null);

    try {
      // 🔹 AQUI entra o id do usuário logado
      await createCourse(courseForm, currentUser?.id);

      setCourseMessage('Curso criado com sucesso.');

      // recarregar lista de cursos para o formulário de módulo
      const list = await getCourses();
      setCourses(list);

      setCourseForm({
        code: '',
        name: '',
        description: '',
        area: '',
        level: 'BASIC',
        estimated_duration_minutes: 60,
        is_mandatory: false,
        thumbnail_url: '',
      });
    } catch (err) {
      setCourseError(err.message || 'Erro ao criar curso.');
    } finally {
      setCourseLoading(false);
    }
  };

  // ===== HANDLERS MÓDULO =====
  const handleModuleChange = (e) => {
    const { name, value } = e.target;
    setModuleForm((prev) => ({ ...prev, [name]: value }));
  };

  // ===== HANDLERS QUIZ (perguntas e opções) =====
  const handleQuizQuestionChange = (qIndex, value) => {
    setQuizQuestions((prev) => {
      const clone = [...prev];
      clone[qIndex] = { ...clone[qIndex], text: value };
      return clone;
    });
  };

  const handleQuizOptionChange = (qIndex, optIndex, value) => {
    setQuizQuestions((prev) => {
      const clone = [...prev];
      const opts = [...clone[qIndex].options];
      opts[optIndex] = value;
      clone[qIndex] = { ...clone[qIndex], options: opts };
      return clone;
    });
  };

  const handleQuizCorrectChange = (qIndex, optIndex) => {
    setQuizQuestions((prev) => {
      const clone = [...prev];
      clone[qIndex] = { ...clone[qIndex], correctIndex: optIndex };
      return clone;
    });
  };

  const addQuizQuestion = () => {
    setQuizQuestions((prev) => [
      ...prev,
      { text: '', options: ['', '', ''], correctIndex: 0 },
    ]);
  };

  const removeQuizQuestion = (qIndex) => {
    setQuizQuestions((prev) => prev.filter((_, idx) => idx !== qIndex));
  };

  const handleModuleSubmit = async (e) => {
    e.preventDefault();
    setModuleLoading(true);
    setModuleMessage(null);
    setModuleError(null);

    try {
      // 1) cria o módulo
      const module = await createModule({
        ...moduleForm,
        order_index: Number(moduleForm.order_index) || 1,
      });

      // 2) se for QUIZ, cria o quiz + perguntas
      if (moduleForm.type === 'QUIZ') {
        const preparedQuestions = quizQuestions
          .map((q) => {
            const opts = q.options
              .map((t) => t.trim())
              .filter((t) => t.length > 0);

            if (!q.text.trim() || opts.length < 2) return null;

            let correctIndex = q.correctIndex;
            if (correctIndex >= opts.length) {
              correctIndex = 0;
            }

            return {
              text: q.text.trim(),
              options: opts.map((t) => ({ text: t })),
              correctIndex,
            };
          })
          .filter(Boolean);

        if (preparedQuestions.length === 0) {
          throw new Error(
            'Para módulos do tipo QUIZ, cadastre pelo menos uma pergunta com 2 opções.'
          );
        }

        await createQuizWithQuestions({
          module_id: module.id,
          passing_score: quizPassingScore,
          questions: preparedQuestions,
        });
      }

      setModuleMessage('Etapa criada com sucesso.');
      setModuleForm((prev) => ({
        course_id: prev.course_id, // mantém o curso selecionado
        title: '',
        type: 'VIDEO',
        order_index: 1,
        content_url: '',
        description: '',
      }));
      setQuizPassingScore(70);
      setQuizQuestions([{ text: '', options: ['', '', ''], correctIndex: 0 }]);
    } catch (err) {
      setModuleError(err.message || 'Erro ao criar etapa.');
    } finally {
      setModuleLoading(false);
    }
  };

  return (
    <div id="admin-rh-view" className="view">
      <h2 className="text-2xl font-bold text-dark-theme mb-2">
        Administração RH
      </h2>
      <p
        className="mb-6 text-sm"
        style={{ color: 'var(--color-text-subtle)' }}
      >
        Gerencie colaboradores, cursos e etapas da trilha de aprendizado.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card: Novo Usuário */}
        <div className="card p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-dark-theme mb-4">
            Novo Usuário
          </h3>

          <form className="space-y-4" onSubmit={handleUserSubmit}>
            <div>
              <label className="block text-sm mb-1 text-dark-theme">
                Nome completo
              </label>
              <input
                type="text"
                name="name"
                required
                value={userForm.name}
                onChange={handleUserChange}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: 'var(--color-mid-slate)',
                  borderColor: 'var(--color-light-slate)',
                  color: 'var(--color-text-light)',
                }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-dark-theme">
                E-mail corporativo
              </label>
              <input
                type="email"
                name="email"
                required
                value={userForm.email}
                onChange={handleUserChange}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: 'var(--color-mid-slate)',
                  borderColor: 'var(--color-light-slate)',
                  color: 'var(--color-text-light)',
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-dark-theme">
                  Função / Perfil
                </label>
                <select
                  name="role"
                  value={userForm.role}
                  onChange={handleUserChange}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    backgroundColor: 'var(--color-mid-slate)',
                    borderColor: 'var(--color-light-slate)',
                    color: 'var(--color-text-light)',
                  }}
                >
                  <option value={1}>Colaborador</option>
                  <option value={2}>RH / Admin</option>
                  <option value={3}>Gestor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-dark-theme">
                  Departamento
                </label>
                <input
                  type="text"
                  name="department"
                  value={userForm.department}
                  onChange={handleUserChange}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    backgroundColor: 'var(--color-mid-slate)',
                    borderColor: 'var(--color-light-slate)',
                    color: 'var(--color-text-light)',
                  }}
                />
              </div>
            </div>

            {userError && (
              <p className="text-sm text-red-400">{userError}</p>
            )}
            {userMessage && (
              <p className="text-sm text-green-400">{userMessage}</p>
            )}

            <button
              type="submit"
              className="btn-primary w-full py-2.5 rounded-xl text-sm font-semibold"
              disabled={userLoading}
            >
              {userLoading ? 'Salvando...' : 'Criar Usuário'}
            </button>
          </form>
        </div>

        {/* Card: Novo Curso */}
        <div className="card p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-dark-theme mb-4">
            Novo Curso
          </h3>

          <form className="space-y-4" onSubmit={handleCourseSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-dark-theme">
                  Código do curso
                </label>
                <input
                  type="text"
                  name="code"
                  required
                  value={courseForm.code}
                  onChange={handleCourseChange}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    backgroundColor: 'var(--color-mid-slate)',
                    borderColor: 'var(--color-light-slate)',
                    color: 'var(--color-text-light)',
                  }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-dark-theme">
                  Área
                </label>
                <input
                  type="text"
                  name="area"
                  value={courseForm.area}
                  onChange={handleCourseChange}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    backgroundColor: 'var(--color-mid-slate)',
                    borderColor: 'var(--color-light-slate)',
                    color: 'var(--color-text-light)',
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 text-dark-theme">
                Nome do curso
              </label>
              <input
                type="text"
                name="name"
                required
                value={courseForm.name}
                onChange={handleCourseChange}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: 'var(--color-mid-slate)',
                  borderColor: 'var(--color-light-slate)',
                  color: 'var(--color-text-light)',
                }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-dark-theme">
                Descrição
              </label>
              <textarea
                name="description"
                rows={3}
                value={courseForm.description}
                onChange={handleCourseChange}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: 'var(--color-mid-slate)',
                  borderColor: 'var(--color-light-slate)',
                  color: 'var(--color-text-light)',
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1 text-dark-theme">
                  Nível
                </label>
                <select
                  name="level"
                  value={courseForm.level}
                  onChange={handleCourseChange}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    backgroundColor: 'var(--color-mid-slate)',
                    borderColor: 'var(--color-light-slate)',
                    color: 'var(--color-text-light)',
                  }}
                >
                  <option value="BASIC">Básico</option>
                  <option value="INTERMEDIATE">Intermediário</option>
                  <option value="ADVANCED">Avançado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1 text-dark-theme">
                  Duração (min)
                </label>
                <input
                  type="number"
                  name="estimated_duration_minutes"
                  min={0}
                  value={courseForm.estimated_duration_minutes}
                  onChange={handleCourseChange}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    backgroundColor: 'var(--color-mid-slate)',
                    borderColor: 'var(--color-light-slate)',
                    color: 'var(--color-text-light)',
                  }}
                />
              </div>
              <div className="flex items-end">
                <label className="inline-flex items-center gap-2 text-sm text-dark-theme">
                  <input
                    type="checkbox"
                    name="is_mandatory"
                    checked={courseForm.is_mandatory}
                    onChange={handleCourseChange}
                    className="rounded border"
                  />
                  Curso obrigatório
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 text-dark-theme">
                URL da imagem (thumbnail)
              </label>
              <input
                type="text"
                name="thumbnail_url"
                value={courseForm.thumbnail_url}
                onChange={handleCourseChange}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: 'var(--color-mid-slate)',
                  borderColor: 'var(--color-light-slate)',
                  color: 'var(--color-text-light)',
                }}
              />
            </div>

            {courseError && (
              <p className="text-sm text-red-400">{courseError}</p>
            )}
            {courseMessage && (
              <p className="text-sm text-green-400">{courseMessage}</p>
            )}

            <button
              type="submit"
              className="btn-primary w-full py-2.5 rounded-xl text-sm font-semibold"
              disabled={courseLoading}
            >
              {courseLoading ? 'Salvando...' : 'Criar Curso'}
            </button>
          </form>
        </div>

        {/* Card: Nova Etapa (Módulo) */}
        <div className="card p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-dark-theme mb-4">
            Nova Etapa do Curso
          </h3>

          <form className="space-y-4" onSubmit={handleModuleSubmit}>
            <div>
              <label className="block text-sm mb-1 text-dark-theme">
                Curso
              </label>
              <select
                name="course_id"
                required
                value={moduleForm.course_id}
                onChange={handleModuleChange}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: 'var(--color-mid-slate)',
                  borderColor: 'var(--color-light-slate)',
                  color: 'var(--color-text-light)',
                }}
              >
                <option value="">Selecione um curso...</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1 text-dark-theme">
                Título da etapa
              </label>
              <input
                type="text"
                name="title"
                required
                value={moduleForm.title}
                onChange={handleModuleChange}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: 'var(--color-mid-slate)',
                  borderColor: 'var(--color-light-slate)',
                  color: 'var(--color-text-light)',
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-dark-theme">
                  Tipo
                </label>
                <select
                  name="type"
                  value={moduleForm.type}
                  onChange={handleModuleChange}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    backgroundColor: 'var(--color-mid-slate)',
                    borderColor: 'var(--color-light-slate)',
                    color: 'var(--color-text-light)',
                  }}
                >
                  <option value="VIDEO">Vídeo</option>
                  <option value="QUIZ">Quiz</option>
                  <option value="DOC">Documento</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1 text-dark-theme">
                  Ordem na trilha
                </label>
                <input
                  type="number"
                  name="order_index"
                  min={1}
                  value={moduleForm.order_index}
                  onChange={handleModuleChange}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    backgroundColor: 'var(--color-mid-slate)',
                    borderColor: 'var(--color-light-slate)',
                    color: 'var(--color-text-light)',
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 text-dark-theme">
                URL do conteúdo (ex.: link YouTube)
              </label>
              <input
                type="text"
                name="content_url"
                value={moduleForm.content_url}
                onChange={handleModuleChange}
                placeholder="https://www.youtube.com/..."
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: 'var(--color-mid-slate)',
                  borderColor: 'var(--color-light-slate)',
                  color: 'var(--color-text-light)',
                }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-dark-theme">
                Descrição (opcional)
              </label>
              <textarea
                name="description"
                rows={3}
                value={moduleForm.description}
                onChange={handleModuleChange}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: 'var(--color-mid-slate)',
                  borderColor: 'var(--color-light-slate)',
                  color: 'var(--color-text-light)',
                }}
              />
            </div>

            {/* CONFIGURAÇÃO DO QUIZ (apenas se type === 'QUIZ') */}
            {moduleForm.type === 'QUIZ' && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm mb-1 text-dark-theme">
                    Nota mínima para aprovação (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={quizPassingScore}
                    onChange={(e) => setQuizPassingScore(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{
                      backgroundColor: 'var(--color-mid-slate)',
                      borderColor: 'var(--color-light-slate)',
                      color: 'var(--color-text-light)',
                    }}
                  />
                </div>

                <div className="space-y-4">
                  {quizQuestions.map((q, qIndex) => (
                    <div
                      key={qIndex}
                      className="rounded-lg p-3"
                      style={{
                        backgroundColor: 'var(--color-mid-slate)',
                        border: '1px solid var(--color-light-slate)',
                      }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-dark-theme">
                          Pergunta {qIndex + 1}
                        </span>
                        {quizQuestions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuizQuestion(qIndex)}
                            className="text-xs text-red-400 hover:underline"
                          >
                            Remover
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Texto da pergunta"
                        value={q.text}
                        onChange={(e) =>
                          handleQuizQuestionChange(qIndex, e.target.value)
                        }
                        className="w-full px-3 py-2 mb-2 rounded-lg border text-sm"
                        style={{
                          backgroundColor: 'var(--color-dark-navy)',
                          borderColor: 'var(--color-light-slate)',
                          color: 'var(--color-text-light)',
                        }}
                      />

                      <div className="space-y-2">
                        {q.options.map((opt, optIndex) => (
                          <div
                            key={optIndex}
                            className="flex items-center gap-2 text-sm"
                          >
                            <input
                              type="radio"
                              name={`correct-q-${qIndex}`}
                              checked={q.correctIndex === optIndex}
                              onChange={() =>
                                handleQuizCorrectChange(qIndex, optIndex)
                              }
                            />
                            <input
                              type="text"
                              placeholder={`Opção ${optIndex + 1}`}
                              value={opt}
                              onChange={(e) =>
                                handleQuizOptionChange(
                                  qIndex,
                                  optIndex,
                                  e.target.value
                                )
                              }
                              className="flex-1 px-3 py-1.5 rounded-lg border text-sm"
                              style={{
                                backgroundColor: 'var(--color-dark-navy)',
                                borderColor: 'var(--color-light-slate)',
                                color: 'var(--color-text-light)',
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addQuizQuestion}
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-accent-blue)' }}
                  >
                    + Adicionar pergunta
                  </button>
                </div>
              </div>
            )}

            {moduleError && (
              <p className="text-sm text-red-400">{moduleError}</p>
            )}
            {moduleMessage && (
              <p className="text-sm text-green-400">{moduleMessage}</p>
            )}

            <button
              type="submit"
              className="btn-primary w-full py-2.5 rounded-xl text-sm font-semibold"
              disabled={moduleLoading}
            >
              {moduleLoading ? 'Salvando...' : 'Criar Etapa'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminRH;
