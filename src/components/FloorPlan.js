import React, { useState, useEffect } from 'react';
import Floor from './Floor';
import DeskView from './DeskView';


const getDominantTeamColor = (employees) => {
  if (!employees || employees.length === 0) return '#1a1a1a';
  
  const teamCounts = employees.reduce((acc, emp) => {
    acc[emp.team] = (acc[emp.team] || 0) + 1;
    return acc;
  }, {});

  const dominantTeam = Object.entries(teamCounts)
    .sort(([,a], [,b]) => b - a)[0][0];

  // Define team colors with lower opacity for floor backgrounds
  const TEAM_COLORS = {
    marketing: 'rgba(255, 205, 210, 0.15)',  // Light red
    sales: 'rgba(200, 230, 201, 0.15)',      // Light green
    development: 'rgba(227, 242, 253, 0.15)'  // Light blue
  };

  return TEAM_COLORS[dominantTeam] || '#1a1a1a';
};

function FloorPlan({ floorData, onDeskDrop, onDeskClick }) {
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

  const handleDeskDrop = (employee, floorId) => {
    console.log('Before drop - Employee:', employee);
    
    // Find the floor and its current employees
    const floor = floorData.find(f => f.floor_id === floorId);
    const currentEmployees = floor?.employees || [];
    
    // Calculate next available desk number
    const nextDesk = currentEmployees.length + 1;
    
    // Create employee object with desk number
    const employeeWithDesk = {
      ...employee,
      desk: nextDesk,
      floor: floorId
    };

    console.log('After assignment - Employee with desk:', employeeWithDesk);
    onDeskDrop(employeeWithDesk, floorId);
  };

  const handleFloorClick = (floor) => {
    console.log('Floor clicked:', floor);
    console.log('Floor employees:', floor.employees);
    setSelectedFloor(floor);
  };

  const closeDeskView = () => {
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
      
      {selectedFloor && (
        <DeskView
          floorName={`Floor ${selectedFloor.floor_id}`}
          employees={selectedFloor.employees || []}
          onClose={closeDeskView}
        />
      )}
      
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
          console.log(`in floordata.map ${JSON.stringify(floor.employees)}`);
          const isCurrent = index === currentFloorIndex;
          const relativeIndex = index - currentFloorIndex;
          const verticalOffset = relativeIndex * 30;
          const floorNumber = index + 1;
          const dominantColor = getDominantTeamColor(floor.employees);
          
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
                employees={floor.employees || []}
                onDrop={handleDeskDrop}
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
          Press Enter to toggle floor view or click a floor to see desk assignments
        </div>
        <div style={{ marginTop: '5px', color: '#999' }}>
          {`${floorData.length - currentFloorIndex - 1} floors above, ${currentFloorIndex} floors below`}
        </div>
      </div>
    </div>
  );
}

export default FloorPlan; 