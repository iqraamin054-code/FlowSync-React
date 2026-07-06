import React from 'react';

export const LanguageContext = React.createContext(null);

export function LanguageProvider({ children }) {
  return <LanguageContext.Provider value={{ language: 'en' }}>{children}</LanguageContext.Provider>;
}
