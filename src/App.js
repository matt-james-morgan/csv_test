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
    Array.from({ length: 40 }, (_, index) => ({
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

        console.log('Transformed Matrix Data:', transformedMatrixData);
        setMatrixData(transformedMatrixData);

        // Load collaboration data
        const collabResponse = await fetch(`${process.env.PUBLIC_URL}/Group Cross Collab.csv`);
        const collabText = await collabResponse.text();
        const parsedCollabData = Papa.parse(collabText, {
          header: false,
          skipEmptyLines: true
        }).data;

        // Remove the first column (People #) and first row (headers)
        const cleanedData = parsedCollabData.slice(1).map(row => row.slice(2));
        setCollaborationData(cleanedData);

        // Randomly assign two groups to the first 20 floors
        const assignedGroups = [];
        for (let i = 0; i < Math.min(20, transformedMatrixData.length); i++) {
          const floor = floorData[i];
          const group1Index = Math.floor(Math.random() * transformedMatrixData.length);
          let group2Index = Math.floor(Math.random() * transformedMatrixData.length);
          
          // Ensure group2Index is different from group1Index
          while (group2Index === group1Index) {
            group2Index = Math.floor(Math.random() * transformedMatrixData.length);
          }

          // Assign two random groups to the floor
          assignedGroups.push({
            floor_id: floor.floor_id,
            groups: [transformedMatrixData[group1Index], transformedMatrixData[group2Index]]
          });
        }

        // Update the first 20 floors with assigned groups
        setFloorData(prevFloorData => {
          return prevFloorData.map((floor, index) => {
            if (index < assignedGroups.length) {
              return {
                ...floor,
                groups: assignedGroups[index].groups
              };
            }
            return floor;
          });
        });

      } catch (error) {
        console.error('Error loading CSV:', error);
      }
    };

    loadCSVData();
  }, []);
  
  const getGroupNumber = (header) => parseInt(header.replace('Group ', '')) - 1;
  
  const getCollaborationScore = (group1, group2) => {
    if (!collaborationData.length) return 0;
    
    
    const index1 = getGroupNumber(group1.header);
    const index2 = getGroupNumber(group2.header);
    
    if (index1 < 0 || index1 >= collaborationData.length || index2 < 0 || index2 >= collaborationData.length) {
      console.warn(`Invalid group indices: ${index1}, ${index2}`);
      return 0;
    }
    
    const score1 = parseInt(collaborationData[index1][index2]) || 0;
    const score2 = parseInt(collaborationData[index2][index1]) || 0;
    
    return Math.max(score1, score2);
  };

  const calculateGroupCollaborationScores = (groups) => {
    if (groups.length <= 1) {
      return groups.map(group => ({ ...group, collaborationScore: 0 }));
    }

    // Calculate weighted average for each group
    return groups.map(currentGroup => {
      let totalWeightedScore = 0;
      let totalWeight = 0;

      groups.forEach(otherGroup => {
        if (currentGroup.header !== otherGroup.header) {
          const score = getCollaborationScore(currentGroup, otherGroup);
          const weight = otherGroup.peopleCount;
          
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
    if (groups.length <= 1) return 0;

    let totalWeightedScore = 0;
    let totalWeight = 0;

    groups.forEach(group => {
      totalWeightedScore += group.collaborationScore * group.peopleCount;
      totalWeight += group.peopleCount;
    });

    return totalWeight > 0 
      ? Math.round(totalWeightedScore / totalWeight)
      : 0;
  };

  const handleFloorDrop = (group, floorId) => {
    setFloorData(prevFloorData => {
      return prevFloorData.map(floor => {
        if (floor.floor_id === floorId) {
          if (floor.groups.some(g => g.header === group.header)) {
            return floor;
          }

          const newGroups = [...floor.groups, group];
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

  const handleGroupHover = (group, collaborators) => {
    setHoveredGroup(group);
    setTopCollaborators(collaborators);
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
            matrixData={matrixData} 
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
                calculateGroupCollaborationScores={calculateGroupCollaborationScores}
                getGroupNumber={getGroupNumber}
              />
            ) : (
              <FloorPlan
                floorData={floorData}
                handleFloorDrop={handleFloorDrop}
                handleFloorClear={handleFloorClear}
                onGroupSelect={setSelectedGroup}
                isIsometricView={isIsometricView}
                isZoomedOut={isZoomedOut}
                setIsZoomedOut={setIsZoomedOut}
                hoveredGroup={hoveredGroup}
                topCollaborators={topCollaborators}
                onGroupDelete={handleGroupDelete}
              />
            )}
          </div>
        </div>

        {selectedGroup && (
          <GroupModal
            group={selectedGroup}
            onClose={() => setSelectedGroup(null)}
          />
        )}
      </div>
    </DndProvider>
  );
}

export default App;

