import '../styles/CustomScrollbar.css';

const GroupModal = ({ group, onClose }) => {
  const maxTraffic = Math.max(group.internalTraffic, group.orgTraffic, group.externalTraffic);
  
  const getTrafficWidth = (traffic) => {
    return (traffic / maxTraffic) * 100 + '%';
  };

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#2a2a2a',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 1000,
      minWidth: '400px',
      maxWidth: '600px',
      maxHeight: '80vh',
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      <h2 style={{ color: '#f5e6d3', marginTop: 0 }}>{group.header}</h2>
      
      <div style={{ color: '#f5e6d3', marginBottom: '20px' }}>
        <div>People: {group.peopleCount}</div>
        <div>Average Score: {group.avgScore}</div>
        <div>Scores Above 10: {group.scoresAbove10}</div>
        
        {/* Traffic Visualization */}
        <div style={{ marginTop: '15px' }}>
          <h3 style={{ fontSize: '1em', marginBottom: '10px' }}>Traffic Distribution</h3>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ marginBottom: '5px' }}>Internal: {group.internalTraffic}%</div>
            <div style={{ 
              height: '20px', 
              backgroundColor: 'rgba(76, 175, 80, 0.3)',
              width: getTrafficWidth(group.internalTraffic),
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ marginBottom: '5px' }}>Organizational: {group.orgTraffic}%</div>
            <div style={{ 
              height: '20px', 
              backgroundColor: 'rgba(255, 193, 7, 0.3)',
              width: getTrafficWidth(group.orgTraffic),
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ marginBottom: '5px' }}>External: {group.externalTraffic}%</div>
            <div style={{ 
              height: '20px', 
              backgroundColor: 'rgba(244, 67, 54, 0.3)',
              width: getTrafficWidth(group.externalTraffic),
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Top Collaborators Section */}
      {group.topCollaborators && group.topCollaborators.length > 0 && (
        <div style={{ 
          marginTop: '20px',
          borderTop: '1px solid rgba(245, 230, 211, 0.1)',
          paddingTop: '20px'
        }}>
          <h3 style={{ 
            color: '#f5e6d3', 
            fontSize: '1.1em', 
            marginBottom: '15px' 
          }}>
            Top Collaborators
          </h3>
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {group.topCollaborators.map((collab, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#f5e6d3',
                  padding: '8px',
                  backgroundColor: 'rgba(245, 230, 211, 0.05)',
                  borderRadius: '4px'
                }}
              >
                <span>{collab.group.header}</span>
                <span>Collaboration Score: {collab.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'none',
          border: 'none',
          color: '#f5e6d3',
          cursor: 'pointer',
          fontSize: '1.2em',
          padding: '5px'
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default GroupModal; 