// src/services/skillupApi.js
import { MOCK_DATA } from '../mockData';

const fakeDelay = (ms = 150) => new Promise(res => setTimeout(res, ms));

// LOGIN
export async function login(email, password) {
  await fakeDelay();
  return MOCK_DATA.users.find(u => u.email === email) || null;
}

// USERS
export async function getUsers() {
  await fakeDelay();
  return [...MOCK_DATA.users];
}

// NOVO: criar usuário (mock)
export async function createUser({ name, email, role, department }) {
  await fakeDelay();

  const exists = MOCK_DATA.users.find(u => u.email === email);
  if (exists) {
    throw new Error('Já existe um usuário com este e-mail.');
  }

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase())
    .join('') || 'US';

  const newUser = {
    id: `u${MOCK_DATA.users.length + 1}`,
    email,
    name,
    role,
    initials,
    department,
  };

  MOCK_DATA.users.push(newUser);
  console.log('[mock] usuário criado:', newUser);

  return newUser;
}

// COURSES
export async function getCourses() {
  await fakeDelay();
  return [...MOCK_DATA.courses];
}

export async function getCourseById(courseId) {
  await fakeDelay();
  return MOCK_DATA.courses.find(c => c.id === courseId) || null;
}

// NOVO: criar curso (mock)
export async function createCourse({
  code,
  name,
  description,
  area,
  level,
  estimated_duration_minutes,
  is_mandatory,
  thumbnail_url,
}) {
  await fakeDelay();

  const exists = MOCK_DATA.courses.find(
    c => c.code.toUpperCase() === code.toUpperCase(),
  );
  if (exists) {
    throw new Error('Já existe um curso com este código.');
  }

  const newCourse = {
    id: `c${MOCK_DATA.courses.length + 1}`,
    code,
    name,
    description,
    area,
    level,
    estimated_duration_minutes: Number(estimated_duration_minutes) || 0,
    is_mandatory: !!is_mandatory,
    thumbnail_url: thumbnail_url || null,
  };

  MOCK_DATA.courses.push(newCourse);
  console.log('[mock] curso criado:', newCourse);

  return newCourse;
}

// MODULES
export async function getModulesByCourse(courseId) {
  await fakeDelay();
  return MOCK_DATA.modules
    .filter(m => m.course_id === courseId)
    .sort((a, b) => a.order_index - b.order_index);
}

export async function createModule({
  course_id,
  title,
  type,
  order_index,
  content_url,
  description,
}) {
  await fakeDelay();

  if (!course_id) {
    throw new Error('Selecione um curso para vincular o módulo.');
  }

  const newModule = {
    id: `m${MOCK_DATA.modules.length + 1}`,
    course_id,
    title,
    type, // 'VIDEO' | 'QUIZ' | 'DOC' etc.
    content_url: content_url || null,
    order_index: Number(order_index) || 1,
    description: description || '',
  };

  MOCK_DATA.modules.push(newModule);
  console.log('[mock] módulo criado:', newModule);

  return newModule;
}


export async function getModuleById(moduleId) {
  await fakeDelay();
  return MOCK_DATA.modules.find(m => m.id === moduleId) || null;
}

export async function getModules() {
  await fakeDelay();
  return [...MOCK_DATA.modules];
}

// ENROLLMENTS
export async function getEnrollments() {
  await fakeDelay();
  return [...MOCK_DATA.enrollments];
}

export async function getEnrollmentsByUser(userId) {
  await fakeDelay();
  return MOCK_DATA.enrollments.filter(e => e.user_id === userId);
}

// COMPLETION DE MÓDULO
export async function completeModule(userId, moduleId) {
  await fakeDelay();

  if (!MOCK_DATA.module_completions) {
    MOCK_DATA.module_completions = [];
  }

  const already = MOCK_DATA.module_completions.find(
    mc => mc.user_id === userId && mc.module_id === moduleId,
  );

  if (!already) {
    MOCK_DATA.module_completions.push({
      id: `mc_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      user_id: userId,
      module_id: moduleId,
      completed_at: new Date().toISOString(),
    });
  }

  console.log('[mock] módulo concluído:', { userId, moduleId });
  return true;
}

// COMPLETION DE CURSO
export async function completeCourse(userId, courseId) {
  await fakeDelay();

  let enrollment = MOCK_DATA.enrollments.find(
    e => e.user_id === userId && e.course_id === courseId,
  );

  if (!enrollment) {
    enrollment = {
      id: `e_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      user_id: userId,
      course_id: courseId,
    };
    MOCK_DATA.enrollments.push(enrollment);
  }

  enrollment.status = 'COMPLETED';
  enrollment.completed_at = new Date().toISOString();

  console.log('[mock] curso concluído:', { userId, courseId });
  return true;
}

// QUIZZES
export async function getQuizByModule(moduleId) {
  await fakeDelay();
  return MOCK_DATA.quizzes.find(q => q.module_id === moduleId) || null;
}

export async function getQuizQuestions(quizId) {
  await fakeDelay();
  return MOCK_DATA.quiz_questions
    .filter(q => q.quiz_id === quizId)
    .sort((a, b) => a.order_index - b.order_index);
}

export async function getOptionsByQuestion(questionId) {
  await fakeDelay();
  return MOCK_DATA.quiz_options.filter(o => o.question_id === questionId);
}

export async function getQuizWithQuestionsByModule(moduleId) {
  await fakeDelay();
  const quiz = MOCK_DATA.quizzes.find(q => q.module_id === moduleId);
  if (!quiz) return null;

  const questions = MOCK_DATA.quiz_questions
    .filter(q => q.quiz_id === quiz.id)
    .sort((a, b) => a.order_index - b.order_index)
    .map(q => ({
      ...q,
      options: MOCK_DATA.quiz_options.filter(o => o.question_id === q.id),
    }));

  return { quiz, questions };
}

export async function createQuizWithQuestions({ module_id, passing_score, questions }) {
  await fakeDelay();

  if (!module_id) {
    throw new Error('Módulo inválido para criar quiz.');
  }

  const quizId = `q${MOCK_DATA.quizzes.length + 1}`;

  const quiz = {
    id: quizId,
    module_id,
    passing_score: Number(passing_score) || 70,
  };

  MOCK_DATA.quizzes.push(quiz);

  questions.forEach((q, idx) => {
    const questionId = `qq${MOCK_DATA.quiz_questions.length + 1}`;

    // pergunta
    MOCK_DATA.quiz_questions.push({
      id: questionId,
      quiz_id: quizId,
      question_text: q.text,
      type: 'MULTIPLE_CHOICE',
      order_index: idx + 1,
    });

    // opções
    q.options.forEach((opt, optIdx) => {
      MOCK_DATA.quiz_options.push({
        question_id: questionId,
        option_text: opt.text,
        is_correct: optIdx === q.correctIndex,
      });
    });
  });

  console.log('[mock] quiz criado:', quiz);
  return quiz;
}


export async function getQuizAttempts() {
  await fakeDelay();
  return [...MOCK_DATA.quiz_attempts];
}

export async function getQuizzes() {
  await fakeDelay();
  return [...MOCK_DATA.quizzes];
}

// COMPLEÇÕES DE MÓDULO POR USUÁRIO (pra CourseDetail)
export async function getModuleCompletionsByUser(userId) {
  await fakeDelay();
  const list = MOCK_DATA.module_completions || [];
  return list.filter(mc => mc.user_id === userId);
}
