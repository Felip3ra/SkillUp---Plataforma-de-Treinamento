// src/views/Player.jsx
import React from 'react';
import { VIEWS } from '../constants';
import {
  getModulesByCourse,
  completeModule,
  completeCourse,
} from '../services/skillupApi';

const Player = ({
  currentCourse,
  currentModule,
  currentUser,
  navTo,
  loadModulePlayer,
  loadCertificate,
}) => {
  if (!currentModule) {
    return <div className="text-center text-gray-400">Módulo não carregado.</div>;
  }

  // Helper para YouTube
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;

    try {
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        const v = urlObj.searchParams.get('v');
        if (v) return `https://www.youtube.com/embed/${v}`;
      }

      if (url.includes('youtu.be/')) {
        const parts = url.split('/');
        const id = parts[parts.length - 1].split('?')[0];
        if (id) return `https://www.youtube.com/embed/${id}`;
      }

      return null;
    } catch {
      return null;
    }
  };

  const renderContent = () => {
    if (currentModule.type === 'VIDEO') {
      const url = currentModule.content_url;
      const embedUrl = getYouTubeEmbedUrl(url);

      if (embedUrl) {
        return (
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
            <iframe
              src={embedUrl}
              title={currentModule.title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        );
      }

      return (
        <video
          className="w-full aspect-video rounded-xl bg-black"
          controls
          poster={`https://placehold.co/800x450/${'0f172a'.replace(
            '#',
            ''
          )}/${'ffffff'.replace('#', '')}?text=Video+Player`}
        >
          <source src={currentModule.content_url} type="video/mp4" />
        </video>
      );
    }

    return (
      <div className="text-center p-10">
        {currentModule.content_url ? (
          <a
            href={currentModule.content_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold"
            style={{ color: 'var(--color-accent-blue)' }}
          >
            Abrir Documento
          </a>
        ) : (
          <span style={{ color: 'var(--color-text-subtle)' }}>
            Conteúdo não disponível.
          </span>
        )}
      </div>
    );
  };

  const handleConclude = async () => {
    if (!currentUser || !currentCourse || !currentModule) return;

    // 1) marca módulo como concluído (mock/API)
    await completeModule(currentUser.id, currentModule.id);

    // 2) pega todos os módulos desse curso ordenados
    const modules = await getModulesByCourse(currentCourse.id);
    const idx = modules.findIndex((m) => m.id === currentModule.id);
    const next = modules[idx + 1];

    if (next) {
      // 3) se existe próximo módulo → vai direto pra ele
      loadModulePlayer(next.id);
    } else {
      // 4) se NÃO existe próximo → conclui o curso
      await completeCourse(currentUser.id, currentCourse.id);

      // 5) tenta ir pro certificado; se não tiver função, volta pro detalhe do curso
      if (typeof loadCertificate === 'function') {
        loadCertificate();
      } else {
        navTo(VIEWS.COURSE_DETAIL);
      }
    }
  };

  return (
    <div id="player-view" className="view">
      <button
        onClick={() => navTo(VIEWS.COURSE_DETAIL)}
        className="mb-4 flex items-center font-medium"
        style={{ color: 'var(--color-accent-blue)' }}
      >
        &larr; Voltar aos Detalhes
      </button>

      <h2 className="text-2xl font-bold text-dark-theme mb-2">
        {currentModule.title}
      </h2>
      <p
        className="text-sm mb-6"
        style={{ color: 'var(--color-text-subtle)' }}
      >
        {currentCourse?.name}
      </p>

      <div
        id="content-player"
        className="p-4 rounded-xl min-h-[400px] flex items-center justify-center mb-6 border"
        style={{
          backgroundColor: '#000000',
          borderColor: 'var(--color-light-slate)',
        }}
      >
        <div id="content-container" className="w-full">
          {renderContent()}
        </div>
      </div>

      <div
        id="player-description"
        className="p-4 rounded-xl"
        style={{
          backgroundColor: 'var(--color-mid-slate)',
          border: '1px solid var(--color-light-slate)',
        }}
      >
        <h4 className="font-semibold text-lg mb-2 text-dark-theme">
          Descrição
        </h4>
        <p style={{ color: 'var(--color-text-subtle)' }}>
          {currentModule.description || 'Conteúdo simulado.'}
        </p>
      </div>

      <button
        id="concluir-modulo-btn"
        className="btn-primary w-full mt-6 py-3 px-4 rounded-xl shadow-md font-semibold transition"
        onClick={handleConclude}
      >
        Concluir Módulo
      </button>
    </div>
  );
};

export default Player;
