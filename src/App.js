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
  const [searchQuery, setSearchQuery] = useState('');

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
          floor_id: row.floor,
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

  const handleFloorDrop = (floorId, employee) => {
    console.log('Dropping employee:', employee, 'onto floor:', floorId);
    setFloorData(prevData => {
      // First, remove employee from any previous floor
      const newData = prevData.map(floor => ({
        ...floor,
        employees: floor.employees?.filter(emp => emp.name !== employee.name) || []
      }));
      
      // Then, assign employee to new floor
      return newData.map(floor => {
        if (floor.floor_id === floorId) {
          const currentEmployees = floor.employees || [];
          return {
            ...floor,
            employees: [...currentEmployees, {
              name: employee.name,
              team: employee.team
            }]
          };
        }
        return floor;
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

  const getFilteredEmployees = (floorData, teamFilter, search) => {
    const allEmployees = floorData.flatMap(desk => desk.employees || []);
    const uniqueEmployees = Array.from(
      new Map(allEmployees.map(emp => [emp.name, emp])).values()
    );
    
    return uniqueEmployees.filter(emp => {
      const matchesTeam = teamFilter === 'all' || emp.team === teamFilter;
      const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase());
      return matchesTeam && matchesSearch;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App" style={{ 
        backgroundColor: '#000000',
        height: '100vh',  // Exactly viewport height
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        color: 'white',
        overflow: 'hidden'  // Prevent scrolling
      }}>
        <h1 style={{ 
          margin: '0 0 20px 0'  // Reduce margin to just bottom
        }}>Office Floor Plan</h1>
        
        <div style={{
          display: 'flex',
          gap: '20px',
          height: 'calc(100% - 60px)',  // Subtract header height + margins
          overflow: 'hidden'  // Prevent scrolling
        }}>
          {/* Employee List Section */}
          <div className="employee-list" style={{
            padding: '16px',
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '4px',
            width: '200px',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}>
            <h3 style={{ margin: '0 0 12px 0' }}>Employees</h3>
            
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px',
                marginBottom: '12px',
                backgroundColor: '#333',
                border: '1px solid #444',
                borderRadius: '4px',
                color: 'white',
                outline: 'none'
              }}
            />

            {/* Filter Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
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

            {/* Scrollable Employee List */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              overflowY: 'auto',
              flex: 1,
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}>
              {getFilteredEmployees(floorData, selectedTeam, searchQuery).map((employee, index) => (
                <div
                  key={index}
                  className="draggable-employee"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('employee', JSON.stringify(employee));
                  }}
                  style={{
                    padding: '8px',
                    backgroundColor: TEAM_COLORS[employee.team] || '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'move',
                    userSelect: 'none',
                    fontSize: '0.9em',
                    color: '#000'
                  }}
                >
                  {employee.name}
                </div>
              ))}
            </div>
          </div>

          {/* Floor Plan Section */}
          <div className="floor-container" style={{ 
            flex: 1,
            height: '100%',
            overflow: 'hidden'  // Prevent scrolling
          }}>
            <FloorPlan
              floorData={floorData}
              onDeskDrop={handleFloorDrop}
              onDeskClick={handleDeskClick}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
