import React, { createContext, useState, useContext, useEffect } from 'react';

const ResumeContext = createContext();
export const useResume = () => useContext(ResumeContext);

const DEFAULT_SECTION_ORDER = [
    'education',
    'experience',
    'organizations',
    'certifications',
    'languages',
    'skills',
    'courses',
    'references',
];

const INITIAL_STATE = {
    personalInfo: {
        firstName: '',
        lastName: '',
        jobTitle: '',
        email: '',
        phone: '',
        country: '',
        city: '',
        address: '',
        postalCode: '',
        drivingLicense: '',
        nationality: '',
        placeOfBirth: '',
        dateOfBirth: '',
        linkedin: '',
        website: '',
        photoUrl: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    organizations: [],
    languages: [],
    courses: [],
    references: [],
    certifications: [],
    customSections: [],
    themeColor: '#007BFF',
    textColor: '#000000',
    template: 'modern',
    font: 'Times New Roman',
    language: 'en',
    sectionOrder: DEFAULT_SECTION_ORDER,
    showPhoto: true,
    photoShape: 'circle',
    photoOutline: false,
};

export const ResumeProvider = ({ children }) => {
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedData = localStorage.getItem('resumeData');
        const sanitizeData = (data) => {
            if (!data) return INITIAL_STATE;
            const ensureArray = (arr) => Array.isArray(arr) ? arr : [];
            return {
                ...INITIAL_STATE,
                ...data,
                personalInfo: { ...INITIAL_STATE.personalInfo, ...(data.personalInfo || {}) },
                experience: ensureArray(data.experience),
                education: ensureArray(data.education),
                skills: ensureArray(data.skills),
                organizations: ensureArray(data.organizations),
                languages: ensureArray(data.languages),
                courses: ensureArray(data.courses),
                references: ensureArray(data.references),
                certifications: ensureArray(data.certifications),
                customSections: ensureArray(data.customSections),
                sectionOrder: Array.isArray(data.sectionOrder) && data.sectionOrder.length > 0
                    ? data.sectionOrder
                    : DEFAULT_SECTION_ORDER,
                textColor: data.textColor || '#000000',
            };
        };

        if (savedData) {
            try {
                setResumeData(sanitizeData(JSON.parse(savedData)));
            } catch (e) {
                console.error("Failed to parse resume data", e);
                setResumeData(INITIAL_STATE);
            }
        } else {
            setResumeData(INITIAL_STATE);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (resumeData) {
            localStorage.setItem('resumeData', JSON.stringify(resumeData));
        }
    }, [resumeData]);

    const updateResumeData = (newData) => {
        setResumeData(prev => ({
            ...prev,
            ...newData
        }));
    };

    const updateSection = (section, data) => {
        setResumeData(prev => ({ ...prev, [section]: data }));
    };

    const resetResume = () => {
        if (window.confirm("Are you sure you want to clear all data? This cannot be undone.")) {
            setResumeData(INITIAL_STATE);
            localStorage.removeItem('resumeData');
        }
    };

    const fetchResume = () => { };
    const saveResume = () => { };
    const createResume = () => { };

    return (
        <ResumeContext.Provider value={{
            resumeData,
            loading,
            updateResumeData,
            updateSection,
            resetResume,
            fetchResume,
            saveResume,
            createResume,
            saving: false
        }}>
            {children}
        </ResumeContext.Provider>
    );
};