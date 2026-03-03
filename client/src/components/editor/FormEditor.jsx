import React, { useState } from 'react';
import PersonalDetailsForm from './PersonalDetailsForm';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import SkillsForm from './SkillsForm';
import SummaryForm from './SummaryForm';
import OrganizationForm from './OrganizationForm';
import LanguageForm from './LanguageForm';
import CourseForm from './CourseForm';
import ReferenceForm from './ReferenceForm';
import CertificationForm from './CertificationForm';
import CustomSectionForm from './CustomSectionForm';
import { useResume } from '../../context/ResumeContext';
import { User, Briefcase, GraduationCap, PenTool, FileText, Award, Plus, FolderPlus, X } from 'lucide-react';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const FormEditor = () => {
    const { resumeData, updateResumeData } = useResume();
    const customSections = Array.isArray(resumeData?.customSections) ? resumeData.customSections : [];

    const [activeSection, setActiveSection] = useState('personal');
    const [showAddSection, setShowAddSection] = useState(false);
    const [newSectionType, setNewSectionType] = useState('experience_like');
    const [newSectionName, setNewSectionName] = useState('My Custom Section');

    const coreSections = [
        { id: 'personal', label: 'Personal Details', icon: User, component: PersonalDetailsForm },
        { id: 'summary', label: 'Professional Summary', icon: FileText, component: SummaryForm },
        { id: 'experience', label: 'Employment History', icon: Briefcase, component: ExperienceForm },
        { id: 'education', label: 'Education', icon: GraduationCap, component: EducationForm },
        { id: 'skills', label: 'Skills', icon: PenTool, component: SkillsForm },
        { id: 'organizations', label: 'Organizations', icon: User, component: OrganizationForm },
        { id: 'languages', label: 'Languages', icon: FileText, component: LanguageForm },
        { id: 'courses', label: 'Courses', icon: GraduationCap, component: CourseForm },
        { id: 'certifications', label: 'Certifications', icon: Award, component: CertificationForm },
        { id: 'references', label: 'References', icon: User, component: ReferenceForm },
    ];

    const dynamicSections = customSections.map(cs => ({
        id: cs.id,
        label: cs.name || 'Custom Section',
        icon: FolderPlus,
        custom: true
    }));

    const handleAddCustomSection = (e) => {
        e.preventDefault();
        const newSection = {
            id: 'custom-' + generateId(),
            name: newSectionName,
            type: newSectionType,
            items: [],
            description: ''
        };
        const newCustomSections = [...customSections, newSection];
        // Add id to sectionOrder
        const updatedSectionOrder = [...(resumeData.sectionOrder || [])];
        if (!updatedSectionOrder.includes(newSection.id)) {
            updatedSectionOrder.push(newSection.id);
        }

        updateResumeData({
            customSections: newCustomSections,
            sectionOrder: updatedSectionOrder
        });

        setActiveSection(newSection.id);
        setShowAddSection(false);
        setNewSectionName('My Custom Section');
    };

    const renderActiveComponent = () => {
        const coreSection = coreSections.find(s => s.id === activeSection);
        if (coreSection) {
            const ActiveComponent = coreSection.component;
            return <ActiveComponent />;
        }

        const customSection = dynamicSections.find(s => s.id === activeSection);
        if (customSection) {
            return <CustomSectionForm sectionId={customSection.id} />;
        }

        return <PersonalDetailsForm />;
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Resume Editor</h2>

            <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-gray-200 mb-6">
                {coreSections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 whitespace-nowrap ${activeSection === section.id
                                ? 'bg-blue-100 text-blue-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Icon className="h-4 w-4 mr-2" />
                            {section.label}
                        </button>
                    );
                })}

                {dynamicSections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 whitespace-nowrap ${activeSection === section.id
                                ? 'bg-purple-100 text-purple-700 font-medium border border-purple-200'
                                : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                                }`}
                        >
                            <Icon className="h-4 w-4 mr-2 text-purple-500" />
                            {section.label}
                        </button>
                    );
                })}

                <div className="relative">
                    <button
                        onClick={() => setShowAddSection(!showAddSection)}
                        className="flex items-center px-4 py-2 rounded-md transition-colors duration-200 whitespace-nowrap text-blue-600 border border-dashed border-blue-300 hover:bg-blue-50"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Section
                    </button>

                    {showAddSection && (
                        <div className="absolute top-12 right-0 bg-white border border-gray-200 shadow-xl rounded-lg p-4 w-[320px] z-50">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-gray-800">New Custom Section</h3>
                                <button onClick={() => setShowAddSection(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <form onSubmit={handleAddCustomSection} className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Section Name</label>
                                    <input
                                        type="text"
                                        autoFocus
                                        value={newSectionName}
                                        onChange={(e) => setNewSectionName(e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Layout Type</label>
                                    <div className="space-y-2">
                                        <label className="flex items-start gap-2 text-sm cursor-pointer p-2 rounded hover:bg-gray-50 border border-gray-100">
                                            <input type="radio" className="mt-1" name="sectionType" value="experience_like" checked={newSectionType === 'experience_like'} onChange={(e) => setNewSectionType(e.target.value)} />
                                            <div>
                                                <div className="font-medium text-gray-800">Experience / Education</div>
                                                <div className="text-xs text-gray-500">Includes Title, Subtitle, Date, City, and Description</div>
                                            </div>
                                        </label>
                                        <label className="flex items-start gap-2 text-sm cursor-pointer p-2 rounded hover:bg-gray-50 border border-gray-100">
                                            <input type="radio" className="mt-1" name="sectionType" value="skill_like" checked={newSectionType === 'skill_like'} onChange={(e) => setNewSectionType(e.target.value)} />
                                            <div>
                                                <div className="font-medium text-gray-800">Simple List / Skills</div>
                                                <div className="text-xs text-gray-500">Includes Name and supplementary text</div>
                                            </div>
                                        </label>
                                        <label className="flex items-start gap-2 text-sm cursor-pointer p-2 rounded hover:bg-gray-50 border border-gray-100">
                                            <input type="radio" className="mt-1" name="sectionType" value="paragraph_like" checked={newSectionType === 'paragraph_like'} onChange={(e) => setNewSectionType(e.target.value)} />
                                            <div>
                                                <div className="font-medium text-gray-800">Rich Text Paragraph</div>
                                                <div className="text-xs text-gray-500">Single rich text editor for a freeform paragraph</div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 text-sm font-medium transition-colors">
                                    Create Section
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            <div className="animate-fadeIn">
                {renderActiveComponent()}
            </div>
        </div>
    );
};

export default FormEditor;