
import React, { useMemo, useState } from 'react';
import { GlossaryTerm } from '../types';
import { Info } from 'lucide-react';

interface SmartTextProps {
    text: string;
    terms: GlossaryTerm[];
    language: 'en' | 'zh';
}

const SmartText: React.FC<SmartTextProps> = ({ text, terms, language }) => {
    // 1. Memoize the Regex to avoid expensive recreation on every render
    // We want to match longest terms first to handle "South Sea" vs "Sea" correctly.
    const { regex, termMap } = useMemo(() => {
        if (!terms || terms.length === 0) {
            return { regex: null, termMap: new Map() };
        }

        // Filter out empty terms
        const validTerms = terms.filter(t =>
            language === 'en' ? t.term && t.term.length > 1 : t.zh && t.zh.length > 0
        );

        // Sort by length descending to prioritize greedy matching (Longest Match Rule)
        validTerms.sort((a, b) => {
            const keyA = language === 'en' ? a.term : a.zh;
            const keyB = language === 'en' ? b.term : b.zh;
            return keyB.length - keyA.length;
        });

        const map = new Map<string, GlossaryTerm>();
        validTerms.forEach(t => {
            const key = language === 'en' ? t.term : t.zh;
            // Store lowercased key for case-insensitive matching in English
            map.set(language === 'en' ? key.toLowerCase() : key, t);
        });

        // Escape regex special characters
        const escapeRegExp = (string: string) => {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };

        const patterns = validTerms.map(t => {
            const key = language === 'en' ? t.term : t.zh;
            return escapeRegExp(key);
        });

        // If English, we use word boundaries \b to avoid matching "cat" in "scatter".
        // If Chinese, no word boundaries.
        const patternString = language === 'en'
            ? `\\b(${patterns.join('|')})\\b`
            : `(${patterns.join('|')})`;

        return {
            regex: new RegExp(patternString, language === 'en' ? 'gi' : 'g'),
            termMap: map
        };
    }, [terms, language]);

    // If no fallback regex or terms, just return text
    if (!regex || !text) {
        return <>{text}</>;
    }

    // 2. Tokenize and Replace
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    // Clone regex for stateful exec loop if needed, but 'exec' works on same instance if global flag set
    regex.lastIndex = 0;

    while ((match = regex.exec(text)) !== null) {
        // Push preceding text
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }

        const matchedStr = match[0];
        const key = language === 'en' ? matchedStr.toLowerCase() : matchedStr;
        const termData = termMap.get(key);

        if (termData) {
            parts.push(
                <GlossaryTooltip key={match.index} term={termData} text={matchedStr} />
            );
        } else {
            // Should ideally not happen if regex and map are synced, but fallback safely
            parts.push(matchedStr);
        }

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return <>{parts}</>;
};

// Internal Tooltip Component
const GlossaryTooltip: React.FC<{ term: GlossaryTerm; text: string }> = ({ term, text }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <span
            className="relative inline-block border-b border-dashed border-cinnabar/60 dark:border-red-400/60 cursor-help group"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onClick={(e) => { e.stopPropagation(); setIsVisible(!isVisible); }} // Mobile tap support
        >
            <span className="text-cinnabar dark:text-red-400 font-medium">{text}</span>

            {/* Tooltip Content */}
            <div className={`
                absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 
                bg-white dark:bg-zinc-800 text-ink dark:text-zinc-100 
                rounded-md shadow-xl border border-stone-200 dark:border-zinc-700
                p-3 z-50 pointer-events-none transition-all duration-200 origin-bottom
                ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
            `}>
                <div className="flex items-baseline justify-between mb-1 border-b border-stone-100 dark:border-zinc-700 pb-1">
                    <span className="font-serif-tc font-bold text-lg">{term.term}</span>
                    <span className="font-serif-tc text-cinnabar text-sm">{term.zh}</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-zinc-400 leading-snug font-body">
                    {term.definition}
                </p>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white dark:border-t-zinc-800"></div>
            </div>
        </span>
    );
};

export default SmartText;
