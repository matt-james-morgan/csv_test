import '../styles/MatrixList.css';

function MatrixList({ matrixData }) {
  const getGroupColor = (score) => {
    if (score >= 60) return 'rgba(76, 175, 80, 0.3)';
    if (score >= 40) return 'rgba(255, 193, 7, 0.3)';
    return 'rgba(244, 67, 54, 0.3)';
  };

  return (
    <div className="matrix-list-container">
      <h2 style={{
        color: '#f5e6d3',
        marginTop: 0,
        marginBottom: '20px',
        fontSize: '1.2em'
      }}>
        Teams
      </h2>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {matrixData.map((team) => (
          <div
            key={team.header}
            style={{
              backgroundColor: getGroupColor(team.avgScore),
              padding: '12px',
              borderRadius: '6px',
              cursor: 'grab'
            }}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/json', JSON.stringify(team));
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
        ))}
      </div>
    </div>
  );
}

export default MatrixList; 