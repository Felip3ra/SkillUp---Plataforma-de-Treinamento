// src/services/skillupApi.js
import { MOCK_DATA } from '../mockData';

// ENDEREÇO DA SUA API .NET
// ajuste para o host/porta que você estiver usando (https://localhost:7087, http://localhost:5000, etc.)
const API_BASE_URL = 'https://localhost:7087';

// se quiser simular um pequeno delay visual
const fakeDelay = (ms = 0) => new Promise((res) => setTimeout(res, ms));

// =======================
// HELPERS HTTP BÁSICOS
// =======================

async function apiGet(path) {
  const resp = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`GET ${path} falhou: ${resp.status} ${text}`);
  }

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

  const data = await resp.json().catch(() => null);
  const backendUser = data?.User || data?.user || data;

  if (!backendUser) {
    return null;
  }

  // nome
  const name =
    backendUser.name ||
    backendUser.Nome ||
    email.split('@')[0] ||
    'Usuário';

  // email
  const emailFromApi = backendUser.email || backendUser.Email || email;

  // role numérica (ex.: 1 = Colaborador, 2 = Admin/RH, 3 = Gestor...)
  const role =
    backendUser.role ??
    backendUser.Role ??
    backendUser.roleId ??
    backendUser.RoleId ??
    1;

  // departamento
  const department =
    backendUser.department || backendUser.Department || '';

  // iniciais
  const initials =
    name
      .split(' ')
      .map((p) => p[0]?.toUpperCase())
      .join('') || emailFromApi[0]?.toUpperCase() || 'U';

  const user = {
    id:
      backendUser.id ??
      backendUser.Id ??
      backendUser.userId ??
      backendUser.UserId ??
      emailFromApi,
    email: emailFromApi,
    name,
    role, // numérico – o front já trata (ex.: role === 2 => Admin/RH)
    department,
    initials,
  };

  return user;
}

// (placeholder) – se um dia tiver endpoint pra isso
export async function getModuleCompletionsByUser(userId) {
  const data = await apiGet(`/moduleCompletion/user/${userId}`).catch(() => null);
  const list = unwrapList(data);
  return list;
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
      name: userForm.name,
      email: userForm.email,
      // se o modelo de Users tiver estes campos:
      // password: userForm.password || '123456',
      // department, role numérica etc – ajuste conforme o domínio
      department: userForm.department,
      role: userForm.role,
    });
  } catch (e) {
    console.error('Erro ao registrar usuário no backend:', e);
    // não dou throw pra não quebrar o front caso a API esteja off
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
  const c = data?.Course || data?.course || data || null;

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

function mapLevelToBackend(level) {
  switch (level) {
    case 'BASIC':
      return 0; // Basico
    case 'INTERMEDIATE':
      return 1; // Intermediario
    case 'ADVANCED':
      return 2; // Avancado
    default:
      return 0;
  }
}

// POST /Course/CriaCurso
export async function createCourse(courseForm, creatorId) {
  const payload = {
    course: {
      code: courseForm.code,
      name: courseForm.name,
      description: courseForm.description,
      area: courseForm.area,
      // enviar como string que o enum espera
      level: courseForm.level, // "BASIC", "INTERMEDIATE" ou "ADVANCED"
      estimatedDurationMinutes: Number(courseForm.estimated_duration_minutes) || 0,
      isMandatory: !!courseForm.is_mandatory,
      thumbnailUrl: courseForm.thumbnail_url,
      createdById: Number(creatorId),
      modules: [],        // se requerido
      enrollments: []     // se requerido
    }
  };

  await apiPost('/Course/CriaCurso', payload);
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

// não temos endpoint específico de módulo por id → carrega todos e filtra
export async function getModuleById(moduleId) {
  const all = await getModules();
  return all.find((m) => String(m.id) === String(moduleId)) || null;
}

// POST /Module/CreateModule
export async function createModule(moduleForm) {
  const resp = await apiPost('/Module/CreateModule', moduleForm);
  // se o backend já devolver o módulo criado com Id, usamos; senão, retornamos um objeto simples
  const m = resp?.Course || resp?.Module || resp?.module || null;

  if (m) {
    return {
      id: m.id ?? m.Id ?? m.moduleId ?? m.ModuleId,
      course_id: m.course_id ?? m.CourseId ?? m.courseId ?? moduleForm.course_id,
      title: m.title ?? m.Titulo ?? m.Name ?? m.Nome ?? moduleForm.title,
      type: m.type ?? m.Type ?? moduleForm.type ?? 'VIDEO',
      order_index: m.order_index ?? m.OrderIndex ?? moduleForm.order_index ?? 1,
      content_url: m.content_url ?? m.ContentUrl ?? moduleForm.content_url ?? '',
      description: m.description ?? m.Description ?? moduleForm.description ?? '',
    };
  }

  // fallback – se a API não retornar o módulo, devolve só o form
  return {
    id: null,
    ...moduleForm,
  };
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
    is_correct: o.is_correct ?? o.IsCorrect ?? false,
  }));
}

// GET /Quiz/getQuizWithQuestions/{moduleId}
export async function getQuizWithQuestionsByModule(moduleId) {
  const data = await apiGet(`/Quiz/getQuizWithQuestions/${moduleId}`);
  if (!data) return null;

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
      is_correct: o.is_correct ?? o.IsCorrect ?? false,
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
// CERTIFICADO / ASSINATURA (LOCAL)
// =======================

// por enquanto só gera um código local – dá pra trocar depois
// por um endpoint de emissão/com assinatura digital do backend
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
