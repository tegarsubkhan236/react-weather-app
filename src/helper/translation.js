import en from '../translation/en.json'
import id from '../translation/id.json'

const translation = {
    en,
    id
}

export const translate = (key, language) => {
    const languageTranslations = translation[language] || translation.en;
    return languageTranslations[key] || key;
};

export const getDaysOfWeek = (language = 'en') => {
    return translation[language]["days_of_week"];
};