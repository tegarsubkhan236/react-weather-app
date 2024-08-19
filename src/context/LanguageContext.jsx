import { createContext, useState } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const getDefaultLanguage = () => {
        const systemLanguage = navigator.language || 'en';
        const languageCode = systemLanguage.split('-')[0];
        return (languageCode === 'id' || languageCode === 'en') ? languageCode : 'en';
    };

    const [language, setLanguage] = useState(getDefaultLanguage);

    const toggleLanguage = (value) => {
        if (value === 'en' || value === 'id') {
            setLanguage(value);
        } else {
            setLanguage("en")
        }
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};