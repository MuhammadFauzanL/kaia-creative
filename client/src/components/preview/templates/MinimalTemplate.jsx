import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

class SafeMarkdown extends Component {
    constructor(props) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error, errorInfo) { console.error("Markdown error:", error, errorInfo); }
    render() {
        if (this.state.hasError) return <div className="whitespace-pre-wrap">{this.props.content}</div>;
        return this.props.children;
    }
    componentDidUpdate(prevProps) {
        if (prevProps.content !== this.props.content && this.state.hasError) this.setState({ hasError: false });
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

const MinimalTemplate = ({ data }) => {
    const { personalInfo = {}, summary = '', experience = [], education = [], skills = [],
        organizations = [], languages = [], courses = [], references = [], certifications = [],
        customSections = [],
        themeColor, textColor, font, language, showPhoto, photoShape, photoOutline } = data || {};
    const txtColor = textColor || '#000000';
    const shouldShowPhoto = showPhoto !== false;
    const photoRadius = photoShape === 'square' ? '4px' : '50%';
    const color = themeColor || '#1a1a2e';
    const fontStyle = { fontFamily: font || '"Inter", "Helvetica Neue", Arial, sans-serif' };
    const textAlignStyle = { textAlign: (data || {}).textAlign || 'left' };
    const photoSizePx = (data || {}).photoSize === 'small' ? '40px' : (data || {}).photoSize === 'large' ? '96px' : '64px';
    const lang = language || 'en';

    const t = {
        profile: lang === 'id' ? 'PROFIL' : 'PROFILE',
        experience: lang === 'id' ? 'PENGALAMAN' : 'EXPERIENCE',
        education: lang === 'id' ? 'PENDIDIKAN' : 'EDUCATION',
        skills: lang === 'id' ? 'KEAHLIAN' : 'SKILLS',
        organizations: lang === 'id' ? 'ORGANISASI' : 'ORGANIZATIONS',
        languages: lang === 'id' ? 'BAHASA' : 'LANGUAGES',
        courses: lang === 'id' ? 'KURSUS' : 'COURSES',
        certifications: lang === 'id' ? 'SERTIFIKASI' : 'CERTIFICATIONS',
        references: lang === 'id' ? 'REFERENSI' : 'REFERENCES',
        present: lang === 'id' ? 'Sekarang' : 'Present',
    };

    const SectionTitle = ({ title }) => (
        <div className="flex items-center gap-3 mb-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color }}>{title}</h2>
            <div className="flex-1 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
        </div>
    );

    const contactItems = [
        personalInfo.email, personalInfo.phone,
        [personalInfo.city, personalInfo.country].filter(Boolean).join(', '),
        personalInfo.linkedin, personalInfo.website
    ].filter(Boolean);

    return (
        <div className="w-full h-full bg-white p-10" style={{ ...fontStyle, color: txtColor }}>
            {/* Header */}
            <header className="mb-8">
                <div className="flex items-start gap-4">
                    {shouldShowPhoto && personalInfo.photoUrl && (
                        <img
                            src={personalInfo.photoUrl}
                            alt={`${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`}
                            className="object-cover flex-shrink-0"
                            style={{ width: photoSizePx, height: photoSizePx, borderRadius: photoRadius, border: photoOutline ? `2px solid ${color}` : 'none' }}
                        />
                    )}
                    <div>
                        <h1 className="text-5xl font-thin tracking-wide text-gray-900 mb-1">
                            {personalInfo.firstName} <span className="font-bold">{personalInfo.lastName}</span>
                        </h1>
                        {personalInfo.jobTitle && (
                            <p className="text-lg tracking-widest uppercase mt-1 mb-3" style={{ color, opacity: 0.8 }}>
                                {personalInfo.jobTitle}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                    {contactItems.map((item, i) => (
                        <span key={i} className="flex items-center gap-1">
                            {i > 0 && <span className="text-gray-300">·</span>}
                            {String(item).includes('http') ? (
                                <a href={String(item)} target="_blank" rel="noopener noreferrer" style={{ color }}>{item}</a>
                            ) : item}
                        </span>
                    ))}
                </div>
            </header>

            {summary && (
                <section className="mb-6">
                    <SectionTitle title={t.profile} />
                    <div className="text-sm text-gray-600 leading-relaxed">
                        <MD content={summary} />
                    </div>
                </section>
            )}

            {experience?.length > 0 && (
                <section className="mb-6">
                    <SectionTitle title={t.experience} />
                    <div className="space-y-4">
                        {experience.map((exp, i) => (
                            <div key={i} className="grid grid-cols-4 gap-4" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                <div className="text-xs text-gray-400 pt-0.5">
                                    {fmtDate(exp.startDate)} — {exp.endDate ? fmtDate(exp.endDate) : t.present}
                                </div>
                                <div className="col-span-3">
                                    <div className="flex justify-between">
                                        <h3 className="text-sm font-semibold text-gray-900">{exp.jobTitle}</h3>
                                        <span className="text-xs text-gray-400">{exp.city}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-1" style={{ color }}>{exp.employer}</div>
                                    <div className="text-xs text-gray-600 leading-relaxed" style={textAlignStyle}><MD content={exp.description} /></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {education?.length > 0 && (
                <section className="mb-6">
                    <SectionTitle title={t.education} />
                    <div className="space-y-4">
                        {education.map((edu, i) => (
                            <div key={i} className="grid grid-cols-4 gap-4" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                <div className="text-xs text-gray-400 pt-0.5">
                                    {fmtDate(edu.startDate)} — {edu.endDate ? fmtDate(edu.endDate) : t.present}
                                </div>
                                <div className="col-span-3">
                                    <div className="flex justify-between">
                                        <h3 className="text-sm font-semibold text-gray-900">{edu.degree}</h3>
                                        <span className="text-xs text-gray-400">{edu.city}</span>
                                    </div>
                                    <div className="text-xs mb-1" style={{ color }}>{edu.school}</div>
                                    <div className="text-xs text-gray-600 leading-relaxed" style={textAlignStyle}><MD content={edu.description} /></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="grid grid-cols-2 gap-8">
                {skills?.length > 0 && (
                    <section>
                        <SectionTitle title={t.skills} />
                        <div className="space-y-2">
                            {skills.map((skill, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-xs text-gray-700">{skill.name}</span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(dot => {
                                            const filled = skill.level === 'Expert' ? 5 : skill.level === 'Intermediate' ? 3 : 1;
                                            return <div key={dot} className="w-1.5 h-1.5 rounded-full"
                                                style={{ backgroundColor: dot <= filled ? color : '#e5e7eb' }} />;
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {languages?.length > 0 && (
                    <section>
                        <SectionTitle title={t.languages} />
                        <div className="space-y-1">
                            {languages.map((l, i) => (
                                <div key={i} className="flex justify-between text-xs text-gray-600">
                                    <span>{l.language}</span>
                                    <span className="text-gray-400">{l.level}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {organizations?.length > 0 && (
                <section className="mt-6">
                    <SectionTitle title={t.organizations} />
                    <div className="space-y-3">
                        {organizations.map((org, i) => (
                            <div key={i} className="grid grid-cols-4 gap-4" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                <div className="text-xs text-gray-400 pt-0.5">
                                    {fmtDate(org.startDate)} — {org.endDate ? fmtDate(org.endDate) : t.present}
                                </div>
                                <div className="col-span-3">
                                    <h3 className="text-sm font-semibold">{org.role}</h3>
                                    <div className="text-xs mb-1" style={{ color }}>{org.organization}</div>
                                    <div className="text-xs text-gray-600" style={textAlignStyle}><MD content={org.description} /></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {certifications?.length > 0 && (
                <section className="mt-6">
                    <SectionTitle title={t.certifications} />
                    <div className="space-y-2">
                        {certifications.map((cert, i) => (
                            <div key={i} className="flex justify-between text-xs">
                                <div>
                                    <span className="font-semibold text-gray-800">{cert.name}</span>
                                    <span className="text-gray-500 ml-2">· {cert.issuer}</span>
                                </div>
                                <span className="text-gray-400">{fmtDate(cert.date)}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {references?.length > 0 && (
                <section className="mt-6">
                    <SectionTitle title={t.references} />
                    <div className="grid grid-cols-2 gap-4">
                        {references.map((ref, i) => (
                            <div key={i} className="text-xs text-gray-600">
                                <div className="font-semibold text-gray-800">{ref.name}</div>
                                <div>{ref.company}</div>
                                <div>{ref.email}</div>
                                <div>{ref.phone}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Custom Sections */}
            {(Array.isArray(customSections) ? customSections : []).map((section) => {
                if (section.type === 'paragraph_like' && section.description) {
                    return (
                        <section key={section.id} className="mt-6">
                            <SectionTitle title={section.name?.toUpperCase()} />
                            <div className="text-sm text-gray-600 leading-relaxed">
                                <MD content={section.description} />
                            </div>
                        </section>
                    );
                }
                if (section.type === 'skill_like' && section.items?.length > 0) {
                    return (
                        <section key={section.id} className="mt-6">
                            <SectionTitle title={section.name?.toUpperCase()} />
                            <div className="space-y-2">
                                {section.items.map((item, idx) => (
                                    <div key={item?.id || idx} className="flex justify-between items-center">
                                        <span className="text-xs text-gray-700">{item?.name}</span>
                                        {item?.level && <span className="text-xs text-gray-400">{item.level}</span>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                }
                if (section.type === 'experience_like' && section.items?.length > 0) {
                    return (
                        <section key={section.id} className="mt-6">
                            <SectionTitle title={section.name?.toUpperCase()} />
                            <div className="space-y-4">
                                {section.items.map((item, idx) => (
                                    <div key={item?.id || idx} className="grid grid-cols-4 gap-4" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                        <div className="text-xs text-gray-400 pt-0.5">{item?.date}</div>
                                        <div className="col-span-3">
                                            <div className="flex justify-between">
                                                <h3 className="text-sm font-semibold text-gray-900">{item?.title}</h3>
                                                <span className="text-xs text-gray-400">{item?.city}</span>
                                            </div>
                                            <div className="text-xs mb-1" style={{ color }}>{item?.subtitle}</div>
                                            <div className="text-xs text-gray-600 leading-relaxed" style={textAlignStyle}><MD content={item?.description} /></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                }
                return null;
            })}
        </div>
    );
};

export default MinimalTemplate;
