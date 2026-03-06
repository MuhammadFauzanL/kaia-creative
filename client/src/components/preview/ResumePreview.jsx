import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import ModernTemplate from './templates/ModernTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import TechTemplate from './templates/TechTemplate';
import { GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TEMPLATES = [
    { id: 'modern', label: 'Modern', emoji: '🎨' },
    { id: 'professional', label: 'Professional', emoji: '📋' },
    { id: 'minimal', label: 'Minimal', emoji: '⬜' },
    { id: 'creative', label: 'Creative', emoji: '✨' },
    { id: 'executive', label: 'Executive', emoji: '👔' },
    { id: 'tech', label: 'Tech', emoji: '💻' },
];

const TEMPLATE_MAP = {
    modern: ModernTemplate,
    professional: ProfessionalTemplate,
    minimal: MinimalTemplate,
    creative: CreativeTemplate,
    executive: ExecutiveTemplate,
    tech: TechTemplate,
};

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

const SECTION_LABELS = {
    education: 'Education',
    experience: 'Experience',
    organizations: 'Organizations',
    certifications: 'Certifications',
    languages: 'Languages',
    skills: 'Skills',
    courses: 'Courses',
    references: 'References',
};

const SortableSection = ({ id, label }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1.5 border border-gray-100 mb-1">
            <div {...attributes} {...listeners} className="cursor-move p-1 text-gray-400 hover:text-gray-600">
                <GripVertical className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-gray-700 flex-1">{label}</span>
        </div>
    );
};

