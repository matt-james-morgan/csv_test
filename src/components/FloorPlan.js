import React, { useState, useEffect } from 'react';
import Floor from './Floor';

function FloorPlan({ floorData, onDeskDrop, onDeskClick }) {
  const [currentFloorIndex, setCurrentFloorIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isVerticalView, setIsVerticalView] = useState(false);

  const FLOOR_OFFSET = 30;

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isFlipping) return;

      if (e.key === 'ArrowUp' && currentFloorIndex < floorData.length - 1) {
        setIsFlipping(true);
        setCurrentFloorIndex(prev => prev + 1);
        setTimeout(() => setIsFlipping(false), 500);
      }
      else if (e.key === 'ArrowDown' && currentFloorIndex > 0) {
        setIsFlipping(true);
        setCurrentFloorIndex(prev => prev - 1);
        setTimeout(() => setIsFlipping(false), 500);
      }
      else if (e.key === 'Enter') {
        setIsVerticalView(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentFloorIndex, floorData.length, isFlipping]);

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
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transformStyle: 'preserve-3d',
        transform: 'scale(0.7)'
      }}>
        {floorData.map((floor, index) => {
          const isCurrent = index === currentFloorIndex;
          const relativeIndex = index - currentFloorIndex;
          const verticalOffset = relativeIndex * FLOOR_OFFSET;
          
          // Calculate transforms based on view mode
          const isometricTransform = `
            rotateX(60deg) 
            rotateZ(-45deg)
            translate3d(0, 0, ${verticalOffset}px)
          `;
          
          const verticalTransform = `
            rotateX(0deg) 
            rotateZ(0deg)
            translate3d(0, 0, 0)
            scale(1.2)
          `;
          
          return (
            <div
              key={floor.floor_id}
              style={{
                position: 'absolute',
                width: '60%',
                height: '60%',
                transform: isCurrent && isVerticalView ? verticalTransform : isometricTransform,
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
                employees={floor.employees || []}
                onDrop={onDeskDrop}
                onClick={onDeskClick}
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: isCurrent ? '#1a1a1a' : '#222',
                  border: `2px solid ${isCurrent ? '#444' : '#333'}`,
                  boxShadow: isCurrent ? '0 10px 20px rgba(0,0,0,0.3)' : 'none',
                  transition: 'all 0.5s ease-in-out'
                }}
              />
            </div>
          );
        })}
      </div>
      
      {/* Floor Navigation UI */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        zIndex: floorData.length + 1
      }}>
        <button
          onClick={() => currentFloorIndex > 0 && setCurrentFloorIndex(prev => prev - 1)}
          disabled={currentFloorIndex === 0 || isVerticalView}
          style={{
            padding: '8px 16px',
            backgroundColor: '#333',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: (currentFloorIndex === 0 || isVerticalView) ? 'not-allowed' : 'pointer',
            opacity: isVerticalView ? 0.5 : 1
          }}
        >
          ↓
        </button>
        <span style={{ color: 'white' }}>
          Floor {currentFloorIndex + 1} of {floorData.length}
          {isVerticalView && ' (Press Enter to return)'}
        </span>
        <button
          onClick={() => currentFloorIndex < floorData.length - 1 && setCurrentFloorIndex(prev => prev - 1)}
          disabled={currentFloorIndex === floorData.length - 1 || isVerticalView}
          style={{
            padding: '8px 16px',
            backgroundColor: '#333',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: (currentFloorIndex === floorData.length - 1 || isVerticalView) ? 'not-allowed' : 'pointer',
            opacity: isVerticalView ? 0.5 : 1
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}

export default FloorPlan; 