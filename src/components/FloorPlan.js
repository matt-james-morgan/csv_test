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

  // Define group type colors with lower opacity for floor backgrounds
  const GROUP_COLORS = {
    project: 'rgba(255, 205, 210, 0.15)',    // Light red
    department: 'rgba(200, 230, 201, 0.15)', // Light green
    team: 'rgba(227, 242, 253, 0.15)'        // Light blue
  };

  return GROUP_COLORS[dominantType] || '#1a1a1a';
};

function FloorPlan({ floorData, handleFloorDrop}) {
  const [currentFloorIndex, setCurrentFloorIndex] = useState(0);
  const [isVerticalView, setIsVerticalView] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);

  console.log('FloorPlan rendering with floorData:', floorData);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        setIsVerticalView(prev => !prev);
        setSelectedFloor(null);
      } else if (e.key === 'ArrowUp' && currentFloorIndex < floorData.length - 1) {
        setIsVerticalView(false);
        setSelectedFloor(null);
        setCurrentFloorIndex(prev => prev + 1);
      } else if (e.key === 'ArrowDown' && currentFloorIndex > 0) {
        setIsVerticalView(false);
        setSelectedFloor(null);
        setCurrentFloorIndex(prev => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentFloorIndex, floorData.length]);

  

  const handleFloorClick = (floor) => {
    console.log('Floor clicked:', floor);
    console.log('Floor employees:', floor.employees);
    setSelectedFloor(floor);
  };

  const handleKeyDown = (event, floor) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setSelectedFloor(floor);
    }
  };

  const handleCloseDetail = () => {
    setSelectedFloor(null);
  };

  return (
    <>
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
            console.log(`in floordata.map ${JSON.stringify(floor.groups)}`);
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
                  transform: isCurrent && isVerticalView 
                    ? `
                      rotateX(0deg) 
                      rotateZ(0deg)
                      translate3d(0, -100px, 0)
                      scale(1.2)
                    ` 
                    : `
                      rotateX(60deg) 
                      rotateZ(-45deg)
                      translate3d(0, -50px, ${verticalOffset}px)
                    `,
                  transition: 'all 0.5s ease-in-out',
                  opacity: isCurrent ? 1 : (isVerticalView ? 0 : 0.15),
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
                  onDrop={handleFloorDrop}
                  onClick={() => handleFloorClick(floor)}
                  isVerticalView={isVerticalView && isCurrent}
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: dominantColor,
                    border: `2px solid ${isCurrent ? '#444' : '#333'}`,
                    boxShadow: isCurrent ? '0 10px 20px rgba(0,0,0,0.3)' : 'none',
                    transition: 'all 0.5s ease-in-out',
                    cursor: 'pointer'
                  }}
                  onKeyDown={(e) => handleKeyDown(e, { ...floor, floor_number: floorNumber })}
                  tabIndex={0}
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
          <div style={{ marginTop: '10px' }}>
            Press Enter to toggle floor view 
          </div>
          <div style={{ marginTop: '5px', color: '#999' }}>
            {`${floorData.length - currentFloorIndex - 1} floors above, ${currentFloorIndex} floors below`}
          </div>
        </div>
      </div>

      {selectedFloor && (
        <FloorDetail
          floor={selectedFloor}
          onClose={handleCloseDetail}
          onGroupClick={(group) => {
            // Handle group click - show group modal
            console.log('Group clicked:', group);
          }}
        />
      )}
    </>
  );
}

export default FloorPlan; 