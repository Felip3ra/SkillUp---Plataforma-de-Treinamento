// src/services/skillupApi.js
import { MOCK_DATA } from '../mockData';

// ENDEREÇO DA SUA API .NET
// ajuste para o host/porta que você estiver usando (https://localhost:5001, http://localhost:5000, etc.)
const API_BASE_URL = 'https://localhost:7087';

// se quiser simular um pequeno delay visual
const fakeDelay = (ms = 0) => new Promise((res) => setTimeout(res, ms));

// helpers básicos de chamada HTTP
async function apiGet(path) {
  const resp = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`GET ${path} falhou: ${resp.status} ${text}`);
  }

  // pode não ter body (204)
  try {
    return await resp.json();
  } catch {
    return null;
  }
}

async function apiPost(path, body, options = {}) {
  const resp = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: body != null ? JSON.stringify(body) : null,
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`POST ${path} falhou: ${resp.status} ${text}`);
  }

  try {
    return await resp.json();
  } catch {
    return null;
  }
}

// helper pra pegar data.Course / data.course / data / etc.
function unwrapList(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return (
    data.Course ||
    data.Courses ||
    data.course ||
    data.courses ||
    data.items ||
    []
  );
}

// =======================
// LOGIN / USERS
// =======================

// POST /User/VerificaLogin?email=...&senha=...
export async function login(email, password) {
  await fakeDelay(100);

  const resp = await fetch(
    `${API_BASE_URL}/User/VerificaLogin?email=${encodeURIComponent(
      email
    )}&senha=${encodeURIComponent(password)}`,
    {
      method: 'POST',
    }
  );

  if (!resp.ok) {
    // login inválido
    return null;
  }

  // ➜ A API hoje só diz se é válido ou não.
  // Pegamos os dados do usuário do MOCK_DATA para manter tudo funcionando.
  let user = MOCK_DATA.users.find((u) => u.email === email);

  if (!user) {
    // se não achar, cria um user "genérico"
    const nameFromEmail = email.split('@')[0] || 'Usuário';
    user = {
      id: `local-${email}`,
      email,
      name: nameFromEmail,
      role: 'Colaborador',
      initials: nameFromEmail
        .split('.')
        .map((p) => p[0]?.toUpperCase())
        .join('') || email[0]?.toUpperCase() || 'U',
      department: 'N/A',
    };
  }

  return user;
}

export async function getModuleCompletionsByUser(userId) {
  const response = await api.get(`/moduleCompletion/user/${userId}`);
  return response.data;
}


// ainda não temos endpoint de GET Users no backend.
// mantemos MOCK_DATA pra Dashboard RH continuar funcionando.
export async function getUsers() {
  await fakeDelay(50);
  return [...MOCK_DATA.users];
}

// criar usuário: chama backend + mantém mock em sincronia básica
export async function createUser(userForm) {
  await fakeDelay(50);

  // tenta mandar pro backend (ajuste o shape conforme o modelo Users)
  try {
    await apiPost('/User/RegistraUsuario', {
      // mapeamento mais genérico possível:
      name: userForm.name,
      email: userForm.email,
      role: userForm.role,
      department: userForm.department,
      // se seu modelo tiver senha obrigatória, adicione aqui
      // password: "123456"
    });
  } catch (e) {
    console.error('Erro ao registrar usuário no backend:', e);
    // não dou throw pq quero manter o mock vivo
  }

  // mantém também no MOCK_DATA para o front continuar enxergando
  const exists = MOCK_DATA.users.some((u) => u.email === userForm.email);
  if (!exists) {
    const initials =
      userForm.name
        ?.split(' ')
        .map((p) => p[0]?.toUpperCase())
        .join('') || 'U';

    MOCK_DATA.users.push({
      id: `mock-${Date.now()}`,
      email: userForm.email,
      name: userForm.name,
      role: userForm.role || 'Colaborador',
      initials,
      department: userForm.department || '',
    });
  }

  return true;
}

// =======================
// COURSES
// =======================

// GET /Course/GetCourses
export async function getCourses() {
  const data = await apiGet('/Course/GetCourses');
  const list = unwrapList(data);

  // mapeia para o formato esperado pelo front
  return list.map((c) => ({
    id: c.id ?? c.Id ?? c.courseId ?? c.CourseId,
    code: c.code ?? c.Code ?? '',
    name: c.name ?? c.Nome ?? c.title ?? c.Title ?? '',
    description: c.description ?? c.Description ?? '',
    area: c.area ?? c.Area ?? '',
    level: c.level ?? c.Level ?? 'BASIC',
    estimated_duration_minutes:
      c.estimated_duration_minutes ??
      c.EstimatedDurationMinutes ??
      c.cargaHoraria ??
      c.CargaHoraria ??
      60,
    is_mandatory:
      c.is_mandatory ??
      c.IsMandatory ??
      c.obrigatorio ??
      c.Obrigatorio ??
      false,
    thumbnail_url: c.thumbnail_url ?? c.ThumbnailUrl ?? '',
  }));
}

