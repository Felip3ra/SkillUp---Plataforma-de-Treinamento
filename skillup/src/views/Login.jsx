import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('colaborador@skillup.com');
  const [password, setPassword] = useState('123456');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="card p-8 rounded-2xl shadow-2xl w-full max-w-md">
      <div className="flex flex-col items-center mb-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 text-white p-2 rounded-full"
          // MUDANÇA: Usando um gradiente de tons de azul (`--color-accent-blue` e `--color-accent-shadow`)
          style={{ background: 'linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-shadow))' }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2L1 7l11 5 11-5-11-5zm0 18l-5-2.27V13.8l5 2.2V20zm0-4.72l-5-2.2v-2.3l5 2.2v2.3zm0-4.7l-5-2.2V7l5-2.2 5 2.2v2.3l-5 2.2z" />
        </svg>
        <h1 className="text-3xl font-extrabold text-white mt-4" id="app-title">
          SkillUp Academy
        </h1>
        <p className="text-center text-gray-400 mt-2">
          Plataforma de Treinamento Corporativo
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email Corporativo
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="seu.nome@empresa.com.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-lg text-white focus:ring-accent-blue focus:border-accent-blue shadow-sm transition duration-150 ease-in-out"
            // MUDANÇA: Usando as novas variáveis de cor mid-slate e light-slate
            style={{ backgroundColor: 'var(--color-mid-slate)', borderColor: 'var(--color-light-slate)' }}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            Senha
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-lg text-white focus:ring-accent-blue focus:border-accent-blue shadow-sm transition duration-150 ease-in-out"
            // MUDANÇA: Usando as novas variáveis de cor mid-slate e light-slate
            style={{ backgroundColor: 'var(--color-mid-slate)', borderColor: 'var(--color-light-slate)' }}
          />
        </div>
        <div>
          <button
            type="submit"
            className="btn-primary w-full flex justify-center py-2.5 px-4 rounded-xl shadow-lg text-base transition duration-150 ease-in-out"
          >
            Entrar na Plataforma
          </button>
        </div>
      </form>
      <p className="text-xs text-gray-400 mt-6 text-center">
        Use 'colaborador@skillup.com' para colaborador ou 'rh@skillup.com' para a visão do gestor.
      </p>
    </div>
  );
};

export default Login;