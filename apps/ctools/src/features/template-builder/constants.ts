
import {
    LayoutTemplate,
    Type,
    Image,
    FileText,
    List,
    CheckSquare,
    BarChart2,
    PieChart,
    Activity,
    MousePointer2,
    Box,
    Globe,
    GitMerge,
    Disc,
    Target,
    MessageSquare,
    Map
} from 'lucide-vue-next'

export interface PropertyDefinition {
    name: string
    label?: string
    type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'textarea'
    uiType?: 'grid-selector' | 'toggle-group' | 'switch' | 'slider' | 'pill-select' | 'color-compact'
    default?: any
    options?: string[]
    section: 'design' | 'properties'
}

export interface InventoryItem {
    id: string
    label: string
    category: 'Pages' | 'Charts' | 'Tables' | 'Content' | 'Input' | 'Misc'
    type?: 'page' | 'widget'
    icon?: any
    properties: PropertyDefinition[]
}

// --- COMMON PROPERTY GROUPS ---

// Design Props (Visuals + Layout + Tooling)
export const COMMON_DESIGN_PROPS: PropertyDefinition[] = [
    // Header Style
    { name: 'headerStyle', type: 'select', uiType: 'toggle-group', default: 'INSIDE', options: ['INSIDE', 'OUTSIDE', 'NONE'], section: 'design' },
    { name: 'borderStyle', type: 'select', uiType: 'toggle-group', default: 'LINE', options: ['LINE', 'NONE'], section: 'design' },
    { name: 'headerColor', type: 'color', uiType: 'color-compact', section: 'design' },
    { name: 'fontColor', type: 'color', uiType: 'color-compact', section: 'design' },
    { name: 'shadow', type: 'boolean', uiType: 'switch', default: false, section: 'design' },
    { name: 'transparency', label: 'Transparency (%)', type: 'number', uiType: 'slider', default: 0, section: 'design' },

    // Layout / Dimensions
    { name: 'columnsLargeScreen', label: 'Width', type: 'number', uiType: 'grid-selector', default: 6, section: 'design' },
    { name: 'columnsMediumScreen', type: 'number', default: 6, section: 'design' },
    { name: 'columnsSmallScreen', type: 'number', default: 6, section: 'design' },
    { name: 'visibility', type: 'select', uiType: 'pill-select', default: 'VISIBLE', options: ['VISIBLE', 'NOVISIBLE', 'ADMINVISIBLEONLY'], section: 'design' },
    { name: 'shownOnLargeDisplay', type: 'boolean', uiType: 'switch', default: true, section: 'design' },
    { name: 'shownOnMediumDisplay', type: 'boolean', uiType: 'switch', default: true, section: 'design' },
    { name: 'shownOnSmallDisplay', type: 'boolean', uiType: 'switch', default: true, section: 'design' },

    // Tooling (As requested in Design)
    { name: 'showToolMenu', type: 'boolean', default: true, section: 'design' },
    { name: 'disableSearch', type: 'boolean', default: false, section: 'design' },
    { name: 'showActivityLog', type: 'boolean', default: true, section: 'design' }
]

// Access Control Props (Properties Section)
export const COMMON_ACL_PROPS: PropertyDefinition[] = [
    { name: 'inheritPermissions', type: 'boolean', default: true, section: 'properties' },
    { name: 'ownership', type: 'text', default: 'list()', section: 'properties' },
    { name: 'readAccessors', type: 'text', default: 'list()', section: 'properties' },
    { name: 'addAccessors', type: 'text', default: 'list()', section: 'properties' },
    { name: 'writeAccessors', type: 'text', default: 'list()', section: 'properties' },
    { name: 'deleteAccessors', type: 'text', default: 'list()', section: 'properties' }
]