// GET /Course/GetCourse/{id}
export async function getCourseById(courseId) {
  const data = await apiGet(`/Course/GetCourse/${courseId}`);
  const c =
    data?.Course ||
    data?.course ||
    data ||
    null;

  if (!c) return null;

  return {
    id: c.id ?? c.Id ?? c.courseId ?? c.CourseId,
    code: c.code ?? c.Code ?? '',
    name: c.name ?? c.Nome ?? c.title ?? c.Title ?? '',
    description: c.description ?? c.Description ?? '',
    area: c.area ?? c.Area ?? '',
    level: c.level ?? c.Level ?? 'BASIC',
    estimated_duration_minutes:
      c.estimated_duration_minutes ??
      c.EstimatedDurationMinutes ??
      c.cargaHoraria ??
      c.CargaHoraria ??
      60,
    is_mandatory:
      c.is_mandatory ??
      c.IsMandatory ??
      c.obrigatorio ??
      c.Obrigatorio ??
      false,
    thumbnail_url: c.thumbnail_url ?? c.ThumbnailUrl ?? '',
  };
}

// POST /Course/CriaCurso
export async function createCourse(courseForm) {
  await apiPost('/Course/CriaCurso', courseForm);
  return true;
}

// =======================
// MODULES (ETAPAS)
// =======================

// GET /Module/getModulesByCourse/{id}
export async function getModulesByCourse(courseId) {
  const data = await apiGet(`/Module/getModulesByCourse/${courseId}`);
  const list = unwrapList(data);

  return list
    .map((m) => ({
      id: m.id ?? m.Id ?? m.moduleId ?? m.ModuleId,
      course_id: m.course_id ?? m.CourseId ?? m.courseId,
      title: m.title ?? m.Titulo ?? m.Name ?? m.Nome,
      type: m.type ?? m.Type ?? 'VIDEO',
      order_index: m.order_index ?? m.OrderIndex ?? 1,
      content_url: m.content_url ?? m.ContentUrl ?? '',
      description: m.description ?? m.Description ?? '',
    }))
    .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
}

// GET /Module/getModules
export async function getModules() {
  const data = await apiGet('/Module/getModules');
  const list = unwrapList(data);

  return list.map((m) => ({
    id: m.id ?? m.Id ?? m.moduleId ?? m.ModuleId,
    course_id: m.course_id ?? m.CourseId ?? m.courseId,
    title: m.title ?? m.Titulo ?? m.Name ?? m.Nome,
    type: m.type ?? m.Type ?? 'VIDEO',
    order_index: m.order_index ?? m.OrderIndex ?? 1,
    content_url: m.content_url ?? m.ContentUrl ?? '',
    description: m.description ?? m.Description ?? '',
  }));
}

// GET módulo por id (front usa isso)
export async function getModuleById(moduleId) {
  // não temos endpoint específico, então pegamos todos e filtramos
  const all = await getModules();
  return all.find((m) => String(m.id) === String(moduleId)) || null;
}

// POST /Module/CreateModule
export async function createModule(moduleForm) {
  await apiPost('/Module/CreateModule', moduleForm);
  return true;
}

// POST /Module/completeModule
export async function completeModule(userId, moduleId) {
  await apiPost('/Module/completeModule', {
    userId,
    moduleId,
  });
  return true;
}

// =======================
// ENROLLMENTS (INSCRIÇÕES)
// =======================

// GET /Enrollment/GetEnrollments
export async function getEnrollments() {
  const data = await apiGet('/Enrollment/GetEnrollments');
  const list = unwrapList(data);

  return list.map((e) => ({
    id: e.id ?? e.Id,
    user_id: e.user_id ?? e.UserId,
    course_id: e.course_id ?? e.CourseId,
    status: e.status ?? e.Status ?? 'NOT_STARTED',
    completed_at: e.completed_at ?? e.CompletedAt ?? null,
  }));
}

// GET /Enrollment/GetEnrollmentsByUser/{id}
export async function getEnrollmentsByUser(userId) {
  const data = await apiGet(`/Enrollment/GetEnrollmentsByUser/${userId}`);
  const list = unwrapList(data);

  return list.map((e) => ({
    id: e.id ?? e.Id,
    user_id: e.user_id ?? e.UserId,
    course_id: e.course_id ?? e.CourseId,
    status: e.status ?? e.Status ?? 'NOT_STARTED',
    completed_at: e.completed_at ?? e.CompletedAt ?? null,
  }));
}

