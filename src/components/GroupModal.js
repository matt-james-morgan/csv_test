function GroupModal({ group, onClose }) {
  const metrics = [
    { label: 'People in Group', value: group.peopleCount },
    { label: 'Internal Traffic', value: `${group.internalTraffic}%` },
    { label: 'Organizational Traffic', value: `${group.orgTraffic}%` },
    { label: 'External Traffic', value: `${group.externalTraffic}%` },
    { label: 'Average CG Score', value: group.avgScore },
    { label: 'Scores Above 10', value: group.scoresAbove10 }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#2a2a2a',
      padding: '30px',
      borderRadius: '12px',
      zIndex: 1100,
      width: '90%',
      maxWidth: '800px',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '1px solid rgba(245, 230, 211, 0.1)',
        paddingBottom: '15px'
      }}>
        <h2 style={{ color: '#f5e6d3', margin: 0 }}>{group.header}</h2>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#f5e6d3',
            cursor: 'pointer',
            fontSize: '1.5em',
            padding: '5px'
          }}
        >×</button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        padding: '10px'
      }}>
        {metrics.map(({ label, value }) => (
          <div
            key={label}
            style={{
              backgroundColor: '#1a1a1a',
              padding: '15px',
              borderRadius: '8px'
            }}
          >
            <div style={{
              color: '#f5e6d3',
              opacity: 0.7,
              fontSize: '0.9em',
              marginBottom: '5px'
            }}>
              {label}
            </div>
            <div style={{
              color: '#f5e6d3',
              fontSize: '1.2em',
              fontWeight: 'bold'
            }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#1a1a1a',
        borderRadius: '8px'
      }}>
        <div style={{
          color: '#f5e6d3',
          opacity: 0.7,
          marginBottom: '10px'
        }}>
          Traffic Distribution
        </div>
        <div style={{
          display: 'flex',
          height: '20px',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${group.internalTraffic}%`,
            backgroundColor: 'rgba(76, 175, 80, 0.5)'
          }} />
          <div style={{
            width: `${group.orgTraffic}%`,
            backgroundColor: 'rgba(33, 150, 243, 0.5)'
          }} />
          <div style={{
            width: `${group.externalTraffic}%`,
            backgroundColor: 'rgba(244, 67, 54, 0.5)'
          }} />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
          fontSize: '0.8em',
          color: '#f5e6d3',
          opacity: 0.7
        }}>
          <span>Internal</span>
          <span>Organizational</span>
          <span>External</span>
        </div>
      </div>
    </div>
  );
}

export default GroupModal; 