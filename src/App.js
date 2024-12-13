import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import FloorPlan from './components/FloorPlan';
import MatrixList from './components/MatrixList';
import CompareFloors from './components/CompareFloors';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GroupModal from './components/GroupModal';

function App() {
  const [floorData, setFloorData] = useState(
    Array.from({ length: 8 }, (_, index) => ({
      floor_id: index + 1,
      groups: []
    }))
  );
  const [matrixData, setMatrixData] = useState([]);
  const [collaborationData, setCollaborationData] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isIsometricView, setIsIsometricView] = useState(true);
  const [isZoomedOut, setIsZoomedOut] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const [topCollaborators, setTopCollaborators] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [capacityWarning, setCapacityWarning] = useState(null);
  const [listData, setListData] = useState([]);
  
  useEffect(() => {
    const loadCSVData = async () => {
      try {
        const matrixResponse = await fetch(`${process.env.PUBLIC_URL}/Matrix.csv`);
        const matrixText = await matrixResponse.text();
        const parsedMatrixData = Papa.parse(matrixText, {
          header: false,
          skipEmptyLines: true
        }).data;

        // Get all data columns
        const headers = parsedMatrixData[0].slice(1);
        const peopleCount = parsedMatrixData[1].slice(1);
        const internalTraffic = parsedMatrixData[2].slice(1);
        const orgTraffic = parsedMatrixData[3].slice(1);
        const externalTraffic = parsedMatrixData[4].slice(1);
        const avgScores = parsedMatrixData[5].slice(1);
        const scoresAbove10 = parsedMatrixData[6].slice(1);

        const transformedMatrixData = headers.map((header, index) => ({
          header,
          peopleCount: parseInt(peopleCount[index]) || 0,
          internalTraffic: parseFloat(internalTraffic[index]) || 0,
          orgTraffic: parseFloat(orgTraffic[index]) || 0,
          externalTraffic: parseFloat(externalTraffic[index]) || 0,
          avgScore: parseFloat(avgScores[index]) || 0,
          scoresAbove10: parseInt(scoresAbove10[index]) || 0
        }));

        // Load collaboration data
        const collabResponse = await fetch(`${process.env.PUBLIC_URL}/Group Cross Collab.csv`);
        const collabText = await collabResponse.text();
        const parsedCollabData = Papa.parse(collabText, {
          header: false,
          skipEmptyLines: true
        }).data;

        // Remove the first column (People #) and first row (headers)
        const cleanedData = parsedCollabData.slice(1).map(row => row.slice(2));
        
        // Process the data with pre-calculated collaborators
        processImportedData({
          matrixData: transformedMatrixData,
          collaborationData: cleanedData
        });

      } catch (error) {
        console.error('Error loading CSV:', error);
      }
    };

    loadCSVData();
  }, []);
  
  const getGroupNumber = (header) => parseInt(header.replace('Group ', '')) - 1;
  
  const getCollaborationScore = (group1, group2) => {
    if (!collaborationData || !Array.isArray(collaborationData) || 
        !group1?.header || !group2?.header) {
      console.warn('Invalid data for collaboration score calculation');
      return 0;
    }
    
    try {
      const index1 = getGroupNumber(group1.header);
      const index2 = getGroupNumber(group2.header);
      
      if (!collaborationData[index1] || !collaborationData[index2] ||
          index1 < 0 || index2 < 0 || 
          index1 >= collaborationData.length || 
          index2 >= collaborationData.length) {
        console.warn(`Out of bounds indices: ${index1}, ${index2}`);
        return 0;
      }
      
      const score1 = Number(collaborationData[index1][index2]) || 0;
      const score2 = Number(collaborationData[index2][index1]) || 0;
      
      return Math.max(score1, score2);
    } catch (error) {
      console.error('Error calculating collaboration score:', error);
      return 0;
    }
  };

  const calculateGroupCollaborationScores = (groups) => {
    if (!collaborationData || groups.length <= 1) {
      return groups.map(group => ({ ...group, collaborationScore: 0 }));
    }

    return groups.map(currentGroup => {
      let totalWeightedScore = 0;
      let totalWeight = 0;

      groups.forEach(otherGroup => {
        if (currentGroup.header !== otherGroup.header) {
          const score = getCollaborationScore(currentGroup, otherGroup);
          const weight = otherGroup.peopleCount || 0;
          totalWeightedScore += score * weight;
          totalWeight += weight;
        }
      });

      const weightedAverage = totalWeight > 0 
        ? Math.round(totalWeightedScore / totalWeight)
        : 0;

      return {
        ...currentGroup,
        collaborationScore: weightedAverage
      };
    });
  };

  const calculateFloorScore = (groups) => {
    if (groups.length <= 1) {
      console.log('Not enough groups for floor score:', groups);
      return 0;
    }

    let totalWeightedScore = 0;
    let totalWeight = 0;

    groups.forEach(group => {
      totalWeightedScore += group.collaborationScore * group.peopleCount;
      totalWeight += group.peopleCount;
    });

    const finalScore = totalWeight > 0 
      ? Math.round(totalWeightedScore / totalWeight)
      : 0;

    console.log('Floor score calculation:', {
      groups: groups.map(g => g.header),
      totalWeightedScore,
      totalWeight,
      finalScore
    });

    return finalScore;
  };
  const checkCapacity = (floor, newGroup) => {
    const currentPeopleCount = floor.groups.reduce(
      (sum, group) => sum + group.peopleCount,
      0
    );
    const wouldExceedCapacity = currentPeopleCount + newGroup.peopleCount > 500;

    if (wouldExceedCapacity) {
      setCapacityWarning(
        `Adding ${newGroup.header} would exceed floor capacity of 500 people`
      );
      setTimeout(() => setCapacityWarning(null), 3000);
      return false;
    }
    return true;
  };

  const handleFloorDrop = (group, floorId) => {
    console.log('Handling floor drop:', { group, floorId });

    
    
    // First remove the group from any other floor it might be on
    setFloorData(prevFloorData => {
      return prevFloorData.map(floor => {
        // If this is not the target floor, remove the group if it exists
        if (floor.floor_id !== floorId) {
          return {
            ...floor,
            groups: floor.groups.filter(g => g.header !== group.header)
          };
        }
        return floor;
      });
    });

    // Then add the group to the new floor
    setFloorData(prevFloorData => {
      return prevFloorData.map(floor => {
        if (floor.floor_id === floorId) {
          // Check capacity before adding
          if (!checkCapacity(floor, group)) {
            return floor;
          }

          // Preserve topCollaborators when adding to floor
          const newGroups = [...floor.groups, { ...group, topCollaborators: group.topCollaborators }];
          const groupsWithScores = calculateGroupCollaborationScores(newGroups);
          const floorScore = calculateFloorScore(groupsWithScores);

          return { 
            ...floor, 
            groups: groupsWithScores,
            collaborationScore: floorScore
          };
        }
        return floor;
      });
    });

    // Remove from matrix data after successful floor update
    setMatrixData(prevMatrixData => {
      console.log('Removing from matrix data:', group.header);
      console.log('Previous matrix data:', prevMatrixData.map(m => m.header));
      const filtered = prevMatrixData.filter(matrix => matrix.header !== group.header);
      console.log('Filtered matrix data:', filtered.map(m => m.header));
      return filtered;
    });
  
    // Also update listData to stay in sync
    setListData(prevListData => 
      prevListData.filter(item => item.header !== group.header)
    );
  };

  const handleGroupDelete = (header) => {
    setFloorData(prevFloorData => {
      return prevFloorData.map(floor => ({
        ...floor,
        groups: floor.groups.filter(group => group.header !== header)
      }));
    });
  };

  const handleFloorClear = (floorId) => {
    setFloorData(prevFloorData => {
      return prevFloorData.map(floor => {
        if (floor.floor_id === floorId) {
          return {
            ...floor,
            groups: [],
            collaborationScore: 0
          };
        }
        return floor;
      });
    });
  };

  const handleGroupHover = (group, topCollabHeaders) => {
    setHoveredGroup(group);
    setTopCollaborators(topCollabHeaders || []);

    console.log('Top collaborators:', topCollabHeaders);

    console.log('Hovered group:', group);

    console.log(floorData.map(floor => ({
      ...floor,
      groups: floor.groups.map(g => ({
        ...g,
        isHighlighted: topCollabHeaders?.includes(g.header) || false
      }))
    })));

    // Update floor data to highlight groups
    setFloorData(prevFloorData => 
      prevFloorData.map(floor => ({
        ...floor,
        groups: floor.groups.map(g => ({
          ...g,
          isHighlighted: topCollabHeaders?.includes(g.header) || false
        }))
      }))
    );
  };

  const processImportedData = ({ matrixData, collaborationData }) => {
    try {
      setCollaborationData(collaborationData);

      // Create matrix data with pre-calculated top collaborators
      const matrixGroupsWithCollabs = matrixData.map(group => {
        const topCollabs = matrixData
          .filter(g => g.header !== group.header)
          .map(g => ({
            group: g,
            score: calculateCollaborationScore(group, g, collaborationData)
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);

        return {
          ...group,
          topCollaborators: topCollabs
        };
      });

      setMatrixData(matrixGroupsWithCollabs);
      setListData(matrixGroupsWithCollabs);

    } catch (error) {
      console.error('Error processing imported data:', error);
    }
  };

  // Helper function to calculate collaboration score
  const calculateCollaborationScore = (group1, group2, collaborationData) => {
    if (!collaborationData || !group1?.header || !group2?.header) {
      return 0;
    }

    try {
      const index1 = getGroupNumber(group1.header);
      const index2 = getGroupNumber(group2.header);

      if (isNaN(index1) || isNaN(index2) || 
          !collaborationData[index1] || !collaborationData[index2]) {
        return 0;
      }

      const score1 = Number(collaborationData[index1][index2]) || 0;
      const score2 = Number(collaborationData[index2][index1]) || 0;

      return Math.max(score1, score2);
    } catch (error) {
      console.error('Error calculating collaboration score:', error);
      return 0;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App" style={{ 
        backgroundColor: '#000000',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <header style={{
          backgroundColor: '#1a1a1a',
          padding: '15px 20px',
          borderBottom: '1px solid rgba(245, 230, 211, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h1 style={{
            color: '#f5e6d3',
            margin: 0,
            fontSize: '1.5em',
            fontWeight: '500',
            letterSpacing: '1px'
          }}>
            Verinovi
          </h1>
          
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <button
              onClick={() => {
                if (isZoomedOut) {
                  setIsZoomedOut(false);
                }
                if (!showCompare) {
                  setIsIsometricView(!isIsometricView);
                }
              }}
              disabled={isZoomedOut || showCompare}
              style={{
                backgroundColor: (isZoomedOut || showCompare) ? 'rgba(100, 100, 100, 0.5)' : 'rgba(245, 230, 211, 0.1)',
                border: 'none',
                color: '#f5e6d3',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: (isZoomedOut || showCompare) ? 'not-allowed' : 'pointer',
                fontSize: '0.9em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => !(isZoomedOut || showCompare) && (e.target.style.backgroundColor = 'rgba(245, 230, 211, 0.2)')}
              onMouseOut={(e) => !(isZoomedOut || showCompare) && (e.target.style.backgroundColor = 'rgba(245, 230, 211, 0.1)')}
            >
              {isIsometricView ? '2D View' : '3D View'}
            </button>

            <button
              onClick={() => {
                setIsZoomedOut(!isZoomedOut);
                if (!isZoomedOut) {
                  setIsIsometricView(false);
                }
                // Close compare mode when switching to all floors
                setShowCompare(false);
              }}
              style={{
                backgroundColor: 'rgba(245, 230, 211, 0.1)',
                border: 'none',
                color: '#f5e6d3',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(245, 230, 211, 0.2)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(245, 230, 211, 0.1)'}
            >
              {isZoomedOut ? 'Focus View' : 'All Floors'}
            </button>

            <button
              onClick={() => {
                setShowCompare(true);
                // Close zoomed out view when entering compare mode
                setIsZoomedOut(false);
              }}
              style={{
                backgroundColor: 'rgba(245, 230, 211, 0.1)',
                border: 'none',
                color: '#f5e6d3',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(245, 230, 211, 0.2)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(245, 230, 211, 0.1)'}
            >
              Compare
            </button>
          </div>
        </header>

        <div style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          padding: '0 20px 20px 20px'
        }}>
          <MatrixList 
            matrixData={listData} 
            collaborationData={collaborationData}
            onHoverGroup={handleGroupHover}
          />
          <div style={{ 
            flex: 1, 
            position: 'relative', 
            padding: '20px', 
            boxSizing: 'border-box'
          }}>
            {showCompare ? (
              <CompareFloors 
                floorData={floorData} 
                onClose={() => setShowCompare(false)}
                getCollaborationScore={getCollaborationScore}
                getGroupNumber={getGroupNumber}
              />
            ) : (
              <FloorPlan
                floorData={floorData}
                setFloorData={setFloorData}
                handleFloorDrop={handleFloorDrop}
                handleFloorClear={handleFloorClear}
                onGroupSelect={setSelectedGroup}
                isIsometricView={isIsometricView}
                isZoomedOut={isZoomedOut}
                setIsZoomedOut={setIsZoomedOut}
                hoveredGroup={hoveredGroup}
                topCollaborators={topCollaborators}
                onGroupDelete={handleGroupDelete}
                capacityWarning={capacityWarning}
                getCollaborationScore={getCollaborationScore}
                handleGroupHover={handleGroupHover}
              />
            )}
          </div>
        </div>

        {selectedGroup && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            {Array.isArray(selectedGroup) ? (
              selectedGroup.map(group => (
                <GroupModal
                  key={group.header}
                  group={group}
                  onClose={() => setSelectedGroup(null)}
                />
              ))
            ) : (
              <GroupModal
                group={selectedGroup}
                onClose={() => setSelectedGroup(null)}
              />
            )}
          </div>
        )}
      </div>
    </DndProvider>
  );
}

export default App;

