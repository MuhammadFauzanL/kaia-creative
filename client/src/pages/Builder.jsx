import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ResumeProvider, useResume } from '../context/ResumeContext';
import FormEditor from '../components/editor/FormEditor';
import ResumePreview from '../components/preview/ResumePreview';
import { Download, Trash2, Target, Send, FileText, Save, ChevronDown, FileType } from 'lucide-react';
import { Link } from 'react-router-dom';

const BuilderContent = () => {
    const { resumeData, loading, resetResume } = useResume();
    const [editorWidth, setEditorWidth] = useState(45); // percentage
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);
    const [saveIndicator, setSaveIndicator] = useState(false);
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);
    const downloadMenuRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target)) {
                setShowDownloadMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Show save indicator when data changes
    useEffect(() => {
        if (resumeData && !loading) {
            setSaveIndicator(true);
            const timer = setTimeout(() => setSaveIndicator(false), 1500);

            // Set document title so PDF print dialog uses the correct filename instead of UUID URL
            document.title = resumeData.personalInfo?.firstName
                ? `${resumeData.personalInfo.firstName} Resume`
                : 'Resume';

            return () => clearTimeout(timer);
        }
    }, [resumeData]);

    const handleMouseDown = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!isDragging || !containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        setEditorWidth(Math.max(20, Math.min(70, newWidth)));
    }, [isDragging]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        } else {
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <div className="text-gray-500">Loading builder...</div>
            </div>
        </div>
    );
    if (!resumeData) return <div className="p-10 text-center">Initializing...</div>;

    const handleDownloadPDF = () => {
        setShowDownloadMenu(false);
        window.print();
    };

    const handleDownloadWord = () => {
        setShowDownloadMenu(false);

        // Get the resume preview element
        const resumePaper = document.querySelector('.resume-paper');
        if (!resumePaper) {
            alert('Resume preview not found. Please try again.');
            return;
        }

        // Clone to avoid modifying the live DOM
        const clone = resumePaper.cloneNode(true);

        // Collect all computed styles from stylesheets
        const styleSheets = Array.from(document.styleSheets);
        let allCSS = '';
        styleSheets.forEach(sheet => {
            try {
                const rules = Array.from(sheet.cssRules || []);
                rules.forEach(rule => {
                    allCSS += rule.cssText + '\n';
                });
            } catch (e) {
                // Cross-origin stylesheets can't be read
            }
        });

        // Build inline styles for every element so Word can read them
        const applyInlineStyles = (source, target) => {
            const computed = window.getComputedStyle(source);
            const importantProps = [
                'color', 'background-color', 'background',
                'font-family', 'font-size', 'font-weight', 'font-style',
                'text-align', 'text-decoration', 'text-transform',
                'line-height', 'letter-spacing',
                'margin', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right',
                'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
                'border', 'border-top', 'border-bottom', 'border-left', 'border-right',
                'border-color', 'border-width', 'border-style', 'border-radius',
                'width', 'max-width', 'min-width',
                'display', 'flex-direction', 'justify-content', 'align-items', 'gap',
                'list-style-type', 'white-space', 'word-break', 'overflow-wrap'
            ];
            let inlineStyle = '';
            importantProps.forEach(prop => {
                const val = computed.getPropertyValue(prop);
                if (val && val !== '' && val !== 'none' && val !== 'normal' && val !== 'auto') {
                    inlineStyle += `${prop}:${val};`;
                }
            });
            target.setAttribute('style', (target.getAttribute('style') || '') + inlineStyle);

            const sourceChildren = source.children;
            const targetChildren = target.children;
            for (let i = 0; i < sourceChildren.length && i < targetChildren.length; i++) {
                applyInlineStyles(sourceChildren[i], targetChildren[i]);
            }
        };

        applyInlineStyles(resumePaper, clone);

        const fileName = resumeData.personalInfo?.firstName
            ? `${resumeData.personalInfo.firstName}_Resume`
            : 'Resume';

        // Create Word-compatible HTML document
        const htmlContent = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office"
                  xmlns:w="urn:schemas-microsoft-com:office:word"
                  xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="utf-8">
                <title>${fileName}</title>
                <!--[if gte mso 9]>
                <xml>
                    <w:WordDocument>
                        <w:View>Print</w:View>
                        <w:Zoom>100</w:Zoom>
                        <w:DoNotOptimizeForBrowser/>
                    </w:WordDocument>
                </xml>
                <![endif]-->
                <style>
                    @page {
                        size: A4;
                        margin: 1cm;
                    }
                    body {
                        font-family: 'Times New Roman', serif;
                        margin: 0;
                        padding: 0;
                    }
                    ${allCSS}
                </style>
            </head>
            <body>
                ${clone.outerHTML}
            </body>
            </html>
        `;

        const blob = new Blob(['\ufeff', htmlContent], {
            type: 'application/msword'
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Top Header */}
            <header className="bg-white border-b border-gray-200 px-4 py-2.5 flex justify-between items-center shadow-sm z-20 print:hidden">
                {/* Brand */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>K</div>
                        <span className="font-bold text-gray-800 hidden sm:block">KAIACREATIVE<span className="text-blue-500">STUDIO</span></span>
                    </div>

                    {/* Nav Pills */}
                    <div className="hidden md:flex items-center gap-1 ml-4">
                        <Link to="/tailoring"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                            <Target className="w-3.5 h-3.5" />
                            Resume Tailoring
                        </Link>
                        <Link to="/distribution"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <Send className="w-3.5 h-3.5" />
                            Distribution
                        </Link>
                        <Link to="/cover-letter"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                            <FileText className="w-3.5 h-3.5" />
                            Cover Letter
                        </Link>
                    </div>
                </div>

                {/* Current Resume Title + Save indicator */}
                <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold text-gray-700 truncate max-w-[180px] hidden sm:block">
                        {resumeData.personalInfo?.firstName
                            ? `${resumeData.personalInfo.firstName}'s Resume`
                            : 'My Resume'}
                    </div>
                    {saveIndicator && (
                        <div className="flex items-center gap-1 text-xs text-green-600 animate-pulse">
                            <Save className="w-3 h-3" />
                            <span className="hidden sm:inline">Saved</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Mobile feature links */}
                    <div className="flex md:hidden gap-1">
                        <Link to="/tailoring" title="Resume Tailoring">
                            <button className="p-2 rounded-lg text-purple-600 hover:bg-purple-50">
                                <Target className="w-4 h-4" />
                            </button>
                        </Link>
                        <Link to="/cover-letter" title="Cover Letter">
                            <button className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50">
                                <FileText className="w-4 h-4" />
                            </button>
                        </Link>
                    </div>

                    <button
                        onClick={resetResume}
                        className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg text-red-600 border border-red-200 hover:bg-red-50 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Clear</span>
                    </button>

                    {/* Download Dropdown */}
                    <div className="relative" ref={downloadMenuRef}>
                        <div className="flex">
                            <button
                                onClick={handleDownloadPDF}
                                className="flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-l-lg text-white font-semibold transition-colors"
                                style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
                                <Download className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Download PDF</span>
                                <span className="sm:hidden">PDF</span>
                            </button>
                            <button
                                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                                className="flex items-center px-2 py-1.5 rounded-r-lg text-white font-semibold transition-colors border-l border-white/30"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showDownloadMenu ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        {/* Dropdown Menu */}
                        {showDownloadMenu && (
                            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-50 animate-fadeIn">
                                <button
                                    onClick={handleDownloadPDF}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-4 h-4 text-red-500" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold">Download PDF</div>
                                        <div className="text-xs text-gray-400">Best for sharing</div>
                                    </div>
                                </button>
                                <button
                                    onClick={handleDownloadWord}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                        <FileType className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold">Download Word</div>
                                        <div className="text-xs text-gray-400">Editable .doc file</div>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Feature Banner - compact */}
            <div className="bg-slate-800 px-4 py-2 flex items-center justify-center gap-8 print:hidden">
                {[
                    { to: '/tailoring', icon: Target, label: 'Resume Tailoring', color: 'text-slate-300 hover:text-white' },
                    { to: '/distribution', icon: Send, label: 'Distribution Hub', color: 'text-slate-300 hover:text-white' },
                    { to: '/cover-letter', icon: FileText, label: 'Cover Letter', color: 'text-slate-300 hover:text-white' },
                ].map(item => (
                    <Link key={item.to} to={item.to}
                        className={`text-sm font-medium transition-colors ${item.color} flex items-center gap-2`}>
                        <item.icon className="w-4 h-4" />
                        {item.label}
                    </Link>
                ))}
            </div>

            {/* Main Builder Area - Resizable */}
            <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
                {/* Editor Panel */}
                <div
                    className="overflow-y-auto bg-white border-r border-gray-200 p-6 shadow-xl z-0 flex-shrink-0 print:hidden"
                    style={{ width: `${editorWidth}%` }}
                >
                    <FormEditor />
                </div>

                {/* Drag Handle */}
                <div
                    className="w-2 bg-gray-200 hover:bg-blue-400 cursor-col-resize transition-colors flex items-center justify-center z-10 print:hidden flex-shrink-0"
                    onMouseDown={handleMouseDown}
                    style={{ backgroundColor: isDragging ? '#3b82f6' : undefined }}
                >
                    <div className="flex flex-col gap-1">
                        <div className="w-0.5 h-1 bg-gray-400 rounded-full" />
                        <div className="w-0.5 h-1 bg-gray-400 rounded-full" />
                        <div className="w-0.5 h-1 bg-gray-400 rounded-full" />
                        <div className="w-0.5 h-1 bg-gray-400 rounded-full" />
                        <div className="w-0.5 h-1 bg-gray-400 rounded-full" />
                    </div>
                </div>

                {/* Preview Panel - uses flex-1 to properly fill remaining space */}
                <div
                    className="bg-gray-100 overflow-y-auto overflow-x-auto flex-1 min-w-0 print:overflow-visible"
                    id="resume-preview-panel"
                >
                    <div className="p-6 flex justify-center print:p-0">
                        <ResumePreview />
                    </div>
                </div>
            </div>

            {/* Print CSS - comprehensive */}
            <style>{`
                @media print {
                    /* Hide everything first */
                    body * {
                        visibility: hidden;
                    }
                    /* Pastikan html dan body memiliki tinggi otomatis dan overflow terlihat agar tidak terpotong (1 halaman) */
                    html, body, #root {
                        height: auto !important;
                        overflow: visible !important;
                    }

                    /* Override kelas utilitas yang bisa memotong konten saat di-print */
                    .h-full, .h-screen, .min-h-full, .overflow-y-auto, .overflow-hidden, .overflow-auto, .flex-1 {
                        height: auto !important;
                        overflow: visible !important;
                    }

                    /* Show only the resume preview */
                    #resume-preview-panel,
                    #resume-preview-panel * {
                        visibility: visible !important;
                    }
                    
                    /* Position the preview to fill the page, menggunakan absolute untuk banyak halaman */
                    #resume-preview-panel {
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100% !important;
                        height: auto !important;
                        min-height: 100vh !important;
                        overflow: visible !important;
                        background: white !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        z-index: 99999 !important;
                    }
                    #resume-preview-panel > div {
                        padding: 0 !important;
                        display: block !important;
                    }
                    /* A4 page setup */
                    @page {
                        size: A4;
                        margin: 0; /* Margin 0 untuk menghilangkan header/footer bawaan browser seperti URL localhost */
                    }
                    ${resumeData.template === 'professional' ? `
                    @page :first {
                        margin-top: 0; 
                    }` : ''}
                    /* The resume paper element */
                    .resume-paper {
                        width: 100% !important;
                        min-height: auto !important;
                        max-width: 100% !important;
                        box-shadow: none !important;
                        transform: none !important;
                        margin: 0 !important;
                        page-break-after: auto;
                        padding-top: 15mm !important; /* Tambahan padding karena margin page 0 */
                        padding-bottom: 15mm !important;
                    }
                    /* Preserve colors */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }

                    /* Memaksa elemen yang panjang (termasuk layout flex) terpotong wajar antar halaman,
                       bukan melompat semua ke halaman mselanjutnya karena tidak muat */
                    div, section, p, li, article, .flex {
                        page-break-inside: auto !important;
                        break-inside: auto !important;
                    }

                    /* Judul tidak boleh terputus atau tertinggal sendirian di ujung halaman */
                    h1, h2, h3, h4, h5, h6 {
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                        page-break-after: avoid !important;
                        break-after: avoid !important;
                    }
                }
            `}</style>
        </div>
    );
};

const Builder = () => (
    <ResumeProvider>
        <BuilderContent />
    </ResumeProvider>
);

export default Builder;