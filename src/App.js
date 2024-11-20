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
      employees: []
    }))
  );
  const [matrixData, setMatrixData] = useState([]);

  useEffect(() => {
    const loadCSVData = async () => {
      try {
        // Load Matrix CSV
        const matrixResponse = await fetch(`${process.env.PUBLIC_URL}/Matrix.csv`);
        const matrixText = await matrixResponse.text();
        const parsedMatrixData = Papa.parse(matrixText, {
          header: false,
          skipEmptyLines: true
        }).data;

        // Transform matrix data
        const headers = parsedMatrixData[0].slice(1); // Skip first column
        const peopleCount = parsedMatrixData[1].slice(1);
        const avgScores = parsedMatrixData[5].slice(1);

        const transformedMatrixData = headers.map((header, index) => ({
          header,
          peopleCount: parseInt(peopleCount[index]) || 0,
          avgScore: parseFloat(avgScores[index]) || 0
        }));

        setMatrixData(transformedMatrixData);
      } catch (error) {
        console.error('Error loading CSV:', error);
      }
    };

    loadCSVData();
  }, []);

  const handleDeskDrop = (team, floorId) => {
    console.log('Handling team drop:', { team, floorId });
    
    setFloorData(prevFloorData => 
      prevFloorData.map(floor => {
        if (floor.floor_id === floorId) {
          const nextDesk = floor.employees.length + 1;
          return {
            ...floor,
            employees: [...floor.employees, {
              name: team.header,
              team: team.header.toLowerCase(),
              desk: nextDesk,
              floor: floorId,
              peopleCount: team.peopleCount,
              avgScore: team.avgScore
            }]
          };
        }
        return floor;
      })
    );
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
              onDeskDrop={handleDeskDrop}
              onDeskClick={() => {}}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
