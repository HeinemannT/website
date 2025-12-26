import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Sidebar } from './components/sidebar/Sidebar';
import { Inspector } from './components/inspector/Inspector';
import { FlowArea } from './components/FlowArea';

export default function App() {
    return (
        <div className="flex h-screen w-screen overflow-hidden text-[#161616] bg-[#f4f4f4]">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full relative z-10">
                <ReactFlowProvider>
                    <FlowArea />
                </ReactFlowProvider>
            </div>
            <Inspector />
        </div>
    );
}