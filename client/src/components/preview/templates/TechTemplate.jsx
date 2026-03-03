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

// Tech / IT template - modern with monospace feel, code-like accents
const TechTemplate = ({ data }) => {
    const { personalInfo = {}, summary = '', experience = [], education = [], skills = [],
        organizations = [], languages = [], courses = [], references = [], certifications = [],
        customSections = [],
        themeColor, textColor, font, language } = data || {};

    const color = themeColor || '#00C896';
    const bgDark = '#0D1121';
    const fontStyle = { fontFamily: font || '"JetBrains Mono", "Fira Code", "Courier New", monospace' };
    const textAlignStyle = { textAlign: (data || {}).textAlign || 'left' };
    const lang = language || 'en';
    const t = {
        profile: lang === 'id' ? 'TENTANG_SAYA' : 'ABOUT_ME',
        experience: lang === 'id' ? 'PENGALAMAN' : 'EXPERIENCE',
        education: lang === 'id' ? 'PENDIDIKAN' : 'EDUCATION',
        skills: lang === 'id' ? 'TECH_STACK' : 'TECH_STACK',
        organizations: lang === 'id' ? 'ORGANISASI' : 'ORGANIZATIONS',
        languages: lang === 'id' ? 'BAHASA' : 'LANGUAGES',
        certifications: lang === 'id' ? 'SERTIFIKASI' : 'CERTIFICATIONS',
        references: lang === 'id' ? 'REFERENSI' : 'REFERENCES',
        present: lang === 'id' ? 'sekarang' : 'present',
        courses: lang === 'id' ? 'KURSUS' : 'COURSES',
    };

    const Tag = ({ children }) => (
        <span className="inline-block text-xs px-2 py-0.5 rounded mr-1 mb-1 font-mono"
            style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}>
            {children}
        </span>
    );

    const SectionTitle = ({ title }) => (
        <div className="flex items-center gap-2 mb-3 mt-4">
            <span style={{ color }} className="text-xs font-mono font-bold">{'//'}</span>
            <h2 className="text-xs font-bold tracking-widest font-mono" style={{ color }}>{title}</h2>
            <div className="flex-1 h-px" style={{ backgroundColor: `${color}30` }} />
        </div>
    );

    const contacts = [
        personalInfo.email && { label: 'email', value: personalInfo.email },
        personalInfo.phone && { label: 'phone', value: personalInfo.phone },
        (personalInfo.city || personalInfo.country) && { label: 'location', value: [personalInfo.city, personalInfo.country].filter(Boolean).join(', ') },
        personalInfo.linkedin && { label: 'linkedin', value: personalInfo.linkedin },
        personalInfo.website && { label: 'portfolio', value: personalInfo.website },
    ].filter(Boolean);

    return (
        <div className="w-full h-full bg-white flex" style={fontStyle}>
            <style>{`
                @media print {
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                }
            `}</style>
            {/* Left dark sidebar */}
            <div className="w-[38%] min-h-full p-6" style={{ backgroundColor: bgDark }}>
                {/* Name */}
                <div className="mb-5">
                    <div className="text-xs mb-1" style={{ color: `${color}80` }}>{'> whoami'}</div>
                    <h1 className="text-xl font-bold text-white leading-tight">
                        {personalInfo.firstName}<br />{personalInfo.lastName}
                    </h1>
                    {personalInfo.jobTitle && (
                        <div className="text-xs mt-1" style={{ color }}>
                            {'<'}{personalInfo.jobTitle}{'/>'}
                        </div>
                    )}
                </div>

                {/* Contact */}
                <div className="mb-5">
                    <div className="text-xs mb-2 font-bold tracking-widest" style={{ color }}>// CONTACT</div>
                    {contacts.map((c, i) => (
                        <div key={i} className="mb-1.5">
                            <div className="text-xs" style={{ color: `${color}70` }}>{c.label}:</div>
                            <div className="text-xs text-gray-300 break-all">
                                {String(c.value).includes('http')
                                    ? <a href={String(c.value)} target="_blank" rel="noopener noreferrer" style={{ color }} className="no-underline">{c.value}</a>
                                    : c.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Skills */}
                {skills?.length > 0 && (
                    <div className="mb-5">
                        <div className="text-xs mb-2 font-bold tracking-widest" style={{ color }}>// {t.skills}</div>
                        <div className="flex flex-wrap">
                            {skills.map((skill, i) => <Tag key={i}>{skill.name}</Tag>)}
                        </div>
                    </div>
                )}

                {/* Languages */}
                {languages?.length > 0 && (
                    <div className="mb-5">
                        <div className="text-xs mb-2 font-bold tracking-widest" style={{ color }}>// {t.languages}</div>
                        {languages.map((l, i) => (
                            <div key={i} className="flex justify-between text-xs mb-1">
                                <span className="text-gray-300">{l.language}</span>
                                <span style={{ color: `${color}80` }}>{l.level}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Certifications */}
                {certifications?.length > 0 && (
                    <div className="mb-5">
                        <div className="text-xs mb-2 font-bold tracking-widest" style={{ color }}>// {t.certifications}</div>
                        {certifications.map((cert, i) => (
                            <div key={i} className="mb-1.5">
                                <div className="text-xs text-white font-semibold">{cert.name}</div>
                                <div className="text-xs" style={{ color: `${color}70` }}>{cert.issuer} · {fmtDate(cert.date)}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* References */}
                {references?.length > 0 && (
                    <div>
                        <div className="text-xs mb-2 font-bold tracking-widest" style={{ color }}>// {t.references}</div>
                        {references.map((ref, i) => (
                            <div key={i} className="mb-2">
                                <div className="text-xs text-white font-semibold">{ref.name}</div>
                                <div className="text-xs text-gray-400">{ref.company}</div>
                                <div className="text-xs" style={{ color: `${color}80` }}>{ref.email}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right main content */}
            <div className="flex-1 px-7 py-5 bg-white">
                {summary && (
                    <>
                        <SectionTitle title={t.profile} />
                        <div className="text-xs text-gray-600 leading-relaxed mb-2">
                            <MD content={summary} />
                        </div>
                    </>
                )}

                {experience?.length > 0 && (
                    <>
                        <SectionTitle title={t.experience} />
                        <div className="space-y-4">
                            {experience.map((exp, i) => (
                                <div key={i} className="relative pl-3" style={{ borderLeft: `2px solid ${color}`, pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-sm font-bold text-gray-900">{exp.jobTitle}</h3>
                                        <span className="text-xs" style={{ color }}>{exp.city}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <div className="text-xs font-semibold" style={{ color }}>{exp.employer}</div>
                                        <div className="text-xs text-gray-400 font-mono">
                                            {fmtDate(exp.startDate)} → {exp.endDate ? fmtDate(exp.endDate) : t.present}
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
                                <div key={i} className="relative pl-3" style={{ borderLeft: `2px solid ${color}`, pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-sm font-bold text-gray-900">{edu.degree}</h3>
                                        <span className="text-xs text-gray-400 font-mono">
                                            {fmtDate(edu.startDate)} → {edu.endDate ? fmtDate(edu.endDate) : t.present}
                                        </span>
                                    </div>
                                    <div className="text-xs font-semibold mb-1" style={{ color }}>{edu.school} {edu.city && `· ${edu.city}`}</div>
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
                                <div key={i} className="relative pl-3" style={{ borderLeft: `2px solid ${color}`, pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-sm font-bold text-gray-900">{org.role}</h3>
                                        <span className="text-xs text-gray-400 font-mono">
                                            {fmtDate(org.startDate)} → {org.endDate ? fmtDate(org.endDate) : t.present}
                                        </span>
                                    </div>
                                    <div className="text-xs font-semibold mb-1" style={{ color }}>{org.organization}</div>
                                    <div className="text-xs text-gray-600" style={textAlignStyle}><MD content={org.description} /></div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {courses?.length > 0 && (
                    <>
                        <SectionTitle title={t.courses} />
                        {courses.map((c, i) => (
                            <div key={i} className="mb-2 pl-3" style={{ borderLeft: `2px solid ${color}` }}>
                                <div className="text-xs font-bold text-gray-800">{c.name}</div>
                                <div className="text-xs" style={{ color }}>{c.institution}</div>
                                <div className="text-xs text-gray-400 font-mono">{c.startDate} → {c.endDate}</div>
                            </div>
                        ))}
                    </>
                )}

                {/* Custom Sections */}
                {(Array.isArray(customSections) ? customSections : []).map((section) => {
                    if (section.type === 'paragraph_like' && section.description) {
                        return (
                            <React.Fragment key={section.id}>
                                <SectionTitle title={section.name?.toUpperCase()} />
                                <div className="text-xs text-gray-600 leading-relaxed mb-2">
                                    <MD content={section.description} />
                                </div>
                            </React.Fragment>
                        );
                    }
                    if (section.type === 'skill_like' && section.items?.length > 0) {
                        return (
                            <React.Fragment key={section.id}>
                                <SectionTitle title={section.name?.toUpperCase()} />
                                <div className="flex flex-wrap">
                                    {section.items.map((item, idx) => (
                                        <Tag key={item?.id || idx}>{item?.name}{item?.level ? ` (${item.level})` : ''}</Tag>
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
                                        <div key={item?.id || idx} className="relative pl-3" style={{ borderLeft: `2px solid ${color}`, pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="text-sm font-bold text-gray-900">{item?.title}</h3>
                                                <span className="text-xs" style={{ color }}>{item?.city}</span>
                                            </div>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <div className="text-xs font-semibold" style={{ color }}>{item?.subtitle}</div>
                                                <div className="text-xs text-gray-400 font-mono">{item?.date}</div>
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
        </div>
    );
};

export default TechTemplate;
