import React, { useState } from 'react';
import { useDrag } from 'react-dnd';

const TEAM_COLORS = {
  marketing: '#ffcdd2',
  sales: '#c8e6c9',
  development: '#e3f2fd'
};

function EmployeeList({ employees }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTeamChange = (e) => {
    setSelectedTeam(e.target.value);
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = selectedTeam === 'all' || emp.team === selectedTeam;
    return matchesSearch && matchesTeam;
  });

  const handleDragStart = (e, employee) => {
    e.dataTransfer.setData('application/json', JSON.stringify(employee));
    // Add a visual effect during drag
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    // Reset the visual effect
    e.target.style.opacity = '1';
  };

  return (
    <div style={{
      padding: '16px',
      background: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '4px',
      width: '200px',
      height: '100%',
      marginRight: '20px',
      overflowY: 'scroll',
      scrollbarWidth: 'none',
      '-ms-overflow-style': 'none'
    }}>
     

      
      <h3 style={{ 
        marginBottom: '12px',
        color: '#f5e6d3'
      }}>
        Employees
      </h3>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
          width: '90%',
          padding: '8px',
          marginBottom: '10px',
          borderRadius: '4px',
          border: '1px solid #fff',
          backgroundColor: '#000',
          color: '#fff'
        }}
      />
      <select
        value={selectedTeam}
        onChange={handleTeamChange}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '10px',
          borderRadius: '4px',
          border: '1px solid #fff',
          backgroundColor: '#000',
          color: '#fff'
        }}
      >
        <option value="all">All Departments</option>
        <option value="marketing">Marketing</option>
        <option value="sales">Sales</option>
        <option value="development">Development</option>
      </select>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {filteredEmployees.map((employee, index) => (
          <DraggableEmployee key={index} employee={employee} />
        ))}
      </ul>
    </div>
  );
}

function DraggableEmployee({ employee }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'EMPLOYEE',
    item: { name: employee.name, team: employee.team },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <li
      ref={drag}
      style={{
        backgroundColor: TEAM_COLORS[employee.team],
        padding: '6px 12px',
        borderRadius: '4px',
        marginBottom: '6px',
        color: '#000',
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      {employee.name}
    </li>
  );
}

export default EmployeeList; 