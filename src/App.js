import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import FloorPlan from './components/FloorPlan';
import MatrixList from './components/MatrixList';
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

      } catch (error) {
        console.error('Error loading CSV:', error);
      }
    };

    loadCSVData();
  }, []);

  const getCollaborationScore = (group1, group2) => {
    if (!collaborationData.length) return 0;
    
    // Extract group numbers from headers (assuming format "Group X")
    const getGroupNumber = (header) => parseInt(header.replace('Group ', '')) - 1;
    
    const index1 = getGroupNumber(group1.header);
    const index2 = getGroupNumber(group2.header);
    
    // Get score from the matrix (try both combinations as it's symmetric)
    const score1 = parseInt(collaborationData[index1][index2]) || 0;
    const score2 = parseInt(collaborationData[index2][index1]) || 0;
    
    return Math.max(score1, score2);
  };

  const calculateFloorScore = (groups) => {
    if (groups.length <= 1) return 0;
    
    let totalScore = 0;
    let pairCount = 0;

    // Calculate scores between each pair of groups
    for (let i = 0; i < groups.length; i++) {
      for (let j = i + 1; j < groups.length; j++) {
        totalScore += getCollaborationScore(groups[i], groups[j]);
        pairCount++;
      }
    }

    // Return average score
    return pairCount > 0 ? Math.round(totalScore / pairCount) : 0;
  };

  const handleFloorDrop = (group, floorId) => {
    setFloorData(prevFloorData => {
      return prevFloorData.map(floor => {
        if (floor.floor_id === floorId) {
          if (floor.groups.some(g => g.header === group.header)) {
            return floor;
          }

          const newGroups = [...floor.groups, group];
          const collaborationScore = calculateFloorScore(newGroups);
          
          return { 
            ...floor, 
            groups: newGroups,
            collaborationScore
          };
        }
        return floor;
      });
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
          alignItems: 'center'
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
        </header>

        <div style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          padding: '0 20px 20px 20px'
        }}>
          <MatrixList matrixData={matrixData} />
          <div style={{ 
            flex: 1, 
            position: 'relative', 
            overflow: 'hidden' 
          }}>
            <FloorPlan
              floorData={floorData}
              handleFloorDrop={handleFloorDrop}
              handleFloorClear={handleFloorClear}
              onGroupSelect={setSelectedGroup}
            />
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
