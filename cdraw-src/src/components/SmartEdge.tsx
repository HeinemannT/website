import React from 'react';
import { getSmoothStepPath, EdgeProps } from 'reactflow';
import { EdgeData } from '../types';

export default function SmartEdge(props: EdgeProps) {
  const { 
      id, 
      sourceX, 
      sourceY, 
      targetX, 
      targetY, 
      sourcePosition, 
      targetPosition, 
      style, 
      markerEnd, 
      label, 
      selected, 
      data 
  } = props;
  
  // Use React Flow's built-in path generation for industrial orthogonal lines
  const [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 0, // Hard corners for industrial look
      offset: 20,
  });

  const baseColor = selected ? '#0f62fe' : (style?.stroke || '#64748b');
  
  const edgeData = data as EdgeData;
  const visualLabel = (edgeData?.label && edgeData.label.trim().length > 0) ? edgeData.label : null;
  const cardinalityLabel = label || '1:N';
  
  // Composite Label Logic
  const visualLabelWidth = visualLabel ? visualLabel.length * 7 : 0;
  const totalWidth = 35 + (visualLabel ? visualLabelWidth + 10 : 0);
  const rectX = -(totalWidth / 2);

  return (
    <>
      {/* Hit Area for easier selection */}
      <path
        id={`${id}_hit`}
        d={edgePath}
        style={{
            strokeWidth: 20,
            stroke: 'transparent',
            fill: 'none',
            cursor: 'pointer'
        }}
      />
      
      {/* Visible Path */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={{
            ...style,
            fill: 'none',
            strokeWidth: selected ? 2 : 1.5,
            stroke: baseColor
        }}
      />
      
      {/* Label Group */}
      <g transform={`translate(${labelX}, ${labelY})`}>
          <rect 
            x={rectX} 
            y="-10" 
            width={totalWidth} 
            height="20" 
            fill="#f4f4f4" 
            stroke={baseColor}
            strokeWidth="1"
            rx="2" 
          />
          
          {visualLabel && (
             <line 
                x1={rectX + 35} 
                y1="-10" 
                x2={rectX + 35} 
                y2="10" 
                stroke={baseColor} 
                strokeWidth="1" 
             />
          )}

          <text 
            className="nopan"
            x={rectX + 17.5}
            y="1"
            style={{ fontSize: 10, fill: baseColor, fontFamily: 'monospace', fontWeight: 800, pointerEvents: 'none' }} 
            textAnchor="middle" 
            dominantBaseline="middle"
          >
              {cardinalityLabel}
          </text>

          {visualLabel && (
              <text 
                className="nopan"
                x={rectX + 35 + (visualLabelWidth / 2) + 5}
                y="1"
                style={{ fontSize: 10, fill: '#475569', fontFamily: 'monospace', fontWeight: 500, pointerEvents: 'none' }} 
                textAnchor="middle" 
                dominantBaseline="middle"
              >
                  {visualLabel}
              </text>
          )}
      </g>
    </>
  );
}