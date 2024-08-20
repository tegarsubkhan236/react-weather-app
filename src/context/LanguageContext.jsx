import {createContext, useContext, useState} from 'react';
import en from "../translation/en.json";
import id from "../translation/id.json";

export const LanguageContext = createContext();

const translation = {
    en,
    id
}

const getDefaultLanguage = () => {
    const systemLanguage = navigator.language || 'en';
    const languageCode = systemLanguage.split('-')[0];
    return (languageCode === 'id' || languageCode === 'en') ? languageCode : 'en';
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(getDefaultLanguage);

    const toggleLanguage = (value = 'en') => {
        setLanguage(['en', 'id'].includes(value) ? value : 'en');
    };

    const translate = (key) => {
        const languageTranslations = translation[language] || translation.en;
        return languageTranslations[key] || key;
    };

    const getDaysOfWeek = () => translation[language]["days_of_week"];

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, translate, getDaysOfWeek }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);