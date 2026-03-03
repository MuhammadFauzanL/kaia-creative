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
    componentDidUpdate(prevProps) {
        if (prevProps.content !== this.props.content && this.state.hasError) {
            this.setState({ hasError: false });
        }
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

const CreativeTemplate = ({ data }) => {
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
        themeColor,
        textColor,
        font,
        language,
        showPhoto,
        photoShape,
        photoOutline
    } = safeData;

    const shouldShowPhoto = showPhoto !== false;
    const photoRadius = photoShape === 'square' ? '4px' : '50%';

    const color = themeColor || '#6C63FF';
    const txtColor = textColor || '#000000';
    const fontStyle = { fontFamily: font || '"Poppins", "Segoe UI", Arial, sans-serif' };
    const textAlignStyle = { textAlign: safeData.textAlign || 'left' };
    const photoSizePx = safeData.photoSize === 'small' ? '56px' : safeData.photoSize === 'large' ? '112px' : '80px';
    const lang = language || 'en';
    const t = {
        profile: lang === 'id' ? 'Profil' : 'About Me',
        experience: lang === 'id' ? 'Pengalaman' : 'Experience',
        education: lang === 'id' ? 'Pendidikan' : 'Education',
        skills: lang === 'id' ? 'Keahlian' : 'Skills',
        organizations: lang === 'id' ? 'Organisasi' : 'Organizations',
        languages: lang === 'id' ? 'Bahasa' : 'Languages',
        certifications: lang === 'id' ? 'Sertifikasi' : 'Certifications',
        references: lang === 'id' ? 'Referensi' : 'References',
        present: lang === 'id' ? 'Sekarang' : 'Present',
        courses: lang === 'id' ? 'Kursus' : 'Courses',
    };

    const safeExperience = Array.isArray(experience) ? experience : [];
    const safeEducation = Array.isArray(education) ? education : [];
    const safeSkills = Array.isArray(skills) ? skills : [];
    const safeOrganizations = Array.isArray(organizations) ? organizations : [];
    const safeLanguages = Array.isArray(languages) ? languages : [];
    const safeCourses = Array.isArray(courses) ? courses : [];
    const safeReferences = Array.isArray(references) ? references : [];
    const safeCertifications = Array.isArray(certifications) ? certifications : [];

    const SideSection = ({ title, children }) => (
        <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white mb-3 opacity-80">{title}</h2>
            {children}
        </div>
    );

    const MainSection = ({ title, children }) => (
        <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 rounded-full" style={{ backgroundColor: color }} />
                <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: txtColor }}>{title}</h2>
            </div>
            {children}
        </div>
    );

    const skillLevel = (level) => level === 'Expert' ? 100 : level === 'Intermediate' ? 65 : 35;

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
            {/* Sidebar */}
            <div className="w-[35%] min-h-full p-6 flex flex-col" style={{ backgroundColor: color }}>
                {/* Photo or Avatar */}
                <div className="mb-6">
                    {shouldShowPhoto && personalInfo?.photoUrl ? (
                        <img
                            src={personalInfo.photoUrl}
                            alt={`${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`}
                            className="object-cover mb-3 shadow-lg"
                            style={{ width: photoSizePx, height: photoSizePx, borderRadius: photoRadius, border: photoOutline ? '3px solid rgba(255,255,255,0.6)' : 'none' }}
                        />
                    ) : shouldShowPhoto ? (
                        <div className="bg-white bg-opacity-20 flex items-center justify-center text-white text-3xl font-bold mb-3"
                            style={{ width: photoSizePx, height: photoSizePx, borderRadius: photoRadius, border: photoOutline ? '2px solid rgba(255,255,255,0.3)' : 'none' }}>
                            {(personalInfo?.firstName || 'R')[0]}{(personalInfo?.lastName || '')[0]}
                        </div>
                    ) : null}
                    <h1 className="text-xl font-bold text-white leading-tight">
                        {personalInfo?.firstName} {personalInfo?.lastName}
                    </h1>
                    {personalInfo?.jobTitle && (
                        <p className="text-xs text-white opacity-75 mt-1 uppercase tracking-wider">{personalInfo.jobTitle}</p>
                    )}
                </div>

                {/* Contact */}
                <SideSection title={lang === 'id' ? 'Kontak' : 'Contact'}>
                    {personalInfo?.email && (
                        <div className="text-xs text-white opacity-85 mb-1 break-all">{personalInfo.email}</div>
                    )}
                    {personalInfo?.phone && (
                        <div className="text-xs text-white opacity-85 mb-1">{personalInfo.phone}</div>
                    )}
                    {(personalInfo?.city || personalInfo?.country) && (
                        <div className="text-xs text-white opacity-85 mb-1">
                            {[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}
                        </div>
                    )}
                    {personalInfo?.linkedin && (
                        <div className="text-xs text-white opacity-85 mb-1 break-all">
                            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-white no-underline">
                                {personalInfo.linkedin.replace('https://', '')}
                            </a>
                        </div>
                    )}
                    {personalInfo?.website && (
                        <div className="text-xs text-white opacity-85 break-all">
                            <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-white no-underline">
                                {personalInfo.website.replace('https://', '')}
                            </a>
                        </div>
                    )}
                </SideSection>

                {/* Skills */}
                {safeSkills.length > 0 && (
                    <SideSection title={t.skills}>
                        {safeSkills.map((skill, i) => (
                            <div key={skill?.id || i} className="mb-2">
                                <div className="flex justify-between mb-0.5">
                                    <span className="text-xs text-white">{skill?.name}</span>
                                    <span className="text-xs text-white opacity-60">{skill?.level}</span>
                                </div>
                                <div className="w-full bg-white bg-opacity-20 rounded-full h-1">
                                    <div className="h-1 rounded-full bg-white" style={{ width: `${skillLevel(skill?.level)}%` }} />
                                </div>
                            </div>
                        ))}
                    </SideSection>
                )}

                {/* Languages */}
                {safeLanguages.length > 0 && (
                    <SideSection title={t.languages}>
                        {safeLanguages.map((l, i) => (
                            <div key={i} className="flex justify-between text-xs text-white opacity-85 mb-1">
                                <span>{l?.language}</span>
                                <span className="opacity-70">{l?.level}</span>
                            </div>
                        ))}
                    </SideSection>
                )}

                {/* Certifications */}
                {safeCertifications.length > 0 && (
                    <SideSection title={t.certifications}>
                        {safeCertifications.map((cert, i) => (
                            <div key={cert?.id || i} className="mb-2">
                                <div className="text-xs text-white font-semibold">{cert?.name}</div>
                                <div className="text-xs text-white opacity-70">{cert?.issuer} · {fmtDate(cert?.date)}</div>
                            </div>
                        ))}
                    </SideSection>
                )}

                {/* References */}
                {safeReferences.length > 0 && (
                    <SideSection title={t.references}>
                        {safeReferences.map((ref, i) => (
                            <div key={ref?.id || i} className="mb-2">
                                <div className="text-xs text-white font-semibold">{ref?.name}</div>
                                <div className="text-xs text-white opacity-70">{ref?.company}</div>
                                <div className="text-xs text-white opacity-70">{ref?.email}</div>
                            </div>
                        ))}
                    </SideSection>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-7 overflow-y-auto">
                {summary && (
                    <MainSection title={t.profile}>
                        <div className="text-xs leading-relaxed" style={{ color: txtColor }}>
                            <MD content={summary} />
                        </div>
                    </MainSection>
                )}

                {safeExperience.length > 0 && (
                    <MainSection title={t.experience}>
                        <div className="space-y-4">
                            {safeExperience.map((exp, i) => (
                                <div key={exp?.id || i} className="relative pl-4" style={{ borderLeft: `2px solid ${color}20`, pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                    <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2" style={{ backgroundColor: 'white', borderColor: color }} />
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className="text-sm font-semibold" style={{ color: txtColor }}>{exp?.jobTitle}</h3>
                                        <span className="text-xs text-gray-400">{exp?.city}</span>
                                    </div>
                                    <div className="text-xs font-medium mb-0.5" style={{ color }}>{exp?.employer}</div>
                                    <div className="text-xs text-gray-400 mb-1">{fmtDate(exp?.startDate)} — {exp?.endDate ? fmtDate(exp.endDate) : t.present}</div>
                                    <div className="text-xs" style={{ ...textAlignStyle, color: txtColor }}><MD content={exp?.description} /></div>
                                </div>
                            ))}
                        </div>
                    </MainSection>
                )}

                {safeEducation.length > 0 && (
                    <MainSection title={t.education}>
                        <div className="space-y-3">
                            {safeEducation.map((edu, i) => (
                                <div key={edu?.id || i} className="relative pl-4" style={{ borderLeft: `2px solid ${color}20`, pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                    <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2" style={{ backgroundColor: 'white', borderColor: color }} />
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className="text-sm font-semibold" style={{ color: txtColor }}>{edu?.degree}</h3>
                                        <span className="text-xs text-gray-400">{edu?.city}</span>
                                    </div>
                                    <div className="text-xs font-medium mb-0.5" style={{ color }}>{edu?.school}</div>
                                    <div className="text-xs text-gray-400 mb-1">{fmtDate(edu?.startDate)} — {edu?.endDate ? fmtDate(edu.endDate) : t.present}</div>
                                    <div className="text-xs" style={{ ...textAlignStyle, color: txtColor }}><MD content={edu?.description} /></div>
                                </div>
                            ))}
                        </div>
                    </MainSection>
                )}

                {safeOrganizations.length > 0 && (
                    <MainSection title={t.organizations}>
                        <div className="space-y-3">
                            {safeOrganizations.map((org, i) => (
                                <div key={org?.id || i} className="relative pl-4" style={{ borderLeft: `2px solid ${color}20`, pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                    <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2" style={{ backgroundColor: 'white', borderColor: color }} />
                                    <h3 className="text-sm font-semibold" style={{ color: txtColor }}>{org?.role}</h3>
                                    <div className="text-xs font-medium mb-0.5" style={{ color }}>{org?.organization}</div>
                                    <div className="text-xs text-gray-400 mb-1">{fmtDate(org?.startDate)} — {org?.endDate ? fmtDate(org.endDate) : t.present}</div>
                                    <div className="text-xs" style={{ ...textAlignStyle, color: txtColor }}><MD content={org?.description} /></div>
                                </div>
                            ))}
                        </div>
                    </MainSection>
                )}

                {safeCourses.length > 0 && (
                    <MainSection title={t.courses}>
                        {safeCourses.map((c, i) => (
                            <div key={c?.id || i} className="mb-2">
                                <div className="text-sm font-semibold" style={{ color: txtColor }}>{c?.name}</div>
                                <div className="text-xs text-gray-500">{c?.institution} · {c?.startDate} — {c?.endDate}</div>
                            </div>
                        ))}
                    </MainSection>
                )}

                {/* Custom Sections */}
                {(Array.isArray(customSections) ? customSections : []).map((section) => {
                    if (section.type === 'paragraph_like' && section.description) {
                        return (
                            <MainSection key={section.id} title={section.name}>
                                <div className="text-xs leading-relaxed" style={{ color: txtColor }}>
                                    <MD content={section.description} />
                                </div>
                            </MainSection>
                        );
                    }
                    if (section.type === 'skill_like' && section.items?.length > 0) {
                        return (
                            <MainSection key={section.id} title={section.name}>
                                <div className="flex flex-wrap gap-1">
                                    {section.items.map((item, idx) => (
                                        <span key={item?.id || idx} className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: `${color}40`, color: txtColor }}>
                                            {item?.name}{item?.level ? ` (${item.level})` : ''}
                                        </span>
                                    ))}
                                </div>
                            </MainSection>
                        );
                    }
                    if (section.type === 'experience_like' && section.items?.length > 0) {
                        return (
                            <MainSection key={section.id} title={section.name}>
                                <div className="space-y-4">
                                    {section.items.map((item, idx) => (
                                        <div key={item?.id || idx} className="relative pl-4" style={{ borderLeft: `2px solid ${color}20`, pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                            <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2" style={{ backgroundColor: 'white', borderColor: color }} />
                                            <div className="flex justify-between items-baseline mb-0.5">
                                                <h3 className="text-sm font-semibold" style={{ color: txtColor }}>{item?.title}</h3>
                                                <span className="text-xs text-gray-400">{item?.city}</span>
                                            </div>
                                            <div className="text-xs font-medium mb-0.5" style={{ color }}>{item?.subtitle}</div>
                                            <div className="text-xs text-gray-400 mb-1">{item?.date}</div>
                                            <div className="text-xs" style={{ ...textAlignStyle, color: txtColor }}><MD content={item?.description} /></div>
                                        </div>
                                    ))}
                                </div>
                            </MainSection>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default CreativeTemplate;
