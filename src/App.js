import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import FloorPlan from './components/FloorPlan';
import EmployeeList from './components/EmployeeList';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';



function App() {
  const [floorData, setFloorData] = useState([
    { floor_id: 1, employees: [] },
    { floor_id: 2, employees: [] },
    // ... more floors
  ]);
  const [allEmployees, setAllEmployees] = useState([]);

  useEffect(() => {
    const loadCSVData = async () => {
      try {
        const floorResponse = await fetch(`${process.env.PUBLIC_URL}/floors.csv`);
        const floorText = await floorResponse.text();
        const parsedFloorData = Papa.parse(floorText, {
          header: true,
          skipEmptyLines: true
        }).data;

        const employeeResponse = await fetch(`${process.env.PUBLIC_URL}/fake_file.csv`);
        const employeeText = await employeeResponse.text();
        const parsedEmployeeData = Papa.parse(employeeText, {
          header: true,
          skipEmptyLines: true
        }).data;

        const mappedData = parsedFloorData.map(floor => ({
          floor_id: parseInt(floor.floor_id),
          floor_name: floor.floor_name,
          employees: parsedEmployeeData
            .filter(emp => parseInt(emp.floor) === parseInt(floor.floor_id))
            .map(emp => ({
              name: emp.employee_name,
              team: emp.team.toLowerCase(),
              desk: parseInt(emp.desk),
              floor: parseInt(emp.floor)
            }))
        }));

        console.log('Mapped floor data:', mappedData);

        setFloorData(mappedData);
        setAllEmployees(parsedEmployeeData.map(emp => ({
          name: emp.employee_name,
          team: emp.team.toLowerCase(),
          desk: parseInt(emp.desk),
          floor: parseInt(emp.floor)
        })));
      } catch (error) {
        console.error('Error loading CSV:', error);
      }
    };

    loadCSVData();
  }, []);

  const handleDeskDrop = (employee, floorId) => {
    console.log('Handling desk drop:', { employee, floorId });
    
    setFloorData(prevFloorData => 
      prevFloorData.map(floor => {
        if (floor.floor_id === floorId) {
          const existingDesks = floor.employees.map(emp => emp.desk);
          const nextDesk = existingDesks.length > 0 ? Math.max(...existingDesks) + 1 : 1;

          return {
            ...floor,
            employees: [...floor.employees, {
              name: employee.name,
              team: employee.team,
              desk: nextDesk,
              floor: floorId
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
          <EmployeeList employees={allEmployees} />

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
