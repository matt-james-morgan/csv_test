import React from 'react';

const Group = ({ 
  header, 
  peopleCount, 
  avgScore, 
  isHighlighted, 
  isHovered,
  onDelete,
  isZoomedOut,
  type,
  internalTraffic,
  orgTraffic,
  externalTraffic,
  scoresAbove10,
  onGroupClick,
  group   
}) => {
  const getGroupColor = (score) => {
    if (score >= 60) return 'rgba(76, 175, 80, 0.3)';  // Green
    if (score >= 40) return 'rgba(255, 193, 7, 0.3)';  // Yellow
    return 'rgba(244, 67, 54, 0.3)';                   // Red
  };

  return (
    <div
      style={{
        backgroundColor: getGroupColor(avgScore),
        padding: '8px',
        borderRadius: '4px',
        cursor: 'grab',
        position: 'relative',
        width: isZoomedOut ? '90%' : '180px',
        border: isHighlighted ? '2px solid #FFFDD0' : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: isHighlighted ? '0 0 10px rgba(76, 175, 80, 0.5)' : 'none',
        transform: isHighlighted ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.3s ease',
        opacity: isHighlighted ? 1 : 0.8,
      }}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/json', JSON.stringify({
          header,
          peopleCount,
          avgScore,
          type,
          internalTraffic,
          orgTraffic,
          externalTraffic,
          scoresAbove10
        }));
      }}
      onClick={() => onGroupClick(group)}
    >
      <div style={{
        color: '#f5e6d3',
        fontWeight: 'bold',
        marginBottom: '4px',
        fontSize: isZoomedOut ? '0.8em' : '1em'
      }}>
        {header}
      </div>
      {!isZoomedOut && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: '#f5e6d3',
          fontSize: '0.9em',
          opacity: 0.7
        }}>
          <span>People: {peopleCount}</span>
          <span>Score: {avgScore}</span>
        </div>
      )}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            position: 'absolute',
            top: '-1px',
            right: '-1px',
            background: '#444',
            border: 'none',
            color: '#fff',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '12px',
            padding: 0
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default React.memo(Group); 