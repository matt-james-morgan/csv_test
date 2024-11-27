import React, { useState } from 'react';

const CompareFloors = ({ floorData, onClose }) => {
  const [firstFloor, setFirstFloor] = useState(null);
  const [secondFloor, setSecondFloor] = useState(null);

  const handleSelectFloor = (floor, isFirst) => {
    if (isFirst) {
      setFirstFloor(floor);
    } else {
      setSecondFloor(floor);
    }
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#1a1a1a',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      color: '#f5e6d3',
      width: '100%',
      margin: '0 auto',
    }}>
      <h2>Compare Floors</h2>
      <div>
        <h3>Select First Floor</h3>
        {floorData.map(floor => (
          <button 
            key={floor.floor_id} 
            onClick={() => handleSelectFloor(floor, true)} 
            style={{
              margin: '5px',
              padding: '10px 15px',
              backgroundColor: 'rgba(245, 230, 211, 0.1)',
              border: 'none',
              color: '#f5e6d3',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(245, 230, 211, 0.2)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(245, 230, 211, 0.1)'}
          >
            Floor {floor.floor_id}
          </button>
        ))}
      </div>
      <div>
        <h3>Select Second Floor</h3>
        {floorData.map(floor => (
          <button 
            key={floor.floor_id} 
            onClick={() => handleSelectFloor(floor, false)} 
            style={{
              margin: '5px',
              padding: '10px 15px',
              backgroundColor: 'rgba(245, 230, 211, 0.1)',
              border: 'none',
              color: '#f5e6d3',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(245, 230, 211, 0.2)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(245, 230, 211, 0.1)'}
          >
            Floor {floor.floor_id}
          </button>
        ))}
      </div>
      <div>
        {firstFloor && secondFloor && (
          <div>
            <h3>Comparison</h3>
            <h4>Floor {firstFloor.floor_id} Groups:</h4>
            <ul>
              {firstFloor.groups.map(group => (
                <li key={group.header}>{group.header}</li>
              ))}
            </ul>
            <h4>Floor {secondFloor.floor_id} Groups:</h4>
            <ul>
              {secondFloor.groups.map(group => (
                <li key={group.header}>{group.header}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button 
        onClick={onClose} 
        style={{ 
          marginTop: '20px', 
          padding: '10px 15px', 
          backgroundColor: 'rgba(245, 230, 211, 0.1)', 
          border: 'none', 
          color: '#f5e6d3', 
          borderRadius: '6px', 
          cursor: 'pointer', 
          transition: 'background-color 0.2s' 
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(245, 230, 211, 0.2)'}
        onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(245, 230, 211, 0.1)'}
      >
        Close
      </button>
    </div>
  );
};

export default CompareFloors; 