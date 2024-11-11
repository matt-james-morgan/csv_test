import React from 'react';
import { useDrag } from 'react-dnd';

function Employee({ id, name }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'employee',
    item: { id, name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="employee"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        padding: '8px',
        backgroundColor: '#4CAF50',
        color: 'white',
        borderRadius: '4px',
      }}
    >
      {name}
    </div>
  );
}

export default Employee; 