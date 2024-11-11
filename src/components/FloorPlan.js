import React from 'react';
import Desk from './Desk';

function FloorPlan({ floorData, onDeskDrop, onDeskClick }) {
  return (
    <div className="floor-plan" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '16px',
      padding: '20px',
    }}>
      {floorData.map((desk) => (
        <Desk
          key={desk.desk_id}
          id={desk.desk_id}
          employees={desk.employees || []}
          onDrop={onDeskDrop}
          onClick={onDeskClick}
        />
      ))}
    </div>
  );
}

export default FloorPlan; 