'use client'

import { useContext } from 'react';
import LanguageContext from '@/app/context/LanguageContext';
import translations from '../translations';

const getNestedTranslation = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const useTranslation = () => {
    const { language } = useContext(LanguageContext);

    const t = (key) => {
        const translation = getNestedTranslation(translations[language], key);
        return translation || key;
    };

    return { t };
};

export default useTranslation;