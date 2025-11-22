import React from 'react';

const GlobalStyles = () => (
  <style jsx="true">{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

    :root {
      /* Base: Azul-Marinho e Cinza (Mesmo do Anterior, Sóbrio) */
      --color-dark-navy: #0F172A; /* Fundo Principal */
      --color-mid-slate: #1E293B; /* Card/Container Principal */
      --color-light-slate: #334155; /* Borda/Hover/Detalhes */
      
      /* Novos Acentos: Somente Azul Elétrico e Sombra */
      --color-accent-blue: #3B82F6; /* Azul Elétrico Padrão (Substitui Ciano/Magenta) */
      --color-accent-shadow: #1D4ED8; /* Azul Escuro para Sombra/Gradiente */
      
      /* Texto */
      --color-text-light: #F1F5F9; /* Texto Principal */
      --color-text-subtle: #94A3B8; /* Texto Secundário/Inativo */
    }

    /* === Estilos Globais === */

    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--color-dark-navy);
      color: var(--color-text-light);
    }

    /* === Card === */
    .card {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); 
      transition: all 0.3s ease-in-out;
      border: 1px solid var(--color-light-slate); 
      border-radius: 0.75rem;
      background-color: var(--color-mid-slate); 
    }
    .card:hover {
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
      transform: translateY(-4px);
    }

    /* === Botão Primário === */
    .btn-primary {
      /* Gradiente de Azul Sutil: do Azul Elétrico (claro) para o Azul Escuro (sombra) */
      background: linear-gradient(90deg, var(--color-accent-blue) 0%, var(--color-accent-shadow) 100%);
      color: white; /* Voltando para o texto branco no botão azul */
      font-weight: 700;
      border: none;
      transition: opacity 0.3s, transform 0.2s;
    }
    .btn-primary:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    /* === Navegação === */
    .nav-item {
      cursor: pointer;
      padding: 8px 16px;
      border-radius: 9999px;
      transition: background-color 0.2s, color 0.2s;
      color: var(--color-text-subtle);
    }
    .nav-item:hover {
      background-color: var(--color-light-slate);
      color: var(--color-text-light);
    }
    .active-nav {
      background: var(--color-light-slate);
      color: var(--color-text-light);
      font-weight: 600;
    }

    /* === Outros Componentes === */
    .text-dark-theme {
      color: var(--color-text-light);
    }
    
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      /* Usa o Azul Elétrico como fundo */
      background-color: var(--color-accent-blue); 
      color: var(--color-text-light);
      font-weight: 700;
      font-size: 16px;
      /* Aro também em Azul Elétrico */
      box-shadow: 0 0 0 2px var(--color-mid-slate), 0 0 0 4px var(--color-accent-blue);
    }

    .metric-card {
      padding: 1rem;
      border-radius: 1rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
      background-color: var(--color-mid-slate);
    }

    /* === Certificado === */
    .certificate-border {
      padding: 30px;
      /* Usa o Azul Elétrico para a borda */
      border: 5px solid var(--color-accent-blue); 
      background-color: #FFFFFF;
      color: var(--color-dark-navy);
      text-align: center;
      max-width: 900px;
      margin: 2rem auto;
    }
    .certificate-inner-border {
      padding: 20px;
      /* Usa o Azul Elétrico para a borda interna */
      border: 1px dashed var(--color-accent-blue);
    }
    
    @media print {
      .no-print { display: none !important; }
      body { background-color: white !important; padding: 0; margin: 0; }
      #app-container { box-shadow: none !important; border-radius: 0 !important; background-color: white !important; }
      #certificate-view { display: block !important; width: 100%; min-height: 100vh; padding: 0; }
      .certificate-border { border: 5px solid var(--color-accent-blue); box-shadow: none; page-break-after: always; width: 100%; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; }
      .certificate-inner-border { width: 90%; max-width: 800px; }
    }
  `}</style>
);

export default GlobalStyles;