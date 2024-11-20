import React, { useState, useEffect } from 'react';
import Floor from './Floor';
import FloorDetail from './FloorDetail';

const getDominantTeamColor = (groups) => {
  if (!groups || groups.length === 0) return '#1a1a1a';
  
  const typeCounts = groups.reduce((acc, group) => {
    acc[group.type] = (acc[group.type] || 0) + 1;
    return acc;
  }, {});

  const dominantType = Object.entries(typeCounts)
    .sort(([,a], [,b]) => b - a)[0][0];

  const GROUP_COLORS = {
    project: 'rgba(255, 205, 210, 0.15)',    // Light red
    department: 'rgba(200, 230, 201, 0.15)', // Light green
    team: 'rgba(227, 242, 253, 0.15)'        // Light blue
  };

  return GROUP_COLORS[dominantType] || '#1a1a1a';
};

function FloorPlan({ floorData, handleFloorDrop, handleFloorClear, onGroupSelect }) {
  const [currentFloorIndex, setCurrentFloorIndex] = useState(0);
  const [selectedFloor, setSelectedFloor] = useState(null);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        const currentFloor = floorData[currentFloorIndex];
        console.log('Enter pressed, showing details for floor:', currentFloor);
        setSelectedFloor(currentFloor);
      } else if (e.key === 'ArrowUp' && currentFloorIndex < floorData.length - 1) {
        setSelectedFloor(null);
        setCurrentFloorIndex(prev => prev + 1);
      } else if (e.key === 'ArrowDown' && currentFloorIndex > 0) {
        setSelectedFloor(null);
        setCurrentFloorIndex(prev => prev - 1);
      } else if (e.key === 'Escape') {
        setSelectedFloor(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentFloorIndex, floorData]);

  const handleCloseDetail = () => {
    setSelectedFloor(null);
  };

  const handleFloorClearWithDetailClose = (floorId) => {
    handleFloorClear(floorId);
    setSelectedFloor(null);
  };

  return (
    <div className="floor-plan-container" style={{
      perspective: '1500px',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: '#f5e6d3',
        fontSize: '1.2em',
        zIndex: 1000
      }}>
        Floor {currentFloorIndex + 1} of 40
      </div>
      
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transformStyle: 'preserve-3d',
        transform: 'scale(0.8)',
        opacity: selectedFloor ? 0.3 : 1,
        pointerEvents: selectedFloor ? 'none' : 'auto'
      }}>
        {floorData.map((floor, index) => {
          const isCurrent = index === currentFloorIndex;
          const relativeIndex = index - currentFloorIndex;
          const verticalOffset = relativeIndex * 30;
          const floorNumber = index + 1;
          const dominantColor = getDominantTeamColor(floor.groups);
          
          return (
            <div
              key={floor.floor_id}
              style={{
                position: 'absolute',
                width: '70%',
                height: '70%',
                transform: `
                  rotateX(60deg) 
                  rotateZ(-45deg)
                  translate3d(0, -50px, ${verticalOffset}px)
                `,
                transition: 'all 0.5s ease-in-out',
                opacity: isCurrent ? 1 : 0.15,
                pointerEvents: isCurrent ? 'auto' : 'none',
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
                zIndex: floorData.length - Math.abs(relativeIndex)
              }}
            >
              <Floor
                id={floor.floor_id}
                floorNumber={floorNumber}
                groups={floor.groups || []}
                collaborationScore={floor.collaborationScore}
                onDrop={handleFloorDrop}
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: dominantColor,
                  border: `2px solid ${isCurrent ? '#444' : '#333'}`,
                  boxShadow: isCurrent ? '0 10px 20px rgba(0,0,0,0.3)' : 'none',
                  transition: 'all 0.5s ease-in-out',
                  cursor: 'pointer'
                }}
                tabIndex={0}
                onClear={handleFloorClearWithDetailClose}
                onShowDetail={handleCloseDetail}
              />
            </div>
          );
        })}
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: '20px',
        width: '100%',
        textAlign: 'center',
        color: '#f5e6d3',
        fontSize: '0.75em'
      }}>
        <div>
          <span style={{ marginRight: '20px', color: '#fff', backgroundColor: 'transparent' }}>⬆️ Use Up Arrow to go up a floor</span>
          <span style={{ color: '#fff', backgroundColor: 'transparent' }}>⬇️ Use Down Arrow to go down a floor</span>
        </div>
        <div style={{ marginTop: '5px', color: '#999' }}>
          {`${floorData.length - currentFloorIndex - 1} floors above, ${currentFloorIndex} floors below`}
        </div>
      </div>

      {selectedFloor && (
        <FloorDetail
          floor={selectedFloor}
          onClose={handleCloseDetail}
          onClear={handleFloorClearWithDetailClose}
          onGroupSelect={onGroupSelect}
        />
      )}
    </div>
  );
}

export default FloorPlan; 