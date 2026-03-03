import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

class SafeMarkdown extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        console.error("Markdown rendering error:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return <div className="whitespace-pre-wrap">{this.props.content}</div>;
        }
        return this.props.children;
    }
    componentDidUpdate(prevProps) {
        if (prevProps.content !== this.props.content && this.state.hasError) {
            this.setState({ hasError: false });
        }
    }
}

const formatDate = (dateString) => {
    if (!dateString) return '';
    const match = dateString.match(/^(\d{4})-(\d{2})$/);
    if (match) {
        const [_, year, month] = match;
        const date = new Date(year, parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    return dateString;
};

const MarkdownRenderer = ({ content }) => {
    if (!content) return null;
    return (
        <SafeMarkdown content={content}>
            <div className="prose prose-sm max-w-none prose-p:my-0 prose-ul:my-0 leading-snug break-words">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {content}
                </ReactMarkdown>
            </div>
        </SafeMarkdown>
    );
};

const ProfessionalTemplate = ({ data }) => {
    const safeData = data || {};
    const {
        personalInfo = {},
        summary = '',
        experience = [],
        education = [],
        skills = [],
        organizations = [],
        languages = [],
        courses = [],
        references = [],
        certifications = [],
        customSections = [],
        font,
        language,
        sectionOrder = ['education', 'experience', 'organizations', 'certifications', 'languages', 'skills', 'courses', 'references'],
    } = safeData;

    const fontStyle = { fontFamily: font || '"Times New Roman", Times, serif' };
    const lang = language || 'en';

    const t = {
        profile: lang === 'id' ? 'PROFIL' : 'PROFILE',
        experience: lang === 'id' ? 'PENGALAMAN KERJA' : 'EXPERIENCE',
        education: lang === 'id' ? 'PENDIDIKAN' : 'EDUCATION',
        skills: lang === 'id' ? 'KEAHLIAN' : 'SKILLS',
        organizations: lang === 'id' ? 'ORGANISASI' : 'ORGANIZATIONS',
        languages: lang === 'id' ? 'BAHASA' : 'LANGUAGES',
        courses: lang === 'id' ? 'KURSUS' : 'COURSES',
        certifications: lang === 'id' ? 'SERTIFIKASI' : 'CERTIFICATIONS',
        references: lang === 'id' ? 'REFERENSI' : 'REFERENCES',
        present: lang === 'id' ? 'Sekarang' : 'Present'
    };

    const safeExperience = Array.isArray(experience) ? experience : [];
    const safeEducation = Array.isArray(education) ? education : [];
    const safeSkills = Array.isArray(skills) ? skills : [];
    const safeOrganizations = Array.isArray(organizations) ? organizations : [];
    const safeLanguages = Array.isArray(languages) ? languages : [];
    const safeCourses = Array.isArray(courses) ? courses : [];
    const safeReferences = Array.isArray(references) ? references : [];
    const safeCertifications = Array.isArray(certifications) ? certifications : [];

    const TightSectionLayout = ({ title, items, renderItem, showTitle = true }) => {
        if (!items || items.length === 0) return null;
        return (
            <section className="mb-3 border-b border-black pb-2 last:border-0 border-opacity-50">
                <div className="flex flex-col">
                    <div className="flex gap-4">
                        <div className="w-[140px] shrink-0 text-left">
                            {showTitle && <h2 className="text-sm font-semibold uppercase tracking-widest text-black mb-1">{title}</h2>}
                        </div>
                        <div className="flex-1" />
                    </div>
                    <div className="flex flex-col gap-3">
                        {items.map((item, index) => (
                            <div key={item?.id || index} className="flex gap-4">
                                <div className="w-[140px] shrink-0 text-left text-sm text-black font-medium leading-snug">
                                    {renderItem(item).date}
                                </div>
                                <div className="flex-1 -mt-1 min-w-0">
                                    {renderItem(item).content}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    };

    // Section renderers
    const renderExperience = () => safeExperience.length > 0 && (
        <TightSectionLayout
            title={t.experience}
            items={safeExperience}
            renderItem={(exp) => ({
                date: <>{formatDate(exp?.startDate)} — {exp?.endDate ? formatDate(exp.endDate) : t.present}</>,
                content: (
                    <>
                        <div className="flex justify-between items-baseline mb-0.5">
                            <h3 className="text-base font-medium text-black">{exp?.jobTitle}</h3>
                            <span className="text-sm text-black">{exp?.city}</span>
                        </div>
                        <div className="text-sm text-black mb-1">{exp?.employer}</div>
                        {exp?.description && (
                            <div className="text-sm text-black leading-snug text-justify">
                                <MarkdownRenderer content={exp.description} />
                            </div>
                        )}
                    </>
                )
            })}
        />
    );

    const renderEducation = () => safeEducation.length > 0 && (
        <TightSectionLayout
            title={t.education}
            items={safeEducation}
            renderItem={(edu) => ({
                date: <>{formatDate(edu?.startDate)} — {edu?.endDate ? formatDate(edu.endDate) : t.present}</>,
                content: (
                    <>
                        <div className="flex justify-between items-baseline mb-0.5">
                            <h3 className="text-base font-medium text-black">{edu?.degree}</h3>
                            <span className="text-sm text-black">{edu?.city}</span>
                        </div>
                        <div className="text-sm text-black mb-1">{edu?.school}</div>
                        {edu?.description && (
                            <div className="text-sm text-black leading-snug text-justify">
                                <MarkdownRenderer content={edu.description} />
                            </div>
                        )}
                    </>
                )
            })}
        />
    );

    const renderOrganizations = () => safeOrganizations.length > 0 && (
        <TightSectionLayout
            title={t.organizations}
            items={safeOrganizations}
            renderItem={(org) => ({
                date: <>{formatDate(org?.startDate)} — {org?.endDate ? formatDate(org.endDate) : t.present}</>,
                content: (
                    <>
                        <div className="flex justify-between items-baseline mb-0.5">
                            <h3 className="text-base font-medium text-black">{org?.role}</h3>
                            <span className="text-sm text-black">{org?.city}</span>
                        </div>
                        <div className="text-sm text-black mb-1">{org?.organization}</div>
                        {org?.description && (
                            <div className="text-sm text-black leading-snug text-justify">
                                <MarkdownRenderer content={org.description} />
                            </div>
                        )}
                    </>
                )
            })}
        />
    );

    const renderCertifications = () => safeCertifications.length > 0 && (
        <TightSectionLayout
            title={t.certifications}
            items={safeCertifications}
            renderItem={(cert) => ({
                date: <>{formatDate(cert?.date)}</>,
                content: (
                    <>
                        <h3 className="text-base font-medium text-black mb-0.5">{cert?.name}</h3>
                        <div className="text-sm text-black mb-1">{cert?.issuer}</div>
                        {cert?.description && (
                            <div className="text-sm text-black leading-snug text-justify">
                                <MarkdownRenderer content={cert.description} />
                            </div>
                        )}
                    </>
                )
            })}
        />
    );

    const renderLanguages = () => safeLanguages.length > 0 && (
        <section className="mb-3 border-b border-black pb-2 border-opacity-50">
            <div className="flex gap-4">
                <div className="w-[140px] shrink-0 text-left">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-black">{t.languages}</h2>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                    {safeLanguages.map((lang, index) => (
                        <div key={index} className="text-sm text-black flex justify-between border-b border-gray-100 pb-1">
                            <span className="font-semibold">{lang?.language}</span>
                            <span className="text-black">{lang?.level}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

    const renderSkills = () => safeSkills.length > 0 && (
        <section className="mb-3 border-b border-black pb-2 border-opacity-50">
            <div className="flex gap-4">
                <div className="w-[140px] shrink-0 text-left">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-black">{t.skills}</h2>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1">
                    {safeSkills.map((skill, index) => (
                        <div key={skill?.id || index} className="text-sm text-black">
                            <span className="font-semibold">{skill?.name}</span>
                            {skill?.level && <span className="text-black ml-1">({skill.level})</span>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

    const renderCourses = () => safeCourses.length > 0 && (
        <TightSectionLayout
            title={t.courses}
            items={safeCourses}
            renderItem={(course) => ({
                date: <>{course?.startDate} — {course?.endDate}</>,
                content: (
                    <>
                        <div className="font-semibold text-black">{course?.name}</div>
                        <div className="text-black">{course?.institution}</div>
                    </>
                )
            })}
        />
    );

    const renderReferences = () => safeReferences.length > 0 && (
        <section className="mb-3 border-b border-black pb-2 border-opacity-50">
            <div className="flex gap-4">
                <div className="w-[140px] shrink-0 text-left">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-black">{t.references}</h2>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-6">
                    {safeReferences.map((ref, index) => (
                        <div key={ref?.id || index} className="text-sm text-black">
                            <div className="font-semibold text-base">{ref?.name}</div>
                            <div className="text-black">{ref?.company}</div>
                            <div className="text-black mt-1">{ref?.email}</div>
                            <div className="text-black">{ref?.phone}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

    // Map section keys to render functions
    const sectionRenderers = {
        experience: renderExperience,
        education: renderEducation,
        organizations: renderOrganizations,
        certifications: renderCertifications,
        languages: renderLanguages,
        skills: renderSkills,
        courses: renderCourses,
        references: renderReferences,
    };

    const safeCustomSections = Array.isArray(customSections) ? customSections : [];
    safeCustomSections.forEach((section) => {
        sectionRenderers[section.id] = () => {
            if (section.type === 'paragraph_like' && section.description) {
                return (
                    <section className="mb-3 border-b border-black pb-2 border-opacity-50">
                        <div className="flex gap-4">
                            <div className="w-[140px] shrink-0 text-left">
                                <h2 className="text-sm font-semibold uppercase tracking-widest text-black">{section.name?.toUpperCase()}</h2>
                            </div>
                            <div className="flex-1 text-sm leading-relaxed text-black text-justify -mt-0.5">
                                <MarkdownRenderer content={section.description} />
                            </div>
                        </div>
                    </section>
                );
            }
            if (section.type === 'skill_like' && section.items?.length > 0) {
                return (
                    <section className="mb-3 border-b border-black pb-2 border-opacity-50">
                        <div className="flex gap-4">
                            <div className="w-[140px] shrink-0 text-left">
                                <h2 className="text-sm font-semibold uppercase tracking-widest text-black">{section.name?.toUpperCase()}</h2>
                            </div>
                            <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1">
                                {section.items.map((item, index) => (
                                    <div key={item?.id || index} className="text-sm text-black">
                                        <span className="font-semibold">{item?.name}</span>
                                        {item?.level && <span className="text-black ml-1">({item.level})</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );
            }
            if (section.type === 'experience_like' && section.items?.length > 0) {
                return (
                    <TightSectionLayout
                        title={section.name?.toUpperCase()}
                        items={section.items}
                        renderItem={(item) => ({
                            date: <>{item?.date}</>,
                            content: (
                                <>
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className="text-base font-medium text-black">{item?.title}</h3>
                                        <span className="text-sm text-black">{item?.city}</span>
                                    </div>
                                    <div className="text-sm text-black mb-1">{item?.subtitle}</div>
                                    {item?.description && (
                                        <div className="text-sm text-black leading-snug text-justify">
                                            <MarkdownRenderer content={item.description} />
                                        </div>
                                    )}
                                </>
                            )
                        })}
                    />
                );
            }
            return null;
        };
    });

    return (
        <div className="w-full h-full bg-white text-black" style={{ ...fontStyle, padding: '1cm 1.5cm 1cm 1.5cm' }}>
            <style>{`
                @media print {
                    section {
                        break-inside: auto;
                    }
                    h2 {
                        break-after: avoid;
                        page-break-after: avoid;
                    }
                    .section-header {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }
                }
            `}</style>

            <header className="text-center mb-5 border-b border-black pb-3 border-opacity-50">
                <div className="flex flex-wrap justify-center items-baseline gap-2 mb-2">
                    <h1 className="text-2xl font-normal text-black tracking-wide leading-none">
                        {personalInfo?.firstName} {personalInfo?.lastName}
                    </h1>
                    {personalInfo?.jobTitle && (
                        <span className="text-2xl text-gray-700 font-normal leading-none">
                            | {personalInfo.jobTitle}
                        </span>
                    )}
                </div>
                <div className="flex justify-center items-center flex-wrap gap-x-1.5 gap-y-1 text-sm text-black">
                    {[
                        personalInfo?.email,
                        personalInfo?.phone,
                        [personalInfo?.city, personalInfo?.country].filter(Boolean).join(', '),
                        personalInfo?.linkedin,
                        personalInfo?.website
                    ].filter(Boolean).map((info, index, arr) => (
                        <span key={`${index}-${String(info).substring(0, 10)}`}>
                            {String(info).includes('http') ? <a href={String(info)} target="_blank" rel="noopener noreferrer" className="text-black no-underline hover:text-gray-700">{String(info).trim()}</a> : String(info).trim()}{index < arr.length - 1 && ","}
                        </span>
                    ))}
                </div>
            </header>

            {summary && (
                <section className="mb-3 border-b border-black pb-2 border-opacity-50">
                    <div className="flex gap-4">
                        <div className="w-[140px] shrink-0 text-left">
                            <h2 className="text-sm font-semibold uppercase tracking-widest text-black">{t.profile}</h2>
                        </div>
                        <div className="flex-1 text-sm leading-relaxed text-black text-justify -mt-0.5">
                            <MarkdownRenderer content={summary} />
                        </div>
                    </div>
                </section>
            )}

            {/* Render sections in order */}
            {sectionOrder.map((sectionKey) => {
                const renderer = sectionRenderers[sectionKey];
                if (!renderer) return null;
                return <React.Fragment key={sectionKey}>{renderer()}</React.Fragment>;
            })}
        </div>
    );
};

export default ProfessionalTemplate;