// ainda não temos endpoint pra "concluir curso" no backend.
// mantemos um ajuste em memória para não quebrar o front.
export async function completeCourse(userId, courseId) {
  await fakeDelay(50);

  const existing = MOCK_DATA.enrollments.find(
    (e) => e.user_id === userId && e.course_id === courseId
  );

  if (existing) {
    existing.status = 'COMPLETED';
    existing.completed_at = new Date().toISOString();
  } else {
    MOCK_DATA.enrollments.push({
      id: `mock-enr-${Date.now()}`,
      user_id: userId,
      course_id: courseId,
      status: 'COMPLETED',
      completed_at: new Date().toISOString(),
    });
  }

  return true;
}

// =======================
// QUIZ
// =======================

// GET /Quiz/getQuizByModule/{moduleId}
export async function getQuizByModule(moduleId) {
  const data = await apiGet(`/Quiz/getQuizByModule/${moduleId}`);
  if (!data) return null;

  const q = data.quiz || data.Quiz || data;

  return {
    id: q.id ?? q.Id,
    module_id: q.module_id ?? q.ModuleId,
    passing_score: q.passing_score ?? q.PassingScore ?? 70,
  };
}

// GET /Quiz/getQuestions/{quizId}
export async function getQuizQuestions(quizId) {
  const data = await apiGet(`/Quiz/getQuestions/${quizId}`);
  const list = unwrapList(data);

  return list
    .map((q) => ({
      id: q.id ?? q.Id,
      quiz_id: q.quiz_id ?? q.QuizId,
      question_text: q.question_text ?? q.QuestionText,
      type: q.type ?? q.Type ?? 'MULTIPLE_CHOICE',
      order_index: q.order_index ?? q.OrderIndex ?? 1,
    }))
    .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
}

// GET /Quiz/getOptions/{questionId}
export async function getOptionsByQuestion(questionId) {
  const data = await apiGet(`/Quiz/getOptions/${questionId}`);
  const list = unwrapList(data);

  return list.map((o) => ({
    question_id: o.question_id ?? o.QuestionId,
    option_text: o.option_text ?? o.OptionText,
    is_correct:
      o.is_correct ??
      o.IsCorrect ??
      false,
  }));
}

// GET /Quiz/getQuizWithQuestions/{moduleId}
export async function getQuizWithQuestionsByModule(moduleId) {
  const data = await apiGet(`/Quiz/getQuizWithQuestions/${moduleId}`);
  if (!data) return null;

  // se o backend já retorna { quiz, questions }, tentamos aproveitar direto:
  const rawQuiz = data.quiz || data.Quiz || data;
  const rawQuestions = data.questions || data.Questions || data.items || [];

  const quiz = {
    id: rawQuiz.id ?? rawQuiz.Id,
    module_id: rawQuiz.module_id ?? rawQuiz.ModuleId,
    passing_score: rawQuiz.passing_score ?? rawQuiz.PassingScore ?? 70,
  };

  const questions = rawQuestions.map((q) => ({
    id: q.id ?? q.Id,
    quiz_id: q.quiz_id ?? q.QuizId,
    question_text: q.question_text ?? q.QuestionText,
    type: q.type ?? q.Type ?? 'MULTIPLE_CHOICE',
    order_index: q.order_index ?? q.OrderIndex ?? 1,
    options: (q.options || q.Options || []).map((o) => ({
      question_id: o.question_id ?? o.QuestionId,
      option_text: o.option_text ?? o.OptionText,
      is_correct:
        o.is_correct ??
        o.IsCorrect ??
        false,
    })),
  }));

  return { quiz, questions };
}

// POST /Quiz/createQuiz
export async function createQuizWithQuestions(dto) {
  await apiPost('/Quiz/createQuiz', dto);
  return true;
}

// ainda não temos endpoints pra tentativas de quiz no backend.
// mantemos mock pra Dashboard RH.
export async function getQuizAttempts() {
  await fakeDelay(50);
  return [...MOCK_DATA.quiz_attempts];
}

// idem para lista de quizzes genérica
export async function getQuizzes() {
  await fakeDelay(50);
  return [...MOCK_DATA.quizzes];
}

// =======================
// CERTIFICADO / ASSINATURA
// =======================

// ainda não há endpoint de certificado no backend, então geramos só um "hash"
// local (pode ser substituído depois por um endpoint de emissão).
export async function issueCertificate(userId, courseId) {
  await fakeDelay(50);

  const code = crypto.randomUUID();
  const issued_at = new Date().toISOString();

  return {
    id: code,
    user_id: userId,
    course_id: courseId,
    issued_at,
    code,
  };
}
