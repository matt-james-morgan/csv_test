import React, { useState } from 'react';

const CompareFloors = ({ floorData, onClose, getCollaborationScore }) => {
  const [selectedFloors, setSelectedFloors] = useState([]);

  console.log(JSON.stringify(floorData, null, 2), "floorData");  

  const handleDrop = (e) => {
    e.preventDefault();
    const floorId = e.dataTransfer.getData('text/plain');
    const floor = floorData.find(f => f.floor_id === parseInt(floorId));
    
    
    if (floor && !selectedFloors.includes(floor) && selectedFloors.length < 2) {
      setSelectedFloors(prev => [...prev, floor]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Prevent default to allow drop
  };

  const handleRemoveFloor = (floorId) => {
    setSelectedFloors(prev => prev.filter(floor => floor.floor_id !== floorId));
  };

  const calculateCollaborationAverage = () => {
    if (selectedFloors.length < 2) return 0;

    const [floor1, floor2] = selectedFloors;
    let totalScore = 0;
    let count = 0;

    floor1.groups.forEach(group1 => {
      floor2.groups.forEach(group2 => {
        const score = calculateGroupCollaborationScore(group1, group2); // Assume this function exists
        console.log(score, "score");
        totalScore += score;
        count++;
      });
    });

    return count > 0 ? (totalScore / count).toFixed(2) : 0; // Return average score
  };

  const calculateGroupCollaborationScore = (group1, group2) => {
    

    const score = getCollaborationScore(group1, group2); // Calculate score between the two groups
    console.log(score, "score2");
    const weight1 = group1.peopleCount;
    const weight2 = group2.peopleCount;

    // Calculate total weighted score
    const totalWeightedScore = (score * weight1 + score * weight2) / (weight1 + weight2);

    return totalWeightedScore; // Return the total weighted score as a single number
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
        <h3>Available Floors</h3>
        {floorData.filter(floor => floor.groups.length > 0).map(floor => (
          <button 
            key={floor.floor_id} 
            draggable 
            onDragStart={(e) => e.dataTransfer.setData('text/plain', floor.floor_id)} 
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

      <div 
        onDrop={handleDrop} 
        onDragOver={handleDragOver} 
        style={{
          border: '2px dashed rgba(245, 230, 211, 0.5)',
          borderRadius: '8px',
          padding: '20px',
          marginTop: '20px',
          minHeight: '100px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(30, 30, 30, 0.8)',
        }}
      >
        <h3>Drop Floors Here for Combined Collaboration Score</h3>
        {selectedFloors.length === 0 && <p>No floors selected for comparison.</p>}
        {selectedFloors.map(floor => (
          <div key={floor.floor_id} style={{ margin: '5px', color: '#f5e6d3' }}>
            <span>Floor {floor.floor_id}</span>
            <button 
              onClick={() => handleRemoveFloor(floor.floor_id)} 
              style={{
                marginLeft: '10px',
                backgroundColor: 'rgba(244, 67, 54, 0.7)',
                border: 'none',
                color: '#fff',
                borderRadius: '4px',
                cursor: 'pointer',
                padding: '5px 10px',
              }}
            >
              Remove
            </button>
          </div>
        ))}
        {selectedFloors.length === 2 && (
          <div style={{ marginTop: '10px', color: '#f5e6d3' }}>
            <h4>Collaboration Average: {calculateCollaborationAverage()}</h4>
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