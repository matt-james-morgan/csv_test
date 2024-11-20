import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import FloorPlan from './components/FloorPlan';
import MatrixList from './components/MatrixList';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  const [floorData, setFloorData] = useState(
    Array.from({ length: 40 }, (_, index) => ({
      floor_id: index + 1,
      groups: []
    }))
  );
  const [matrixData, setMatrixData] = useState([]);

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
      } catch (error) {
        console.error('Error loading CSV:', error);
      }
    };

    loadCSVData();
  }, []);

  const handleFloorDrop = (group, floorId) => {
    console.log('Handling group drop:', { group, floorId });
    setFloorData(prevFloorData => {
      const newFloorData = prevFloorData.map(floor => {
        if (floor.floor_id === floorId) {
          // Check if floor already has 2 groups
          if (floor.groups.length >= 2) {
            console.log('Floor already has maximum groups');
            return floor; // Don't add more groups
          }
          
          // Check if group is already on this floor
          if (floor.groups.some(g => g.header === group.header)) {
            console.log('Group already exists on this floor');
            return floor;
          }

          console.log('Adding group to floor:', floorId);
          return { 
            ...floor, 
            groups: [...floor.groups, group] 
          };
        }
        return floor;
      });
      console.log('Updated floor data:', newFloorData);
      return newFloorData;
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
        <h1 style={{ 
          margin: '10px 20px',
          flex: '0 0 auto',
          color: '#f5e6d3'
        }}>
          Office Floor Plan
        </h1>
        
        <div style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          padding: '0 20px 20px 20px'
        }}>
          <MatrixList matrixData={matrixData} />

          <div className="floor-container" style={{ 
            flex: 1,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <FloorPlan
              floorData={floorData}
              handleFloorDrop={handleFloorDrop}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