const ResumePreview = () => {
    const { resumeData, updateResumeData } = useResume();
    const [selectedTemplate, setSelectedTemplate] = useState(resumeData?.template || 'modern');
    const [showSectionOrder, setShowSectionOrder] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    if (!resumeData) return null;

    const handleTemplateChange = (template) => {
        setSelectedTemplate(template);
        updateResumeData({ template });
    };

    const TemplateComponent = TEMPLATE_MAP[selectedTemplate] || ModernTemplate;

    const isProfessional = selectedTemplate === 'professional';
    const customSections = Array.isArray(resumeData.customSections) ? resumeData.customSections : [];
    const sectionOrder = resumeData.sectionOrder || DEFAULT_SECTION_ORDER;

    // Build labels map that includes custom sections
    const allSectionLabels = { ...SECTION_LABELS };
    customSections.forEach(cs => {
        allSectionLabels[cs.id] = cs.name || 'Custom Section';
    });

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = sectionOrder.indexOf(active.id);
            const newIndex = sectionOrder.indexOf(over.id);
            if (oldIndex !== -1 && newIndex !== -1) {
                updateResumeData({ sectionOrder: arrayMove(sectionOrder, oldIndex, newIndex) });
            }
        }
    };

    return (
        <div className="flex flex-col items-center space-y-3 print:block print:space-y-0 w-full">
            {/* Controls - Row 1: Template + Settings */}
            <div className="bg-white p-2.5 rounded-xl shadow-md print:hidden z-10 sticky top-0 border border-gray-100 w-full max-w-[820px]">
                {/* Row 1: Templates */}
                <div className="flex flex-wrap gap-1.5 items-center justify-center mb-2">
                    <span className="text-xs font-semibold text-gray-500 mr-1">Template:</span>
                    {TEMPLATES.map(t => (
                        <button
                            key={t.id}
                            onClick={() => handleTemplateChange(t.id)}
                            title={t.label}
                            className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-150 border ${selectedTemplate === t.id
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                                }`}
                        >
                            {t.emoji} {t.label}
                        </button>
                    ))}
                </div>

                {/* Row 2: Settings */}
                <div className="flex flex-wrap gap-2 items-center justify-center">
                    {/* Font */}
                    <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-gray-500">Font:</span>
                        <select
                            value={resumeData.font || 'Times New Roman'}
                            onChange={(e) => updateResumeData({ font: e.target.value })}
                            className="text-xs border border-gray-200 rounded-md py-1 pl-1.5 pr-5 bg-white cursor-pointer"
                        >
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Arial">Arial</option>
                            <option value="Calibri">Calibri</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Verdana">Verdana</option>
                            <option value="Courier New">Courier New</option>
                            <option value="Inter">Inter</option>
                        </select>
                    </div>

                    <div className="w-px h-5 bg-gray-200" />

                    {/* Theme Color */}
                    <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-gray-500">Tema:</span>
                        <input
                            type="color"
                            value={resumeData.themeColor || '#007BFF'}
                            onChange={(e) => updateResumeData({ themeColor: e.target.value })}
                            className="w-6 h-6 rounded border border-gray-200 cursor-pointer p-0.5"
                            title="Pilih warna tema"
                        />
                    </div>

                    {/* Text Color & Alignment - only for non-professional templates */}
                    {!isProfessional && (
                        <>
                            <div className="w-px h-5 bg-gray-200" />
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-semibold text-gray-500">Teks:</span>
                                <input
                                    type="color"
                                    value={resumeData.textColor || '#000000'}
                                    onChange={(e) => updateResumeData({ textColor: e.target.value })}
                                    className="w-6 h-6 rounded border border-gray-200 cursor-pointer p-0.5"
                                    title="Pilih warna teks"
                                />
                            </div>
                            <div className="w-px h-5 bg-gray-200" />
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-semibold text-gray-500">Rata:</span>
                                <div className="flex gap-0.5">
                                    {[
                                        { value: 'left', icon: '⫶', title: 'Rata Kiri' },
                                        { value: 'center', icon: '☰', title: 'Rata Tengah' },
                                        { value: 'right', icon: '⫷', title: 'Rata Kanan' },
                                        { value: 'justify', icon: '▤', title: 'Rata Kanan-Kiri (Justify)' },
                                    ].map(({ value, icon, title }) => (
                                        <button
                                            key={value}
                                            title={title}
                                            onClick={() => updateResumeData({ textAlign: value })}
                                            className={`w-6 h-6 rounded text-xs flex items-center justify-center border transition-all ${(resumeData.textAlign || 'left') === value
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                                                }`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="w-px h-5 bg-gray-200" />

                    {/* Language */}
                    <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-gray-500">Bahasa:</span>
                        <select
                            value={resumeData.language || 'en'}
                            onChange={(e) => updateResumeData({ language: e.target.value })}
                            className="text-xs border border-gray-200 rounded-md py-1 pl-1.5 pr-5 bg-white cursor-pointer"
                        >
                            <option value="en">🇬🇧 English</option>
                            <option value="id">🇮🇩 Indonesia</option>
                        </select>
                    </div>

                    {/* Photo Options - for non-professional templates */}
                    {!isProfessional && (
                        <>
                            <div className="w-px h-5 bg-gray-200" />
                            {/* Show Photo Toggle */}
                            <label className="flex items-center gap-1 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={resumeData.showPhoto !== false}
                                    onChange={(e) => updateResumeData({ showPhoto: e.target.checked })}
                                    className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                                <span className="text-xs font-semibold text-gray-500">Foto</span>
                            </label>

                            {/* Photo Shape - only when photo is enabled */}
                            {resumeData.showPhoto !== false && (
                                <>
                                    <div className="flex items-center gap-1">
                                        <select
                                            value={resumeData.photoShape || 'circle'}
                                            onChange={(e) => updateResumeData({ photoShape: e.target.value })}
                                            className="text-xs border border-gray-200 rounded-md py-1 pl-1.5 pr-5 bg-white cursor-pointer"
                                        >
                                            <option value="circle">Bulat</option>
                                            <option value="square">Kotak</option>
                                        </select>
                                    </div>

                                    {/* Photo Size */}
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs font-semibold text-gray-500">Ukuran:</span>
                                        <select
                                            value={resumeData.photoSize || 'medium'}
                                            onChange={(e) => updateResumeData({ photoSize: e.target.value })}
                                            className="text-xs border border-gray-200 rounded-md py-1 pl-1.5 pr-5 bg-white cursor-pointer"
                                        >
                                            <option value="small">Kecil</option>
                                            <option value="medium">Sedang</option>
                                            <option value="large">Besar</option>
                                        </select>
                                    </div>

                                    {/* Photo Outline Toggle */}
                                    <label className="flex items-center gap-1 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={resumeData.photoOutline === true}
                                            onChange={(e) => updateResumeData({ photoOutline: e.target.checked })}
                                            className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span className="text-xs font-semibold text-gray-500">Outline</span>
                                    </label>
                                </>
                            )}
                        </>
                    )}

                    {/* Section Order Button */}
                    <>
                        <div className="w-px h-5 bg-gray-200" />
                        <button
                            onClick={() => setShowSectionOrder(!showSectionOrder)}
                            className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-all ${showSectionOrder
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                                }`}
                        >
                            {showSectionOrder ? 'Sembunyikan Urutan' : 'Urutkan Section'}
                        </button>
                    </>
                </div>
            </div>

            {/* Section Order Panel */}
            {showSectionOrder && (
                <div className="bg-white p-3 rounded-xl shadow-md print:hidden z-10 border border-gray-100 w-full max-w-sm self-center">
                    <div className="text-xs font-semibold text-gray-500 mb-2">Urutkan dengan drag:</div>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                            {sectionOrder.map((sectionKey) => (
                                <SortableSection key={sectionKey} id={sectionKey} label={allSectionLabels[sectionKey] || sectionKey} />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
            )}

            {/* Resume Preview - A4 Paper */}
            <div
                className="resume-paper bg-white shadow-2xl print:shadow-none print:w-full print:m-0 print:max-w-none self-center flex-shrink-0"
                style={{
                    width: '210mm',
                    minHeight: '297mm',
                    maxWidth: '100%',
                }}
            >
                <TemplateComponent data={resumeData} />
            </div>
        </div>
    );
};

export default ResumePreview;