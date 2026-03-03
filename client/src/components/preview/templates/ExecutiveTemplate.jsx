import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

class SafeMarkdown extends Component {
    constructor(props) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error, e) { console.error(error, e); }
    render() {
        if (this.state.hasError) return <div className="whitespace-pre-wrap">{this.props.content}</div>;
        return this.props.children;
    }
}

const MD = ({ content }) => {
    if (!content) return null;
    return (
        <SafeMarkdown content={content}>
            <div className="prose prose-sm max-w-none prose-p:my-0 prose-ul:my-1 leading-snug">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {content}
                </ReactMarkdown>
            </div>
        </SafeMarkdown>
    );
};

const fmtDate = (d) => {
    if (!d) return '';
    const m = d.match(/^(\d{4})-(\d{2})$/);
    if (m) return new Date(m[1], parseInt(m[2]) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return d;
};

// Executive / Classic template: dark top header bar, two-column bottom
const ExecutiveTemplate = ({ data }) => {
    const { personalInfo = {}, summary = '', experience = [], education = [], skills = [],
        organizations = [], languages = [], courses = [], references = [], certifications = [],
        customSections = [],
        themeColor, textColor, font, language } = data || {};

    const color = themeColor || '#1B2A4A';
    const fontStyle = { fontFamily: font || '"Georgia", "Times New Roman", serif' };
    const textAlignStyle = { textAlign: (data || {}).textAlign || 'left' };
    const lang = language || 'en';
    const t = {
        profile: lang === 'id' ? 'PROFIL PROFESIONAL' : 'PROFESSIONAL PROFILE',
        experience: lang === 'id' ? 'PENGALAMAN KERJA' : 'PROFESSIONAL EXPERIENCE',
        education: lang === 'id' ? 'PENDIDIKAN' : 'EDUCATION',
        skills: lang === 'id' ? 'KOMPETENSI UTAMA' : 'CORE COMPETENCIES',
        organizations: lang === 'id' ? 'ORGANISASI' : 'LEADERSHIP & ORGANIZATIONS',
        languages: lang === 'id' ? 'BAHASA' : 'LANGUAGES',
        certifications: lang === 'id' ? 'SERTIFIKASI' : 'CERTIFICATIONS',
        references: lang === 'id' ? 'REFERENSI' : 'REFERENCES',
        present: lang === 'id' ? 'Sekarang' : 'Present',
        courses: lang === 'id' ? 'Kursus' : 'Courses',
    };

    const SectionTitle = ({ title }) => (
        <div className="mb-3 mt-4">
            <h2 className="text-xs font-bold tracking-[0.15em] mb-1" style={{ color }}>{title}</h2>
            <div className="h-px" style={{ backgroundColor: color }} />
        </div>
    );

    const contacts = [
        personalInfo.email, personalInfo.phone,
        [personalInfo.city, personalInfo.country].filter(Boolean).join(', '),
        personalInfo.linkedin, personalInfo.website
    ].filter(Boolean);

    return (
        <div className="w-full h-full bg-white" style={fontStyle}>
            <style>{`
                @media print {
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                }
            `}</style>
            {/* Executive Dark Header */}
            <header className="px-8 pt-7 pb-6" style={{ backgroundColor: color }}>
                <h1 className="text-3xl font-bold text-white tracking-wide mb-1">
                    {personalInfo.firstName} {personalInfo.lastName}
                </h1>
                {personalInfo.jobTitle && (
                    <p className="text-sm text-white opacity-70 uppercase tracking-[0.2em] mb-3">{personalInfo.jobTitle}</p>
                )}
                <div className="h-px bg-white opacity-20 mb-3" />
                <div className="flex flex-wrap gap-x-5 gap-y-1">
                    {contacts.map((item, i) => (
                        <span key={i} className="text-xs text-white opacity-75">
                            {String(item).includes('http')
                                ? <a href={String(item)} target="_blank" rel="noopener noreferrer" className="text-white no-underline">{item}</a>
                                : item}
                        </span>
                    ))}
                </div>
            </header>

            {/* Body */}
            <div className="flex">
                {/* Left (main) */}
                <div className="flex-1 px-8 py-2">
                    {summary && (
                        <>
                            <SectionTitle title={t.profile} />
                            <div className="text-xs text-gray-700 leading-relaxed text-justify">
                                <MD content={summary} />
                            </div>
                        </>
                    )}

                    {experience?.length > 0 && (
                        <>
                            <SectionTitle title={t.experience} />
                            <div className="space-y-4">
                                {experience.map((exp, i) => (
                                    <div key={i} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="text-sm font-bold text-gray-900">{exp.jobTitle}</h3>
                                            <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{exp.city}</span>
                                        </div>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <div className="text-xs font-semibold italic" style={{ color }}>{exp.employer}</div>
                                            <div className="text-xs text-gray-500 whitespace-nowrap">
                                                {fmtDate(exp.startDate)} – {exp.endDate ? fmtDate(exp.endDate) : t.present}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-600 leading-relaxed" style={textAlignStyle}><MD content={exp.description} /></div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {education?.length > 0 && (
                        <>
                            <SectionTitle title={t.education} />
                            <div className="space-y-3">
                                {education.map((edu, i) => (
                                    <div key={i} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="text-sm font-bold text-gray-900">{edu.degree}</h3>
                                            <span className="text-xs text-gray-500">
                                                {fmtDate(edu.startDate)} – {edu.endDate ? fmtDate(edu.endDate) : t.present}
                                            </span>
                                        </div>
                                        <div className="text-xs italic mb-1" style={{ color }}>{edu.school} {edu.city && `· ${edu.city}`}</div>
                                        <div className="text-xs text-gray-600" style={textAlignStyle}><MD content={edu.description} /></div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {organizations?.length > 0 && (
                        <>
                            <SectionTitle title={t.organizations} />
                            <div className="space-y-3">
                                {organizations.map((org, i) => (
                                    <div key={i} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="text-sm font-bold text-gray-900">{org.role}</h3>
                                            <span className="text-xs text-gray-500">
                                                {fmtDate(org.startDate)} – {org.endDate ? fmtDate(org.endDate) : t.present}
                                            </span>
                                        </div>
                                        <div className="text-xs italic mb-1" style={{ color }}>{org.organization}</div>
                                        <div className="text-xs text-gray-600" style={textAlignStyle}><MD content={org.description} /></div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Custom Sections */}
                    {(Array.isArray(customSections) ? customSections : []).map((section) => {
                        if (section.type === 'paragraph_like' && section.description) {
                            return (
                                <React.Fragment key={section.id}>
                                    <SectionTitle title={section.name?.toUpperCase()} />
                                    <div className="text-xs text-gray-700 leading-relaxed text-justify">
                                        <MD content={section.description} />
                                    </div>
                                </React.Fragment>
                            );
                        }
                        if (section.type === 'skill_like' && section.items?.length > 0) {
                            return (
                                <React.Fragment key={section.id}>
                                    <SectionTitle title={section.name?.toUpperCase()} />
                                    <div className="space-y-1">
                                        {section.items.map((item, idx) => (
                                            <div key={item?.id || idx} className="flex justify-between text-xs">
                                                <span className="font-semibold text-gray-800">{item?.name}</span>
                                                {item?.level && <span className="text-gray-500">{item.level}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </React.Fragment>
                            );
                        }
                        if (section.type === 'experience_like' && section.items?.length > 0) {
                            return (
                                <React.Fragment key={section.id}>
                                    <SectionTitle title={section.name?.toUpperCase()} />
                                    <div className="space-y-4">
                                        {section.items.map((item, idx) => (
                                            <div key={item?.id || idx} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                                <div className="flex justify-between items-baseline">
                                                    <h3 className="text-sm font-bold text-gray-900">{item?.title}</h3>
                                                    <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{item?.city}</span>
                                                </div>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <div className="text-xs font-semibold italic" style={{ color }}>{item?.subtitle}</div>
                                                    <div className="text-xs text-gray-500 whitespace-nowrap">{item?.date}</div>
                                                </div>
                                                <div className="text-xs text-gray-600 leading-relaxed" style={textAlignStyle}><MD content={item?.description} /></div>
                                            </div>
                                        ))}
                                    </div>
                                </React.Fragment>
                            );
                        }
                        return null;
                    })}
                </div>

                {/* Right sidebar */}
                <div className="w-44 px-4 py-2 bg-gray-50" style={{ borderLeft: `3px solid ${color}` }}>
                    {skills?.length > 0 && (
                        <div className="mb-4">
                            <SectionTitle title={t.skills} />
                            <div className="space-y-1">
                                {skills.map((skill, i) => (
                                    <div key={i} className="text-xs px-2 py-1 rounded text-white text-center mb-1"
                                        style={{ backgroundColor: color, opacity: skill.level === 'Expert' ? 1 : skill.level === 'Intermediate' ? 0.7 : 0.5 }}>
                                        {skill.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {languages?.length > 0 && (
                        <div className="mb-4">
                            <SectionTitle title={t.languages} />
                            {languages.map((l, i) => (
                                <div key={i} className="mb-1">
                                    <div className="text-xs font-semibold text-gray-800">{l.language}</div>
                                    <div className="text-xs text-gray-500 italic">{l.level}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {certifications?.length > 0 && (
                        <div className="mb-4">
                            <SectionTitle title={t.certifications} />
                            {certifications.map((cert, i) => (
                                <div key={i} className="mb-2">
                                    <div className="text-xs font-semibold text-gray-800">{cert.name}</div>
                                    <div className="text-xs text-gray-500">{cert.issuer}</div>
                                    <div className="text-xs text-gray-400">{fmtDate(cert.date)}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {references?.length > 0 && (
                        <div>
                            <SectionTitle title={t.references} />
                            {references.map((ref, i) => (
                                <div key={i} className="mb-2">
                                    <div className="text-xs font-semibold text-gray-800">{ref.name}</div>
                                    <div className="text-xs text-gray-500">{ref.company}</div>
                                    <div className="text-xs text-gray-400">{ref.email}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExecutiveTemplate;
