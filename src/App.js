import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FloorPlan from './components/FloorPlan';
import './App.css';
import Papa from 'papaparse';

const TEAM_COLORS = {
  marketing: '#ffcdd2',  // Light red
  sales: '#c8e6c9',     // Light green
  development: '#e3f2fd' // Light blue
};

function App() {
  const [floorData, setFloorData] = useState([]);
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState('all');

  useEffect(() => {
    const loadCSVData = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/fake_file.csv`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();
        console.log('CSV Content:', csvText);

        const parsedData = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true
        }).data;
        
        console.log('CSV Headers:', Object.keys(parsedData[0]));
        console.log('First row:', parsedData[0]);

        const mappedData = parsedData.map(row => ({
          floor: parseInt(row.floor),
          desk_id: row.desk_id,
          employees: row.employee_name ? [{
            name: row.employee_name,
            team: row.team?.toLowerCase() || 'development'
          }] : [],
          position_x: parseInt(row.position_x),
          position_y: parseInt(row.position_y)
        }));
        
        console.log('Final mapped data:', mappedData);
        setFloorData(mappedData);
      } catch (error) {
        console.error('Error loading CSV:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
    };

    loadCSVData();
  }, []);

  const handleDeskDrop = (deskId, employee) => {
    console.log('Dropping employee:', employee, 'onto desk:', deskId);
    setFloorData(prevData => {
      // First, remove employee from any previous desk
      const newData = prevData.map(desk => ({
        ...desk,
        employees: desk.employees?.filter(emp => emp.name !== employee.name) || []
      }));
      
      // Then, assign employee to new desk
      return newData.map(desk => {
        if (desk.desk_id === deskId) {
          const currentEmployees = desk.employees || [];
          return {
            ...desk,
            employees: [...currentEmployees, {
              name: employee.name,
              team: employee.team
            }]
          };
        }
        return desk;
      });
    });
  };

  const handleDeskClick = (deskId) => {
    console.log('Desk clicked:', deskId);
    const desk = floorData.find(desk => desk.desk_id === deskId);
    setSelectedDesk(desk);
    console.log('Selected desk:', desk);
  };

  const getUniqueEmployees = (floorData) => {
    const uniqueEmployees = new Set();
    floorData.forEach(desk => {
      if (desk.employees) {
        desk.employees.forEach(employee => {
          uniqueEmployees.add(employee.name);
        });
      }
    });
    return Array.from(uniqueEmployees).map((name, index) => ({
      id: index + 1,
      name: name
    }));
  };

  const getFilteredEmployees = (floorData, teamFilter) => {
    const allEmployees = floorData.flatMap(desk => desk.employees || []);
    const uniqueEmployees = Array.from(
      new Map(allEmployees.map(emp => [emp.name, emp])).values()
    );
    
    if (teamFilter === 'all') {
      return uniqueEmployees;
    }
    
    return uniqueEmployees.filter(emp => emp.team === teamFilter);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App" style={{ 
        backgroundColor: '#000000',
        minHeight: '100vh',
        padding: '20px',
        color: 'white'  // Makes text white
      }}>
        <h1>Office Floor Plan</h1>
        <div className="employee-list" style={{
          padding: '16px',
          background: '#1a1a1a',  // Dark gray background
          border: '1px solid #333',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <h3>Employees</h3>
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <button 
              onClick={() => setSelectedTeam('all')}
              style={{
                backgroundColor: selectedTeam === 'all' ? '#333' : '#1a1a1a',
                border: '1px solid #444',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                color: 'white'
              }}
            >
              All
            </button>
            <button 
              onClick={() => setSelectedTeam('marketing')}
              style={{
                backgroundColor: selectedTeam === 'marketing' ? '#ffcdd2' : '#1a1a1a',
                border: '1px solid #444',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                color: selectedTeam === 'marketing' ? '#000' : 'white'
              }}
            >
              Marketing
            </button>
            <button 
              onClick={() => setSelectedTeam('sales')}
              style={{
                backgroundColor: selectedTeam === 'sales' ? '#c8e6c9' : '#1a1a1a',
                border: '1px solid #444',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                color: selectedTeam === 'sales' ? '#000' : 'white'
              }}
            >
              Sales
            </button>
            <button 
              onClick={() => setSelectedTeam('development')}
              style={{
                backgroundColor: selectedTeam === 'development' ? '#e3f2fd' : '#1a1a1a',
                border: '1px solid #444',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                color: selectedTeam === 'development' ? '#000' : 'white'
              }}
            >
              Development
            </button>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '8px',
            alignItems: 'center'
          }}>
            {getFilteredEmployees(floorData, selectedTeam).map((employee, index) => (
              <div
                key={index}
                className="draggable-employee"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('employee', JSON.stringify(employee));
                }}
                style={{
                  padding: '4px 8px',
                  backgroundColor: TEAM_COLORS[employee.team] || '#f5f5f5',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'move',
                  userSelect: 'none',
                  fontSize: '0.9em',
                  color: '#000'  // Keep text dark for contrast
                }}
              >
                {employee.name}
              </div>
            ))}
          </div>
        </div>

        <div className="floor-container">
          <FloorPlan
            floorData={floorData}
            onDeskDrop={handleDeskDrop}
            onDeskClick={handleDeskClick}
          />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
