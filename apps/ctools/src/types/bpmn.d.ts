declare module 'bpmn-js/dist/bpmn-modeler.production.min.js' {
    export default class BpmnModeler {
        constructor(options: any);
        importXML(xml: string): Promise<{ warnings: any[] }>;
        saveXML(options: { format: boolean }): Promise<{ xml: string }>;
        saveSVG(): Promise<{ svg: string }>;
        createDiagram(): Promise<void>;
        clear(): void;
        on(event: string, callback: (event: any) => void): void;
        get(module: string): any;
        destroy(): void;
    }
}

declare module 'bpmn-js/dist/assets/diagram-js.css';
declare module 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
