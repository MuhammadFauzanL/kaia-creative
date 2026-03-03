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

const ModernTemplate = ({ data }) => {
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

    const color = themeColor || '#007BFF';
    const txtColor = textColor || '#000000';
    const fontStyle = { fontFamily: font || '"Segoe UI", Arial, sans-serif' };
    const textAlignStyle = { textAlign: safeData.textAlign || 'left' };
    const shouldShowPhoto = showPhoto !== false;
    const photoRadius = photoShape === 'square' ? '4px' : '50%';
    const photoBorder = photoOutline ? `2px solid ${color}` : 'none';
    const photoSizePx = safeData.photoSize === 'small' ? '40px' : safeData.photoSize === 'large' ? '96px' : '64px';
    const lang = language || 'en';
    const t = {
        profile: lang === 'id' ? 'Profil' : 'Profile',
        experience: lang === 'id' ? 'Pengalaman Kerja' : 'Employment History',
        education: lang === 'id' ? 'Pendidikan' : 'Education',
        skills: lang === 'id' ? 'Keahlian' : 'Skills',
        organizations: lang === 'id' ? 'Organisasi' : 'Organizations',
        languages: lang === 'id' ? 'Bahasa' : 'Languages',
        certifications: lang === 'id' ? 'Sertifikasi' : 'Certifications',
        references: lang === 'id' ? 'Referensi' : 'References',
        courses: lang === 'id' ? 'Kursus' : 'Courses',
        present: lang === 'id' ? 'Sekarang' : 'Present',
    };

    const safeExperience = Array.isArray(experience) ? experience : [];
    const safeEducation = Array.isArray(education) ? education : [];
    const safeSkills = Array.isArray(skills) ? skills : [];
    const safeOrganizations = Array.isArray(organizations) ? organizations : [];
    const safeLanguages = Array.isArray(languages) ? languages : [];
    const safeCourses = Array.isArray(courses) ? courses : [];
    const safeReferences = Array.isArray(references) ? references : [];
    const safeCertifications = Array.isArray(certifications) ? certifications : [];

    return (
        <div className="w-full h-full bg-white p-8 relative" style={{ ...fontStyle, color: txtColor }}>
            <header className="mb-6 border-b-2 pb-6" style={{ borderColor: color }}>
                <div className="flex items-start gap-4">
                    {shouldShowPhoto && personalInfo?.photoUrl && (
                        <img
                            src={personalInfo.photoUrl}
                            alt={`${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`}
                            className="object-cover flex-shrink-0"
                            style={{ width: photoSizePx, height: photoSizePx, borderRadius: photoRadius, border: photoBorder }}
                        />
                    )}
                    <div>
                        <h1 className="text-4xl font-bold tracking-wide" style={{ color: txtColor }}>
                            {personalInfo?.firstName} <span style={{ color }}>{personalInfo?.lastName}</span>
                        </h1>
                        <p className="text-xl font-medium text-gray-600 mt-1">{personalInfo?.jobTitle}</p>
                    </div>
                </div>
                <div className="flex flex-wrap mt-2 text-sm text-gray-600 gap-x-4 gap-y-1">
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo?.city && (
                        <span>{personalInfo.city}{personalInfo.country ? `, ${personalInfo.country}` : ''}</span>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8 space-y-6">
                    {summary && (
                        <section>
                            <h2 className="text-lg uppercase tracking-wider mb-2" style={{ color }}>{t.profile}</h2>
                            <div className="text-gray-700 leading-relaxed text-sm pl-4">
                                <MD content={summary} />
                            </div>
                        </section>
                    )}

                    {safeExperience.length > 0 && (
                        <section>
                            <h2 className="text-lg uppercase tracking-wider mb-4 border-b-2 inline-block pb-1"
                                style={{ color, borderColor: color }}>{t.experience}</h2>
                            <div className="space-y-6">
                                {safeExperience.map((exp, index) => (
                                    <div key={exp?.id || index} className="flex flex-col sm:flex-row gap-4" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                        <div className="sm:w-1/4 flex-shrink-0">
                                            <div className="text-sm font-semibold text-gray-600">
                                                {fmtDate(exp?.startDate)} - {exp?.endDate ? fmtDate(exp.endDate) : t.present}
                                            </div>
                                        </div>
                                        <div className="sm:w-3/4">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-lg" style={{ color: txtColor }}>{exp?.jobTitle}</h3>
                                                <span className="text-sm text-gray-500">{exp?.city}</span>
                                            </div>
                                            <div className="text-sm font-medium text-gray-700 mb-2">{exp?.employer}</div>
                                            <div className="text-sm text-gray-700 leading-relaxed pl-0" style={textAlignStyle}>
                                                <MD content={exp?.description} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {safeEducation.length > 0 && (
                        <section>
                            <h2 className="text-lg uppercase tracking-wider mb-4 border-b-2 inline-block pb-1"
                                style={{ color, borderColor: color }}>{t.education}</h2>
                            <div className="space-y-6">
                                {safeEducation.map((edu, index) => (
                                    <div key={edu?.id || index} className="flex flex-col sm:flex-row gap-4" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                        <div className="sm:w-1/4 flex-shrink-0">
                                            <div className="text-sm font-semibold text-gray-600">
                                                {fmtDate(edu?.startDate)} - {edu?.endDate ? fmtDate(edu.endDate) : t.present}
                                            </div>
                                        </div>
                                        <div className="sm:w-3/4">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-lg" style={{ color: txtColor }}>{edu?.degree}</h3>
                                                <span className="text-sm text-gray-500">{edu?.city}</span>
                                            </div>
                                            <div className="text-sm font-medium text-gray-700 mb-2">{edu?.school}</div>
                                            <div className="text-sm text-gray-700 leading-relaxed pl-0" style={textAlignStyle}>
                                                <MD content={edu?.description} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {safeOrganizations.length > 0 && (
                        <section>
                            <h2 className="text-lg uppercase tracking-wider mb-4 border-b-2 inline-block pb-1"
                                style={{ color, borderColor: color }}>{t.organizations}</h2>
                            <div className="space-y-6">
                                {safeOrganizations.map((org, index) => (
                                    <div key={org?.id || index} className="flex flex-col sm:flex-row gap-4" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                        <div className="sm:w-1/4 flex-shrink-0">
                                            <div className="text-sm font-semibold text-gray-600">
                                                {fmtDate(org?.startDate)} - {org?.endDate ? fmtDate(org.endDate) : t.present}
                                            </div>
                                        </div>
                                        <div className="sm:w-3/4">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-lg" style={{ color: txtColor }}>{org?.role}</h3>
                                            </div>
                                            <div className="text-sm font-medium text-gray-700 mb-2">{org?.organization}</div>
                                            <div className="text-sm text-gray-700 leading-relaxed pl-0" style={textAlignStyle}>
                                                <MD content={org?.description} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {safeCertifications.length > 0 && (
                        <section>
                            <h2 className="text-lg uppercase tracking-wider mb-4 border-b-2 inline-block pb-1"
                                style={{ color, borderColor: color }}>{t.certifications}</h2>
                            <div className="space-y-3">
                                {safeCertifications.map((cert, index) => (
                                    <div key={cert?.id || index} className="flex justify-between items-baseline">
                                        <div>
                                            <span className="text-sm font-semibold" style={{ color: txtColor }}>{cert?.name}</span>
                                            <span className="text-sm text-gray-500 ml-2">· {cert?.issuer}</span>
                                        </div>
                                        <span className="text-sm text-gray-400">{fmtDate(cert?.date)}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {safeCourses.length > 0 && (
                        <section>
                            <h2 className="text-lg uppercase tracking-wider mb-4 border-b-2 inline-block pb-1"
                                style={{ color, borderColor: color }}>{t.courses}</h2>
                            <div className="space-y-3">
                                {safeCourses.map((course, index) => (
                                    <div key={course?.id || index}>
                                        <div className="text-sm font-semibold" style={{ color: txtColor }}>{course?.name}</div>
                                        <div className="text-sm text-gray-500">{course?.institution} · {course?.startDate} — {course?.endDate}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {safeReferences.length > 0 && (
                        <section>
                            <h2 className="text-lg uppercase tracking-wider mb-4 border-b-2 inline-block pb-1"
                                style={{ color, borderColor: color }}>{t.references}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {safeReferences.map((ref, index) => (
                                    <div key={ref?.id || index} className="text-sm">
                                        <div className="font-semibold" style={{ color: txtColor }}>{ref?.name}</div>
                                        <div className="text-gray-600">{ref?.company}</div>
                                        <div className="text-gray-500">{ref?.email}</div>
                                        <div className="text-gray-500">{ref?.phone}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Custom Sections */}
                    {(Array.isArray(customSections) ? customSections : []).map((section) => {
                        if (section.type === 'paragraph_like' && section.description) {
                            return (
                                <section key={section.id}>
                                    <h2 className="text-lg uppercase tracking-wider mb-2" style={{ color }}>{section.name}</h2>
                                    <div className="text-gray-700 leading-relaxed text-sm pl-4">
                                        <MD content={section.description} />
                                    </div>
                                </section>
                            );
                        }
                        if (section.type === 'skill_like' && section.items?.length > 0) {
                            return (
                                <section key={section.id}>
                                    <h2 className="text-lg uppercase tracking-wider mb-4 border-b-2 inline-block pb-1"
                                        style={{ color, borderColor: color }}>{section.name}</h2>
                                    <div className="space-y-2 pl-4">
                                        {section.items.map((item, idx) => (
                                            <div key={item?.id || idx} className="flex justify-between text-sm">
                                                <span className="font-semibold" style={{ color: txtColor }}>{item?.name}</span>
                                                {item?.level && <span className="text-gray-500">{item.level}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        }
                        if (section.type === 'experience_like' && section.items?.length > 0) {
                            return (
                                <section key={section.id}>
                                    <h2 className="text-lg uppercase tracking-wider mb-4 border-b-2 inline-block pb-1"
                                        style={{ color, borderColor: color }}>{section.name}</h2>
                                    <div className="space-y-6">
                                        {section.items.map((item, idx) => (
                                            <div key={item?.id || idx} className="flex flex-col sm:flex-row gap-4" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                                <div className="sm:w-1/4 flex-shrink-0">
                                                    <div className="text-sm font-semibold text-gray-600">{item?.date}</div>
                                                </div>
                                                <div className="sm:w-3/4">
                                                    <div className="flex justify-between items-baseline mb-1">
                                                        <h3 className="font-bold text-lg" style={{ color: txtColor }}>{item?.title}</h3>
                                                        <span className="text-sm text-gray-500">{item?.city}</span>
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-700 mb-2">{item?.subtitle}</div>
                                                    <div className="text-sm text-gray-700 leading-relaxed pl-0" style={textAlignStyle}>
                                                        <MD content={item?.description} />
                                                    </div>
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

                <div className="col-span-4 space-y-6">
                    {(personalInfo?.linkedin || personalInfo?.website) ? (
                        <section>
                            <h2 className="text-lg uppercase tracking-wider mb-3" style={{ color }}>Links</h2>
                            <div className="space-y-2 text-sm text-gray-700 pl-4">
                                {personalInfo.linkedin && (
                                    <div className="flex items-center">
                                        <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
                                    </div>
                                )}
                                {personalInfo.website && (
                                    <div className="flex items-center">
                                        <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">Website</a>
                                    </div>
                                )}
                            </div>
                        </section>
                    ) : null}

                    {safeSkills.length > 0 && (
                        <section>
                            <h2 className="text-lg uppercase tracking-wider mb-3" style={{ color }}>{t.skills}</h2>
                            <div className="flex flex-col space-y-2 pl-4">
                                {safeSkills.map((skill, index) => (
                                    <div key={skill?.id || index}>
                                        <div className="text-sm font-medium text-gray-700">{skill?.name}</div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                            <div
                                                className="h-1.5 rounded-full"
                                                style={{
                                                    width: skill?.level === 'Expert' ? '100%' : skill?.level === 'Intermediate' ? '66%' : '33%',
                                                    backgroundColor: color
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {safeLanguages.length > 0 && (
                        <section>
                            <h2 className="text-lg uppercase tracking-wider mb-3" style={{ color }}>{t.languages}</h2>
                            <div className="space-y-1 pl-4">
                                {safeLanguages.map((l, index) => (
                                    <div key={index} className="flex justify-between text-sm text-gray-600">
                                        <span>{l?.language}</span>
                                        <span className="text-gray-400">{l?.level}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModernTemplate;