import '../styles/MatrixList.css';
import { useState } from 'react';
import GroupModal from './GroupModal';

function MatrixList({ matrixData, collaborationData, onHoverGroup }) {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const [checkedGroup, setCheckedGroup] = useState(null);
  

  const getGroupColor = (score) => {
    if (score >= 60) return 'rgba(76, 175, 80, 0.3)';
    if (score >= 40) return 'rgba(255, 193, 7, 0.3)';
    return 'rgba(244, 67, 54, 0.3)';
  };

  const getTopCollaborators = (group) => {
    if (!collaborationData || !collaborationData[0] || !group || !matrixData) {
      return [];
    }

    try {
      const getGroupNumber = (header) => parseInt(header.replace('Group ', '')) - 1;
      const groupIndex = getGroupNumber(group.header);

      if (groupIndex < 0 || groupIndex >= collaborationData.length) {
        console.warn(`Invalid group index: ${groupIndex}`);
        return [];
      }

      const collaborators = matrixData
        .filter(otherGroup => otherGroup.header !== group.header)
        .map(otherGroup => {
          const otherIndex = getGroupNumber(otherGroup.header);
          
          if (otherIndex < 0 || otherIndex >= collaborationData.length || 
              !collaborationData[groupIndex] || !collaborationData[otherIndex]) {
            return {
              ...otherGroup,
              collaborationScore: 0
            };
          }

          const score = Math.max(
            parseInt(collaborationData[groupIndex][otherIndex]) || 0,
            parseInt(collaborationData[otherIndex][groupIndex]) || 0
          );

          return {
            ...otherGroup,
            collaborationScore: score
          };
        })
        .sort((a, b) => b.collaborationScore - a.collaborationScore)
        .slice(0, 5);

      return collaborators;
    } catch (error) {
      console.error('Error in getTopCollaborators:', error);
      return [];
    }
  };

  const handleMouseEnter = (group) => {
    setHoveredGroup(group);
    onHoverGroup(group, getTopCollaborators(group));
  };

  return (
    <>
      <div className="matrix-list-container" style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100% - 40px)',
        backgroundColor: '#1a1a1a',
        width: '300px',
        position: 'relative',
        margin: '20px 0',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'sticky',
          top: 0,
          backgroundColor: '#1a1a1a',
          padding: '20px 15px',
          borderBottom: '1px solid rgba(245, 230, 211, 0.1)',
          zIndex: 2,
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px'
        }}>
          <h2 style={{
            color: '#f5e6d3',
            margin: 0,
            fontSize: '1.2em'
          }}>
            Teams
          </h2>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '15px',
          overflowY: 'auto',
          height: '100%',
          position: 'relative',
          zIndex: 1
        }}>
          {matrixData.map((team, index) => (
            <div 
              key={`${team.header}-${index}-container`}
              style={{ 
                display: 'flex',  
                flexDirection: 'row', 
                justifyContent: 'space-evenly', 
                marginRight: '10px' 
              }}
            >
              <input
                type="checkbox"
                style={{ 
                  marginRight: '10px',
                  width: '20px',
                  height: '20px',
                  appearance: 'none',
                  backgroundColor: 'black',
                  border: '2px solid grey',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  alignSelf: 'center'
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the card click
                  if (checkedGroup === team.header) {
                    setCheckedGroup(null);
                    e.currentTarget.style.backgroundColor = 'black';
                    e.currentTarget.style.backgroundImage = 'none';
                    
                    // Clear hover states and collaboration data
                    setHoveredGroup(null);
                    onHoverGroup(null, []);
                  } else {
                    // Uncheck previous checkbox if it exists
                    const prevCheckbox = document.querySelector(`input[type="checkbox"][data-group="${checkedGroup}"]`);
                    if (prevCheckbox) {
                      prevCheckbox.style.backgroundColor = 'black';
                      prevCheckbox.style.backgroundImage = 'none';
                    }
                    
                    // Set new checked group and update hover states
                    setCheckedGroup(team.header);
                    setHoveredGroup(team);
                    onHoverGroup(team, getTopCollaborators(team));
                    
                    // Apply checkmark style
                    e.currentTarget.style.backgroundColor = 'black';
                    e.currentTarget.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='grey'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'/%3E%3C/svg%3E")`;
                    e.currentTarget.style.backgroundSize = '80%';
                    e.currentTarget.style.backgroundPosition = 'center';
                    e.currentTarget.style.backgroundRepeat = 'no-repeat';
                  }
                }} 
                data-group={team.header} />
              <div
                key={`${team.header}-${index}`}
                style={{
                  backgroundColor: getGroupColor(team.avgScore),
                  padding: '12px',
                  borderRadius: '6px',
                  cursor: 'grab',
                  position: 'relative',
                  width: '100%'
                }}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify(team));
                  setHoveredGroup(null);
                }}
                onClick={() => setSelectedGroup(team)}
                onMouseEnter={() => {
                  if(!checkedGroup) {
                    handleMouseEnter(team)
                  }
                }}
                onMouseLeave={() => {
                  if(!checkedGroup) {
                  setHoveredGroup(null);
                  onHoverGroup(null, []);
                  }
                }}
              >
                <div style={{
                  color: '#f5e6d3',
                  fontWeight: 'bold',
                  marginBottom: '4px'
                }}>
                  {team.header}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#f5e6d3',
                  fontSize: '0.9em',
                  opacity: 0.7
                }}>
                  <span>People: {team.peopleCount}</span>
                  <span>Score: {team.avgScore}</span>
                </div>
              </div>
            </div>
          ))}
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
            collaborators={getTopCollaborators(selectedGroup)}
          />
        </>
      )}
    </>
  );
}

export default MatrixList; 