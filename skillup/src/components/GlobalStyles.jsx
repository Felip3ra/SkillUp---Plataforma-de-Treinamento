import React from 'react';

const GlobalStyles = () => (
  <style jsx="true">{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

    :root {
      --color-dark-navy: #0F172A;
      --color-mid-slate: #1E293B;
      --color-light-slate: #334155;
      --color-accent-blue: #3B82F6;
      --color-accent-shadow: #1D4ED8;
      --color-text-light: #F1F5F9;
      --color-text-subtle: #94A3B8;
    }

    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--color-dark-navy);
      color: var(--color-text-light);
    }

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

    .btn-primary {
      background: linear-gradient(90deg, var(--color-accent-blue) 0%, var(--color-accent-shadow) 100%);
      color: white;
      font-weight: 700;
      border: none;
      transition: opacity 0.3s, transform 0.2s;
    }
    .btn-primary:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

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
      background-color: var(--color-accent-blue);
      color: var(--color-text-light);
      font-weight: 700;
      font-size: 16px;
      box-shadow: 0 0 0 2px var(--color-mid-slate), 0 0 0 4px var(--color-accent-blue);
    }

    .metric-card {
      padding: 1rem;
      border-radius: 1rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
      background-color: var(--color-mid-slate);
    }

    /* Certificado – visual normal */
    .certificate-border {
      padding: 30px;
      border: 5px solid var(--color-accent-blue);
      background-color: #FFFFFF;
      color: var(--color-dark-navy);
      text-align: center;
      max-width: 900px;
      margin: 2rem auto;
      box-sizing: border-box;
    }
    .certificate-inner-border {
      padding: 20px;
      border: 1px dashed var(--color-accent-blue);
      box-sizing: border-box;
    }

    .no-print {
      /* só uma flag pra usar nos botões/links que não devem aparecer no PDF */
    }

    /* ================== IMPRESSÃO / PDF ================== */
    @media print {
      @page {
        size: A4 landscape;
        margin: 0;
      }

      html, body {
        width: 297mm;
        height: 210mm;
        margin: 0;
        padding: 0;
        background: #ffffff !important;
      }

      /* Esconde tudo por padrão */
      body * {
        visibility: hidden;
      }

      /* Mostra apenas o certificado */
      #certificate-view,
      #certificate-view * {
        visibility: visible;
      }

      /* Remove qualquer resto visual */
      #app-container {
        box-shadow: none !important;
        border-radius: 0 !important;
        background-color: #ffffff !important;
      }

      /* Zona do certificado ocupa EXATAMENTE a página */
      #certificate-view {
        position: fixed;
        inset: 0;
        margin: 0;
        padding: 0;
        width: 297mm;
        height: 210mm;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ffffff !important;
        overflow: hidden;
        page-break-after: avoid;
        page-break-before: avoid;
        page-break-inside: avoid;
      }

      .certificate-border {
        width: 270mm;      /* um pouco menor que a página */
        height: 180mm;     /* um pouco menor que a página */
        margin: 0;
        padding: 15mm;
        box-sizing: border-box;
        box-shadow: none !important;
        page-break-inside: avoid;
      }

      .certificate-inner-border {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: hidden;
      }

      .no-print {
        display: none !important;
      }
    }
  `}</style>
);

export default GlobalStyles;