// Axis & Chart Logic Props (Properties Section)
export const COMMON_AXIS_PROPS: PropertyDefinition[] = [
    { name: 'autoRange', type: 'boolean', default: true, section: 'properties' },
    { name: 'autoRangeIncludesZero', type: 'boolean', default: false, section: 'properties' },
    { name: 'upperRange', type: 'text', default: '100.0', section: 'properties' },
    { name: 'lowerRange', type: 'text', default: '0.0', section: 'properties' },
    { name: 'numberAxisLabel', type: 'text', default: '', section: 'properties' },
    { name: 'categoryAxisLabel', type: 'text', default: '', section: 'properties' },
    { name: 'autoTickInterval', type: 'boolean', default: true, section: 'properties' },
    { name: 'tickInterval', type: 'text', default: '10.0', section: 'properties' },
    { name: 'reversedDirection', type: 'boolean', default: false, section: 'properties' },
    { name: 'catReversedDirection', type: 'boolean', default: false, section: 'properties' },
    { name: 'decimalPlaces', type: 'number', default: 2, section: 'properties' },
    { name: 'maxPadding', type: 'text', default: '0.01', section: 'properties' },
    { name: 'minPadding', type: 'text', default: '0.01', section: 'properties' }
]

export const INVENTORY: InventoryItem[] = [
    // --- PAGES ---
    {
        id: 'Scorecard',
        label: 'Scorecard',
        category: 'Pages',
        type: 'page',
        icon: LayoutTemplate,
        properties: [
            { name: 'statusAlgorithm', type: 'select', default: 'AVERAGESTATUS', options: ['AVERAGESTATUS', 'WORSTSTATUS', 'BESTSTATUS'], section: 'properties' },
            { name: 'statusType', type: 'text', default: 't._defaulttype', section: 'properties' },
            { name: 'iconName', type: 'text', default: 'SCORECARD', section: 'properties' },
            { name: 'tableIcon', type: 'text', default: 'TABLE_ICON_SPEEDO', section: 'properties' },
            { name: 'showProcessMenuInHeader', type: 'boolean', default: true, section: 'properties' },
            { name: 'addingSubPagesAllowed', type: 'boolean', default: true, section: 'properties' },
            { name: 'showTabs', type: 'boolean', default: true, section: 'properties' },
            { name: 'view', type: 'text', default: 't.Default_View', section: 'properties' },
            ...COMMON_ACL_PROPS
        ]
    },
    {
        id: 'ModelPage',
        label: 'Model Page',
        category: 'Pages',
        type: 'page',
        icon: Box,
        properties: [
            { name: 'iconName', type: 'text', default: 'MODELPAGE', section: 'properties' },
            { name: 'showProcessMenuInHeader', type: 'boolean', default: true, section: 'properties' },
            { name: 'showTabs', type: 'boolean', default: true, section: 'properties' }
        ]
    },
    {
        id: 'EnterpriseTemplate',
        label: 'Enterprise Template',
        category: 'Pages',
        type: 'page',
        icon: LayoutTemplate,
        properties: [
            { name: 'card', type: 'text', default: '', section: 'properties' },
            { name: 'role', type: 'text', default: '', section: 'properties' }
        ]
    },

    // --- CHARTS ---
    {
        id: 'StandardChart',
        label: 'Standard Chart',
        category: 'Charts',
        icon: BarChart2,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_AXIS_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'chartLabel', type: 'text', section: 'properties' },
            { name: 'autoSize', type: 'boolean', default: true, section: 'properties' },
            { name: 'chartHeight', type: 'number', default: 470, section: 'properties' },
            { name: 'sortOrder', type: 'select', default: 'NONE', options: ['NONE', 'ASC', 'DESC'], section: 'properties' },
            { name: 'plotBackground', type: 'text', default: 't.trans', section: 'properties' },
            { name: 'colorTheme', type: 'text', default: 't.Theme1', section: 'properties' },
            { name: 'stacked', type: 'boolean', default: false, section: 'properties' },
            { name: 'spline', type: 'boolean', default: false, section: 'properties' },
            { name: 'lineThickness', type: 'text', default: '1.0', section: 'properties' },
            { name: 'lineStyle', type: 'select', default: 'MARKED', options: ['MARKED', 'SOLID', 'DASHED', 'NONE'], section: 'properties' },
            { name: 'vertical', type: 'boolean', default: true, section: 'properties' },
            { name: 'numberAxisEnabled', type: 'boolean', default: true, section: 'properties' },
            { name: 'categoryAxisEnabled', type: 'boolean', default: true, section: 'properties' },
            { name: 'switchAxis', type: 'boolean', default: false, section: 'properties' },
            { name: 'legendFontSize', type: 'number', default: 12, section: 'properties' },
            { name: 'periodFormat', type: 'text', default: 'SHORT', section: 'properties' },
            { name: 'futures', type: 'text', default: 'list()', section: 'properties' },
            { name: 'includes', type: 'text', default: 'list()', section: 'properties' },
            { name: 'twinAxis', type: 'boolean', default: false, section: 'properties' },
            { name: 'autoAxis', type: 'boolean', default: false, section: 'properties' },
            { name: 'numberOfLines', type: 'text', default: '0', section: 'properties' }
        ]
    },
    {
        id: 'BarChart',
        label: 'Bar Chart',
        category: 'Charts',
        icon: BarChart2,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_AXIS_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'expression', type: 'text', section: 'properties' },
            { name: 'chartLabel', type: 'text', section: 'properties' },
            { name: 'chartHeight', type: 'number', default: 470, section: 'properties' },
            { name: 'stacked', type: 'boolean', default: false, section: 'properties' },
            { name: 'percentages', type: 'boolean', default: false, section: 'properties' },
            { name: '3d', type: 'boolean', default: false, section: 'properties' },
            { name: 'alpha', type: 'text', default: '15.0', section: 'properties' },
            { name: 'beta', type: 'text', default: '15.0', section: 'properties' },
            { name: 'depth', type: 'text', default: '50.0', section: 'properties' },
            { name: 'legendOnCategory', type: 'boolean', default: false, section: 'properties' }
        ]
    },
    {
        id: 'LineChart',
        label: 'Line Chart',
        category: 'Charts',
        icon: Activity,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_AXIS_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'expression', type: 'text', section: 'properties' },
            { name: 'chartLabel', type: 'text', section: 'properties' },
            { name: 'chartHeight', type: 'number', default: 470, section: 'properties' },
            { name: 'spline', type: 'boolean', default: false, section: 'properties' },
            { name: 'lineThickness', type: 'text', default: '1.0', section: 'properties' },
            { name: 'lineStyle', type: 'select', default: 'MARKED', options: ['MARKED', 'SOLID', 'DASHED'], section: 'properties' }
        ]
    },
    {
        id: 'BarLineChart',
        label: 'Bar-Line Chart',
        category: 'Charts',
        icon: BarChart2,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_AXIS_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'expression', type: 'text', section: 'properties' },
            { name: 'chartLabel', type: 'text', section: 'properties' },
            { name: 'chartHeight', type: 'number', default: 470, section: 'properties' },
            { name: 'stacked', type: 'boolean', default: false, section: 'properties' },
            { name: 'spline', type: 'boolean', default: false, section: 'properties' },
            { name: 'lineThickness', type: 'text', default: '1.0', section: 'properties' },
            { name: 'lineStyle', type: 'select', default: 'MARKED', options: ['MARKED', 'SOLID', 'DASHED'], section: 'properties' },
            { name: 'useBars', type: 'boolean', default: false, section: 'properties' }
        ]
    },
    {
        id: 'AreaChart',
        label: 'Area Chart',
        category: 'Charts',
        icon: Activity,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_AXIS_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'expression', type: 'text', section: 'properties' },
            { name: 'chartLabel', type: 'text', section: 'properties' },
            { name: 'chartHeight', type: 'number', default: 470, section: 'properties' },
            { name: 'stacked', type: 'boolean', default: false, section: 'properties' },
            { name: 'spline', type: 'boolean', default: false, section: 'properties' }
        ]
    },
    {
        id: 'PieChart',
        label: 'Pie Chart',
        category: 'Charts',
        icon: PieChart,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'expression', type: 'text', section: 'properties' },
            { name: 'chartLabel', type: 'text', section: 'properties' },
            { name: 'chartHeight', type: 'number', default: 470, section: 'properties' },
            { name: 'ring', type: 'boolean', default: false, section: 'properties' },
            { name: 'showPieLabel', type: 'boolean', default: false, section: 'properties' },
            { name: 'numberPiePerRow', type: 'number', default: 2, section: 'properties' },
            { name: 'ignoreZeroValues', type: 'boolean', default: true, section: 'properties' },
            { name: 'legendBackground', type: 'text', default: 't.trans', section: 'properties' },
            { name: 'tooltipType', type: 'text', default: 'DEFAULT', section: 'properties' }
        ]
    },
    {
        id: 'RiskChart',
        label: 'Risk Chart',
        category: 'Charts',
        icon: Activity,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'expression', type: 'text', section: 'properties' },
            { name: 'chartHeight', type: 'number', default: 470, section: 'properties' },
            { name: 'autoSize', type: 'boolean', default: false, section: 'properties' },
            { name: 'riskSettings', type: 'text', default: 't._riskSettings', section: 'properties' },
            { name: 'factorType', type: 'select', default: 'DYNAMIC', options: ['DYNAMIC', 'STATIC'], section: 'properties' },
            { name: 'aggregated', type: 'boolean', default: false, section: 'properties' },
            { name: 'centered', type: 'boolean', default: false, section: 'properties' },
            { name: 'showTooltip', type: 'boolean', default: true, section: 'properties' },
            { name: 'probabilityFrom', type: 'text', default: 'calculatedProbability', section: 'properties' },
            { name: 'consequenceFrom', type: 'text', default: 'calculatedConsequence', section: 'properties' },
            { name: 'probabilityLabel', type: 'text', section: 'properties' },
            { name: 'consequenceLabel', type: 'text', section: 'properties' }
        ]
    },
    {
        id: 'RiskRadarChart',
        label: 'Risk Radar Chart',
        category: 'Charts',
        icon: Target,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'expression', type: 'text', section: 'properties' },
            { name: 'riskRadarStyle', type: 'text', default: 'HALF', section: 'properties' },
            { name: 'legendLocation', type: 'text', default: 'NORTHWEST', section: 'properties' },
            { name: 'radarSize', type: 'text', default: '800', section: 'properties' }
        ]
    },
    {
        id: 'GanttChart',
        label: 'Gantt Chart',
        category: 'Charts',
        icon: Activity,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'expression', type: 'text', section: 'properties' },
            { name: 'chartHeight', type: 'number', default: 470, section: 'properties' },
            { name: 'hiddenTodayLine', type: 'boolean', default: true, section: 'properties' },
            { name: 'hiddenProgress', type: 'boolean', default: true, section: 'properties' },
            { name: 'showChildTasks', type: 'boolean', default: true, section: 'properties' },
            { name: 'startDateMap', type: 'text', default: 'startDate', section: 'properties' },
            { name: 'endDateMap', type: 'text', default: 'endDate', section: 'properties' },
            { name: 'taskColor', type: 'text', default: 't.task_color', section: 'properties' },
            { name: 'initiativeColor', type: 'text', default: 't.initiative_color', section: 'properties' },
            { name: 'milestoneColor', type: 'text', default: 't.milestone_color', section: 'properties' },
            { name: 'progressMap', type: 'text', default: 'computedProgress', section: 'properties' }
        ]
    },
    {
        id: 'RadarChart',
        label: 'Radar Chart',
        category: 'Charts',
        icon: Activity,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'expression', type: 'text', section: 'properties' },
            { name: 'chartHeight', type: 'number', default: 470, section: 'properties' },
            { name: 'webFilled', type: 'boolean', default: false, section: 'properties' }
        ]
    },
    {
        id: 'WaterfallChart',
        label: 'Waterfall Chart',
        category: 'Charts',
        icon: BarChart2,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            ...COMMON_AXIS_PROPS,
            { name: 'expression', type: 'text', section: 'properties' },
            { name: 'chartHeight', type: 'number', default: 470, section: 'properties' },
            { name: 'startValue', type: 'boolean', default: false, section: 'properties' },
            { name: 'totalSum', type: 'boolean', default: false, section: 'properties' },
            { name: 'intermediateSum', type: 'boolean', default: false, section: 'properties' },
            { name: 'positiveColor', type: 'text', default: 't.df3', section: 'properties' },
            { name: 'negativeColor', type: 'text', default: 't.df2', section: 'properties' }
        ]
    },
    {
        id: 'PolarChart',
        label: 'Polar Chart',
        category: 'Charts',
        icon: Disc,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'expression', type: 'text', section: 'properties' },
            { name: 'chartHeight', type: 'number', default: 470, section: 'properties' },
            { name: 'webFilled', type: 'boolean', default: false, section: 'properties' }
        ]
    },
    {
        id: 'BubbleChart',
        label: 'Bubble Chart',
        category: 'Charts',
        icon: Disc,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_AXIS_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'expression', type: 'text', section: 'properties' },
            { name: 'chartHeight', type: 'number', default: 470, section: 'properties' },
            { name: 'XMapper', type: 'text', section: 'properties' },
            { name: 'YMapper', type: 'text', section: 'properties' },
            { name: 'ZMapper', type: 'text', section: 'properties' }
        ]
    },
    {
        id: 'BowtieDiagram',
        label: 'Bowtie Diagram',
        category: 'Charts',
        icon: GitMerge,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'leftExpression', type: 'text', section: 'properties' },
            { name: 'middleExpression', type: 'text', section: 'properties' },
            { name: 'rightExpression', type: 'text', section: 'properties' },
            { name: 'height', type: 'number', default: 1, section: 'properties' }
        ]
    },

    // --- TABLES ---
    {
        id: 'FilteredList',
        label: 'Filtered List',
        category: 'Tables',
        icon: List,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'conditionGroupList', type: 'text', default: 'filter(Kpi, *object)', section: 'properties' },
            { name: 'showYSum', type: 'boolean', default: false, section: 'properties' },
            { name: 'showXSum', type: 'boolean', default: false, section: 'properties' },
            { name: 'rowPerPage', type: 'number', default: 100, section: 'properties' },
            { name: 'paginable', type: 'boolean', default: false, section: 'properties' },
            { name: 'tableServerSideFilters', type: 'boolean', default: true, section: 'properties' },
            { name: 'advancedFiltersEnabled', type: 'boolean', default: false, section: 'properties' }
        ]
    },
    {
        id: 'ExtendedTable',
        label: 'Extended Table',
        category: 'Tables',
        icon: List,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'expression', type: 'text', section: 'properties' },
            { name: 'enableTableMode', type: 'boolean', default: true, section: 'properties' },
            { name: 'enableCardGridMode', type: 'boolean', default: false, section: 'properties' },
            { name: 'rowPerPage', type: 'number', default: 100, section: 'properties' },
            { name: 'paginable', type: 'boolean', default: false, section: 'properties' }
        ]
    },
    {
        id: 'ActionPlanTable',
        label: 'Initiative Table',
        category: 'Tables',
        icon: CheckSquare,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'statusAlgorithm', type: 'select', default: 'AVERAGESTATUS', options: ['AVERAGESTATUS'], section: 'properties' },
            { name: 'includeSubElements', type: 'boolean', default: false, section: 'properties' },
            { name: 'conditionGroupList', type: 'text', default: 'filter(ActionPlan, *object)', section: 'properties' }
        ]
    },
    {
        id: 'TaskList',
        label: 'Task List',
        category: 'Tables',
        icon: CheckSquare,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'conditionGroupList', type: 'text', default: 'filter(Task, *object)', section: 'properties' },
            { name: 'progressAlgorithm', type: 'text', default: 'WEIGHTED_AVERAGE', section: 'properties' },
            { name: 'rowPerPage', type: 'number', default: 100, section: 'properties' }
        ]
    },
    {
        id: 'CheckList',
        label: 'Check List',
        category: 'Tables',
        icon: CheckSquare,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'conditionGroupList', type: 'text', default: 'filter(Check, *object)', section: 'properties' },
            { name: 'statusAlgorithm', type: 'text', default: 'AVERAGESTATUS', section: 'properties' }
        ]
    },
    {
        id: 'PolicyAssetList',
        label: 'Policy Asset List',
        category: 'Tables',
        icon: List,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'conditionGroupList', type: 'text', default: 'filter(Policy, *object)', section: 'properties' },
            { name: 'statusAlgorithm', type: 'text', default: 'AVERAGESTATUS', section: 'properties' }
        ]
    },
    {
        id: 'AttachmentList',
        label: 'Attachment List',
        category: 'Tables',
        icon: List,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'conditionGroupList', type: 'text', default: 'filter(Attachment, *object)', section: 'properties' },
            { name: 'from', type: 'text', default: '-10y', section: 'properties' },
            { name: 'to', type: 'text', default: '+10y', section: 'properties' }
        ]
    },
    {
        id: 'ReportsList',
        label: 'Reports List',
        category: 'Tables',
        icon: List,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS
        ]
    },

    // --- INPUT ---
    {
        id: 'CreateObjectView',
        label: 'Create Object',
        category: 'Input',
        icon: Box,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'objectType', type: 'text', section: 'properties' },
            { name: 'createMode', type: 'text', default: 'ADD', section: 'properties' },
            { name: 'parentDestinationExpression', type: 'text', section: 'properties' },
            { name: 'editExpression', type: 'text', default: 'this.object', section: 'properties' },
            { name: 'initExpression', type: 'text', section: 'properties' },
            { name: 'afterExpression', type: 'text', section: 'properties' }
        ]
    },
    {
        id: 'InputView',
        label: 'Input View',
        category: 'Input',
        icon: Box,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'inputSet', type: 'text', section: 'properties' },
            { name: 'persistence', type: 'select', default: 'SESSION', options: ['SESSION', 'DATABASE'], section: 'properties' }
        ]
    },
    {
        id: 'LocalComments',
        label: 'Comment List',
        category: 'Input',
        icon: MessageSquare,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'pageSize', type: 'number', default: 10, section: 'properties' },
            { name: 'inputBoxSize', type: 'select', default: 'MEDIUM', options: ['SMALL', 'MEDIUM', 'LARGE'], section: 'properties' },
            { name: 'enableSorting', type: 'boolean', default: true, section: 'properties' },
            { name: 'inlineEditing', type: 'boolean', default: true, section: 'properties' }
        ]
    },
    {
        id: 'ActionButton',
        label: 'Action Button',
        category: 'Input',
        icon: MousePointer2,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'buttonText', type: 'text', section: 'properties' },
            { name: 'actionType', type: 'select', default: 'ACTION', options: ['ACTION', 'LINK'], section: 'properties' },
            { name: 'buttonBackgroundColor', type: 'color', section: 'properties' },
            { name: 'buttonFontColor', type: 'color', section: 'properties' },
            { name: 'confirmButtonText', type: 'text', default: 'Confirm', section: 'properties' },
            { name: 'cancelButtonText', type: 'text', default: 'Cancel', section: 'properties' },
            { name: 'warningMessage', type: 'text', section: 'properties' },
            { name: 'editExpression', type: 'text', default: 'this.object', section: 'properties' },
            { name: 'expression', type: 'text', default: 'this.object', section: 'properties' },
            { name: 'initExpression', type: 'text', section: 'properties' },
            { name: 'afterExpression', type: 'text', section: 'properties' }
        ]
    },

    // --- CONTENT (Misc) ---
    {
        id: 'TextElement',
        label: 'Text',
        category: 'Misc',
        icon: Type,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'text', type: 'text', section: 'properties' },
            { name: 'longText', type: 'text', section: 'properties' }
        ]
    },
    {
        id: 'ImageView',
        label: 'Image',
        category: 'Misc',
        icon: Image,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'imageViewType', type: 'select', default: 'IMAGEFILE', options: ['IMAGEFILE', 'URL'], section: 'properties' },
            { name: 'imageFile', type: 'text', section: 'properties' },
            { name: 'scaleToFit', type: 'boolean', default: false, section: 'properties' }
        ]
    },
    {
        id: 'PdfView',
        label: 'PDF View',
        category: 'Misc',
        icon: FileText,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'fileOrReport', type: 'text', section: 'properties' },
            { name: 'height', type: 'number', default: 842, section: 'properties' }
        ]
    },
    {
        id: 'URLView',
        label: 'URL View',
        category: 'Misc',
        icon: Globe,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'loadURI', type: 'text', section: 'properties' },
            { name: 'height', type: 'number', default: 842, section: 'properties' }
        ]
    },
    {
        id: 'LinkMap',
        label: 'Link Map',
        category: 'Misc',
        icon: Map,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'imageFile', type: 'text', section: 'properties' },
            { name: 'gridSize', type: 'number', default: 100, section: 'properties' }
        ]
    },
    {
        id: 'DescriptionView',
        label: 'Description View',
        category: 'Misc',
        icon: FileText,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'viewTypes', type: 'text', default: 'list()', section: 'properties' }
        ]
    },
    {
        id: 'WidgetReference',
        label: 'Widget Reference',
        category: 'Misc',
        icon: Box,
        properties: [
            ...COMMON_DESIGN_PROPS,
            ...COMMON_ACL_PROPS,
            { name: 'contextExpression', type: 'text', section: 'properties' },
            { name: 'expression', type: 'text', section: 'properties' }
        ]
    },
    {
        id: 'Spacer',
        label: 'Spacer',
        category: 'Misc',
        icon: Box,
        properties: [
            { name: 'height', type: 'number', default: 50, section: 'design' }
        ]
    }
]
