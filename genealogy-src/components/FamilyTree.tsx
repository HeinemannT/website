import React, { useEffect, useState } from 'react';
import jsyaml from 'js-yaml';
import { Network } from 'lucide-react';

interface FamilyMember {
    id: string;
    name_zh: string;
    name_en: string;
    title?: string;
    generation: number;
    page_ref?: string;
    children?: string[];
}

interface TreeData {
    root_id: string;
    people: FamilyMember[];
}

interface FamilyTreeProps {
    onNavigate: (pageId: string) => void;
    isDarkMode: boolean;
}

const FamilyTree: React.FC<FamilyTreeProps> = ({ onNavigate, isDarkMode }) => {
    const [data, setData] = useState<TreeData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('./family_tree.yaml')
            .then(res => {
                if (!res.ok) throw new Error(`Failed to load family_tree.yaml (${res.status})`);
                return res.text();
            })
            .then(text => {
                const parsed = jsyaml.load(text) as TreeData;
                if (!parsed || !Array.isArray(parsed.people)) {
                    throw new Error("Invalid format: 'people' array missing.");
                }
                setData(parsed);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to load family tree", err);
                setError(err.message || "Could not load family tree data.");
                setIsLoading(false);
            });
    }, []);

    if (isLoading) return <div className="p-8 text-center text-stone-500">Loading Tree...</div>;
    if (error || !data) return <div className="p-8 text-center text-red-500">{error}</div>;

    // Transform flat list to map for easy lookup
    const peopleMap: Map<string, FamilyMember> = new Map(data.people.map((p: FamilyMember) => [p.id, p]));

    // Recursive Tree Renderer
    // Auto-scroll to root on load - Wrapped in timeout for Mobile safety
    useEffect(() => {
        if (!isLoading && data && data.root_id) {
            const timer = setTimeout(() => {
                const rootElement = document.getElementById(`node-${data.root_id}`);
                if (rootElement) {
                    try {
                        rootElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' });
                    } catch (e) {
                        // Fallback for older browsers or test envs
                        console.warn("Scroll failed", e);
                    }
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isLoading, data]);

    const renderNode = (id: string, depth: number = 0) => {
        if (depth > 50) return <div className="text-red-500 font-bold p-2">Max Depth Exceeded</div>; // Crash prevention

        const person = peopleMap.get(id);
        if (!person) return null;

        const hasChildren = person.children && person.children.length > 0;

        return (
            <div key={id} className="flex flex-col items-center">
                {/* Node Card */}
                <div
                    id={`node-${id}`} // ID for scrolling
                    onClick={() => person.page_ref && onNavigate(person.page_ref)}
                    className={`
                        relative p-5 rounded-sm border transition-all duration-300 group
                        ${person.page_ref ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-cinnabar/50 dark:hover:border-red-500/50' : 'cursor-default'}
                        bg-white dark:bg-zinc-900 
                        border-stone-200 dark:border-zinc-800
                        shadow-[0_2px_8px_rgba(0,0,0,0.04)]
                        min-w-[160px] max-w-[200px] text-center z-10
                    `}
                >
                    {/* Generation Badge */}
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-stone-100 dark:bg-zinc-800 text-[9px] uppercase tracking-widest font-bold text-stone-500 dark:text-zinc-500 px-2 py-0.5 rounded-full border border-stone-200 dark:border-zinc-700 shadow-sm z-20">
                        Gen {person.generation}
                    </div>

                    <div className="text-xl font-serif-tc text-ink dark:text-zinc-100 mt-2 mb-1 group-hover:text-cinnabar dark:group-hover:text-red-400 transition-colors">
                        {person.name_zh}
                    </div>
                    <div className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-zinc-500 mb-1">
                        {person.name_en}
                    </div>

                    {person.title && (
                        <div className="border-t border-stone-100 dark:border-zinc-800 mt-2 pt-1">
                            <div className="text-[10px] text-stone-400 dark:text-zinc-500 italic leading-tight font-serif">
                                {person.title}
                            </div>
                        </div>
                    )}
                </div>

                {/* Vertical Line to Children */}
                {hasChildren && (
                    <div className="h-8 w-px bg-stone-300 dark:bg-zinc-700"></div>
                )}

                {/* Children Container */}
                {hasChildren && (
                    <div className="flex flex-nowrap gap-8 relative pt-4">
                        {/* Horizontal Connector Bar moved to CSS logic in renderNode loop */}
                        {person.children!.map((childId, index, arr) => {
                            const isFirst = index === 0;
                            const isLast = index === arr.length - 1;
                            const isOnly = arr.length === 1;

                            return (
                                <div key={childId} className="flex flex-col items-center relative">
                                    {/* Connector Lines Logic */}
                                    {/* Top horizontal line parts */}
                                    {!isOnly && (
                                        <>
                                            {/* Line to Left (if not first) */}
                                            <div className={`absolute top-0 right-1/2 h-px bg-stone-300 dark:bg-zinc-700 ${isFirst ? 'hidden' : 'w-1/2'}`}></div>
                                            {/* Line to Right (if not last) */}
                                            <div className={`absolute top-0 left-1/2 h-px bg-stone-300 dark:bg-zinc-700 ${isLast ? 'hidden' : 'w-1/2'}`}></div>
                                        </>
                                    )}

                                    {/* Vertical line from horizontal bar down to node */}
                                    <div className="h-4 w-px bg-stone-300 dark:bg-zinc-700"></div>

                                    {renderNode(childId, depth + 1)}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full h-full overflow-auto bg-texture-paper p-4 pb-32 md:p-12">
            <div className="min-w-max mx-auto flex flex-col items-center">
                <div className="mb-4 flex items-center gap-2 text-stone-400 dark:text-zinc-500 uppercase tracking-widest text-xs">
                    <Network size={16} />
                    <span>Lineage Graph (WIP)</span>
                </div>
                {renderNode(data.root_id)}
            </div>
        </div>
    );
};

export default FamilyTree;

