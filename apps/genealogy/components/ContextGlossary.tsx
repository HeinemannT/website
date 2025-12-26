import React, { useMemo } from 'react';
import { BookA } from 'lucide-react';
import { GlossaryTerm } from '../types';

interface ContextGlossaryProps {
    terms: GlossaryTerm[];
    glossaryHtml?: string;
}

const ContextGlossary: React.FC<ContextGlossaryProps> = ({ terms, glossaryHtml }) => {
    // Optional: Sort terms alphabetically
    const sortedTerms = useMemo(() => {
        return [...terms].sort((a, b) => a.term.localeCompare(b.term));
    }, [terms]);

    return (
        <div className="w-full h-full overflow-auto bg-paper dark:bg-zinc-950 p-6 lg:p-12">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-8 border-b border-stone-200 dark:border-zinc-800 pb-4">
                    <BookA className="text-cinnabar" size={24} />
                    <h2 className="text-2xl font-heading text-ink dark:text-zinc-100">Historical Context & Glossary</h2>
                </div>

                {/* Markdown Narrative Section */}
                {glossaryHtml && (
                    <div className="prose dark:prose-invert max-w-none font-body mb-12 border-b border-stone-200 dark:border-zinc-800 pb-8">
                        <div dangerouslySetInnerHTML={{ __html: glossaryHtml }} />
                    </div>
                )}

                {/* Terms Grid */}
                {(!terms || terms.length === 0) ? (
                    <div className="p-8 text-center text-stone-400 italic">No glossary terms available.</div>
                ) : (
                    <div className="grid gap-6">
                        {sortedTerms.map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm">
                                <div className="flex justify-between items-baseline mb-2">
                                    <h3 className="text-lg font-bold text-ink dark:text-zinc-100 font-serif-tc">
                                        {item.term}
                                        <span className="ml-2 text-cinnabar font-normal text-base">{item.zh}</span>
                                    </h3>
                                </div>
                                <p className="text-stone-600 dark:text-zinc-400 leading-relaxed font-body">
                                    {item.definition}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContextGlossary;
