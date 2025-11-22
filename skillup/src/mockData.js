// src/mockData.js

export const MOCK_DATA = {
  users: [
    {
      id: 'u1',
      email: 'colaborador@skillup.com',
      name: 'Colaborador SkillUp',
      role: 'Colaborador',
      initials: 'CS',
      department: 'Vendas',
    },
    {
      id: 'u2',
      email: 'rh@skillup.com',
      name: 'Gestor RH',
      role: 'RH',
      initials: 'GR',
      department: 'Recursos Humanos',
    },
    {
      id: 'u3',
      email: 'alice.s@empresa.com',
      name: 'Alice Silva',
      role: 'Colaborador',
      initials: 'AS',
      department: 'Vendas',
    },
    {
      id: 'u4',
      email: 'bruno.c@empresa.com',
      name: 'Bruno Costa',
      role: 'Colaborador',
      initials: 'BC',
      department: 'Marketing',
    },
    {
      id: 'u5',
      email: 'carla.d@empresa.com',
      name: 'Carla Dias',
      role: 'Colaborador',
      initials: 'CD',
      department: 'Tecnologia',
    },
  ],

  courses: [
    {
      id: 'c1',
      code: 'COMP-001',
      name: 'Fundamentos de Compliance',
      description: 'Treinamento obrigatório sobre ética e conduta.',
      area: 'Compliance',
      level: 'BASIC',
      estimated_duration_minutes: 60,
      is_mandatory: true,
      thumbnail_url:
        'https://images.pexels.com/photos/3184613/pexels-photo-3184613.jpeg', // imagem ilustrativa
    },
    {
      id: 'c2',
      code: 'TECH-002',
      name: 'Cloud Computing Intro',
      description: 'Conceitos de IaaS, PaaS, SaaS e migração de sistemas.',
      area: 'Técnico',
      level: 'INTERMEDIATE',
      estimated_duration_minutes: 120,
      is_mandatory: false,
      thumbnail_url:
        'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg', // imagem ilustrativa
    },
  ],

  modules: [
    {
      id: 'm1',
      course_id: 'c1',
      title: 'Intro e Código de Ética',
      type: 'VIDEO',
      // link mockado do YouTube (backend vai mandar algo assim depois)
      content_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      order_index: 1,
      description:
        'Esta lição introduz os conceitos de Compliance e o Código de Ética da Empresa.',
    },
    {
      id: 'm2',
      course_id: 'c1',
      title: 'Quiz Final',
      type: 'QUIZ',
      content_url: null,
      order_index: 2,
      description: 'Avaliação final dos Fundamentos de Compliance.',
    },
    {
      id: 'm3',
      course_id: 'c2',
      title: 'O que é Nuvem?',
      type: 'VIDEO',
      // outro link mockado do YouTube
      content_url: 'https://youtu.be/ScMzIvxBSi4',
      order_index: 1,
      description:
        'Entenda os principais modelos de serviço e implementação de nuvem.',
    },
  ],

  quizzes: [
    {
      id: 'q1',
      module_id: 'm2',
      passing_score: 70,
    },
  ],

  quiz_questions: [
    {
      id: 'qq1',
      quiz_id: 'q1',
      question_text: 'Compliance é opcional?',
      type: 'TRUE_FALSE',
      order_index: 1,
    },
    {
      id: 'qq2',
      quiz_id: 'q1',
      question_text: 'Quem deve seguir o código de ética?',
      type: 'MULTIPLE_CHOICE',
      order_index: 2,
    },
  ],

  quiz_options: [
    { question_id: 'qq1', option_text: 'Verdadeiro', is_correct: false },
    { question_id: 'qq1', option_text: 'Falso', is_correct: true },
    { question_id: 'qq2', option_text: 'Apenas a diretoria', is_correct: false },
    { question_id: 'qq2', option_text: 'Todos os colaboradores', is_correct: true },
  ],

  enrollments: [
    {
      id: 'e1',
      user_id: 'u3',
      course_id: 'c1',
      status: 'COMPLETED',
      completed_at: new Date().toISOString(),
    },
    {
      id: 'e2',
      user_id: 'u4',
      course_id: 'c1',
      status: 'IN_PROGRESS',
    },
    {
      id: 'e3',
      user_id: 'u5',
      course_id: 'c1',
      status: 'NOT_STARTED',
    },
    {
      id: 'e4',
      user_id: 'u3',
      course_id: 'c2',
      status: 'IN_PROGRESS',
    },
  ],

  quiz_attempts: [
    { id: 'att1', quiz_id: 'q1', user_id: 'u3', score: 90, passed: true },
    { id: 'att2', quiz_id: 'q1', user_id: 'u4', score: 50, passed: false },
  ],
};

export const getMockData = (collectionName, filterFn) => {
  let data = MOCK_DATA[collectionName] || [];
  return filterFn ? data.filter(filterFn) : data;
};

export const getEnrollmentStatus = (userId, courseId) => {
  const enrollment = getMockData(
    'enrollments',
    (e) => e.user_id === userId && e.course_id === courseId,
  )[0];
  return enrollment ? enrollment.status : 'NOT_ENROLLED';
};
