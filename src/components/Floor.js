import React, { useState } from 'react';
import GroupModal from './GroupModal';

function Floor({ 
  id, 
  floorNumber, 
  groups = [], 
  onDrop, 
  style, 
  onKeyDown,
  tabIndex 
}) {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const handleDrop = (e) => {
    e.preventDefault();
    if (groups.length >= 2) {
      console.log('Floor is at maximum capacity');
      return;
    }
    
    try {
      const groupData = e.dataTransfer.getData('application/json');
      if (!groupData) {
        console.error('No group data found in drop event');
        return;
      }

      const group = JSON.parse(groupData);
      onDrop(group, id);
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const handleDragOver = (e) => {
    if (groups.length < 2) {
      e.preventDefault();
    }
  };

  const getGroupColor = (score) => {
    if (score >= 60) return 'rgba(76, 175, 80, 0.3)';
    if (score >= 40) return 'rgba(255, 193, 7, 0.3)';
    return 'rgba(244, 67, 54, 0.3)';
  };

  return (
    <>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onKeyDown={onKeyDown}
        tabIndex={tabIndex}
        style={{
          padding: '20px',
          borderRadius: '8px',
          position: 'relative',
          cursor: 'pointer',
          minHeight: '120px',
          opacity: groups.length >= 2 ? 0.7 : 1,
          ...style
        }}
      >
        <div style={{ 
          color: '#f5e6d3', 
          fontSize: '1.2em',
          position: 'absolute',
          top: '10px',
          left: '20px',
          zIndex: 1
        }}>
          Floor {floorNumber} ({groups.length}/2)
        </div>

        <div style={{
          marginTop: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '0 10px'
        }}>
          {groups.map((group, index) => (
            <div
              key={`${group.header}-${index}`}
              style={{
                backgroundColor: getGroupColor(group.avgScore),
                padding: '12px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
              onClick={() => {
                console.log('Group clicked:', group);
                setSelectedGroup(group);
              }}
            >
              <div style={{
                color: '#f5e6d3',
                fontWeight: 'bold',
                marginBottom: '4px'
              }}>
                {group.header}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: '#f5e6d3',
                fontSize: '0.9em',
                opacity: 0.7
              }}>
                <span>People: {group.peopleCount}</span>
                <span>Score: {group.avgScore}</span>
              </div>
            </div>
          ))}
          {groups.length === 0 && (
            <div style={{
              color: '#f5e6d3',
              opacity: 0.5,
              fontSize: '0.9em',
              width: '100%',
              textAlign: 'center',
              marginTop: '10px'
            }}>
              No groups assigned (0/2)
            </div>
          )}
        </div>
      </div>

      {selectedGroup && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              zIndex: 1000
            }}
            onClick={() => setSelectedGroup(null)}
          />
          <GroupModal
            group={selectedGroup}
            onClose={() => setSelectedGroup(null)}
          />
        </>
      )}
    </>
  );
}

export default Floor; 