import React from 'react';

const Group = ({ 
  header, 
  peopleCount, 
  avgScore, 
  collaborationScore, 
  isHighlighted,
  isHovered,
  hoveredGroup,
  onDelete,
  isZoomedOut
}) => {
  const getGroupColor = (score) => {
    if (score >= 60) return 'rgba(76, 175, 80, 0.3)';
    if (score >= 40) return 'rgba(255, 193, 7, 0.3)';
    return 'rgba(244, 67, 54, 0.3)';
  };

  return (
    <div
      style={{
        backgroundColor: getGroupColor(avgScore),
        padding: isZoomedOut ? '8px' : '12px',
        borderRadius: '6px',
        color: '#f5e6d3',
        fontSize: isZoomedOut ? '0.8em' : '0.9em',
        position: 'relative',
        width: isZoomedOut ? '100%' : 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 0.2s ease'
      }}
    >
      <div>
        <div style={{ fontWeight: 'bold' }}>{header}</div>
        <div style={{ opacity: 0.8 }}>
          {peopleCount} people • Score: {collaborationScore}
        </div>
      </div>
      
      {!isZoomedOut && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#f5e6d3',
            cursor: 'pointer',
            opacity: 0.6,
            padding: '4px',
            marginLeft: '8px'
          }}
          onMouseOver={(e) => e.target.style.opacity = 1}
          onMouseOut={(e) => e.target.style.opacity = 0.6}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Group; 