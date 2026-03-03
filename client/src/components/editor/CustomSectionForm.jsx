import React from 'react';
import { useResume } from '../../context/ResumeContext';
import Input from '../ui/Input';
import RichTextarea from '../ui/RichTextarea';
import Button from '../ui/Button';
import { Plus, X, Trash2 } from 'lucide-react';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const CustomSectionForm = ({ sectionId }) => {
    const { resumeData, updateResumeData } = useResume();
    const customSections = Array.isArray(resumeData?.customSections) ? resumeData.customSections : [];
    const sectionIndex = customSections.findIndex(s => s.id === sectionId);

    if (sectionIndex === -1) return null;

    const section = customSections[sectionIndex];
    const items = Array.isArray(section.items) ? section.items : [];

    const handleUpdateSection = (updatedSection) => {
        const newSections = [...customSections];
        newSections[sectionIndex] = updatedSection;
        updateResumeData({ customSections: newSections });
    };

    const handleAddItem = () => {
        const newItem = section.type === 'skill_like'
            ? { id: generateId(), name: '', level: '' }
            : { id: generateId(), title: '', subtitle: '', date: '', description: '', city: '' };
        handleUpdateSection({ ...section, items: [...items, newItem] });
    };

    const handleRemoveItem = (itemId) => {
        handleUpdateSection({ ...section, items: items.filter(i => i.id !== itemId) });
    };

    const handleChangeItem = (itemId, field, value) => {
        const newItems = items.map(i => i.id === itemId ? { ...i, [field]: value } : i);
        handleUpdateSection({ ...section, items: newItems });
    };

    const handleDeleteSection = () => {
        if (window.confirm('Are you sure you want to delete this custom section?')) {
            const newSections = customSections.filter(s => s.id !== sectionId);
            const newSectionOrder = (resumeData.sectionOrder || []).filter(id => id !== sectionId);
            updateResumeData({ customSections: newSections, sectionOrder: newSectionOrder });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
                <input
                    type="text"
                    value={section.name}
                    onChange={(e) => handleUpdateSection({ ...section, name: e.target.value })}
                    className="text-xl font-bold bg-transparent border-b-2 border-dashed border-gray-300 outline-none focus:border-blue-500 text-gray-800 transition-colors px-1 py-1"
                    title="Click to rename section"
                />
                <div className="flex gap-2">
                    {section.type !== 'paragraph_like' && (
                        <Button onClick={handleAddItem} size="sm" className="text-sm py-1 px-3 bg-blue-500 text-white hover:bg-blue-600">
                            <Plus className="w-4 h-4 mr-1" /> Add Item
                        </Button>
                    )}
                    <Button onClick={handleDeleteSection} size="sm" className="text-sm py-1 px-3 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Type indicator */}
            <div className="text-xs text-gray-400 italic">
                Layout: {section.type === 'paragraph_like' ? 'Paragraph' : section.type === 'skill_like' ? 'Simple List' : 'Experience / Education'}
            </div>

            {section.type === 'paragraph_like' && (
                <RichTextarea
                    label="Description"
                    placeholder="Write a paragraph regarding this custom section..."
                    value={section.description || ''}
                    onChange={(e) => handleUpdateSection({ ...section, description: e.target.value })}
                    rows={6}
                />
            )}

            {section.type === 'skill_like' && (
                <div className="space-y-3">
                    {items.length === 0 && (
                        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500 text-sm">Add items here.</p>
                        </div>
                    )}
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-200 animate-fadeIn">
                            <div className="flex-grow">
                                <Input placeholder="Item Name (e.g. Public Speaking)" value={item.name || ''} onChange={(e) => handleChangeItem(item.id, 'name', e.target.value)} className="mb-0" />
                            </div>
                            <div className="w-1/3">
                                <Input placeholder="Additional Info (Optional)" value={item.level || ''} onChange={(e) => handleChangeItem(item.id, 'level', e.target.value)} className="mb-0" />
                            </div>
                            <button onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-red-500 p-2">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {section.type === 'experience_like' && (
                <div className="space-y-4">
                    {items.length === 0 && (
                        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500 text-sm">Add entries here.</p>
                        </div>
                    )}
                    {items.map((item) => (
                        <div key={item.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm relative animate-fadeIn">
                            <button onClick={() => handleRemoveItem(item.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-2 pr-6">
                                <Input label="Title/Role" placeholder="e.g. Lead Researcher" value={item.title || ''} onChange={(e) => handleChangeItem(item.id, 'title', e.target.value)} />
                                <Input label="Subtitle/Organization" placeholder="e.g. Tech Corp" value={item.subtitle || ''} onChange={(e) => handleChangeItem(item.id, 'subtitle', e.target.value)} />
                                <Input label="Date Period" placeholder="e.g. Jan 2020 - Present" value={item.date || ''} onChange={(e) => handleChangeItem(item.id, 'date', e.target.value)} />
                                <Input label="Location" placeholder="e.g. New York, NY" value={item.city || ''} onChange={(e) => handleChangeItem(item.id, 'city', e.target.value)} />
                            </div>
                            <RichTextarea
                                label="Description"
                                placeholder="Describe your role and achievements..."
                                value={item.description || ''}
                                onChange={(e) => handleChangeItem(item.id, 'description', e.target.value)}
                                rows={4}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSectionForm;
