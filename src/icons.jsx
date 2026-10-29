import React from 'react';

// Изометрические иконки в духе Linear: сетка 16×16, обводка 1.35, скруглённые стыки.
// Изометрия: верх (8,1.5) · лево (2,5) · право (14,5) · центр (8,8.5) · низ (8,14.5).
const Base = ({ children, className, title }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" strokeLinecap="round"
    className={className} aria-hidden={title ? undefined : 'true'} role={title ? 'img' : undefined}>
    {title && <title>{title}</title>}
    {children}
  </svg>
);

export const IsoHome = (p) => (
  <Base {...p}>
    <path d="M8 1.6 13.8 6v5.4L8 14.6 2.2 11.4V6z" />
    <path d="M2.2 6 8 9.3 13.8 6M8 1.6v13" />
    <path d="M4.3 9.4v2.3l1.8 1V10.4z" />
  </Base>
);

export const IsoLayers = (p) => (
  <Base {...p}>
    <path d="M8 1.8 14 5 8 8.2 2 5z" />
    <path d="M2 8 8 11.2 14 8" />
    <path d="M2 11 8 14.2 14 11" />
  </Base>
);

export const IsoPeople = (p) => (
  <Base {...p}>
    <circle cx="6" cy="4.6" r="2" />
    <path d="M1.8 11.6 6 9.3l4.2 2.3L6 13.9z" />
    <circle cx="11.3" cy="4.2" r="1.6" />
    <path d="M11 8.5l3.2 1.8-1.6.9" />
  </Base>
);

export const IsoPerson = (p) => (
  <Base {...p}>
    <circle cx="8" cy="4.8" r="2.4" />
    <path d="M2.5 11.4 8 8.4l5.5 3L8 14.4z" />
  </Base>
);

export const IsoRoom = (p) => (
  <Base {...p}>
    <path d="M8 1.6 14 5v6.2l-6 3.3-6-3.3V5z" />
    <path d="M2 5l6 3.4L14 5M8 8.4v6.1" />
    <path d="M10 10.2v3.1l2-1.1v-3.1z" />
  </Base>
);

export const IsoTerminal = (p) => (
  <Base {...p}>
    <path d="M2 2.6 11.6 8v4.6L2 7.2z" />
    <path d="M11.6 8 13.4 7v4.6l-1.8 1" />
    <path d="M4.2 4.9l1.7 1.6-1.7.6" />
    <path d="M6.8 10.2v2M4.6 13.1l2.2-1.2 2.2 1.2-2.2 1.2z" />
  </Base>
);

export const IsoDoc = (p) => (
  <Base {...p}>
    <path d="M3.5 2.2 10 5.8v7.9L3.5 10.1z" />
    <path d="M10 5.8 12.5 4.4v7.9L10 13.7" />
    <path d="M5.3 5.4l3 1.7M5.3 7.6l3 1.7M5.3 9.8l1.8 1" />
  </Base>
);

export const IsoBook = (p) => (
  <Base {...p}>
    <path d="M8 5.6 2 2.4v8l6 3.2 6-3.2v-8z" />
    <path d="M8 5.6v8" />
    <path d="M3.8 5.6l2.4 1.3M3.8 7.8l2.4 1.3M12.2 5.6l-2.4 1.3" />
  </Base>
);

export const IsoBox = (p) => (
  <Base {...p}>
    <path d="M2.5 6.3 8.2 9.5v5L2.5 11.3z" />
    <path d="M8.2 9.5l5.3-3v5l-5.3 3" />
    <path d="M2.5 6.3 7.8 3.3l5.7 3.2" />
    <path d="M5.4 7.9c-.3-3.4 4.6-4.4 5-.6" />
  </Base>
);

export const IsoCube = (p) => (
  <Base {...p}>
    <path d="M8 2 13.5 5.1v5.8L8 14 2.5 10.9V5.1z" />
    <path d="M2.5 5.1 8 8.2l5.5-3.1M8 8.2V14" />
  </Base>
);

export const IsoSearch = (p) => (
  <Base {...p}>
    <circle cx="7" cy="7" r="4.4" />
    <path d="M10.3 10.3 14 14" />
  </Base>
);

export const PanelToggle = (p) => (
  <Base {...p}>
    <rect x="2" y="2.5" width="12" height="11" rx="2.2" />
    <path d="M6 2.8v10.4" />
  </Base>
);

export const Caret = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true"><path d="M5 6.5 8 9.5l3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const CaretRight = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true"><path d="M6.5 5 9.5 8l-3 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
