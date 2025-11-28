import React from 'react';

const ThinkingIndicator = ({ steps = [], isAnalyzing = true }) => {
  return (
    <div style={styles.container}>
      <div style={styles.aiAvatar}>AI</div>
      <div style={styles.thinkingBox}>
        {/* Intent va Language info */}
        {isAnalyzing && (
          <div style={styles.intentRow}>
            <div style={styles.checkIcon}>✓</div>
            <div style={styles.intentText}>
              <span style={styles.intentLabel}>Intent:</span>
              <span style={styles.intentValue}>analytics</span>
              <span style={styles.separator}>•</span>
              <span style={styles.intentLabel}>Language:</span>
              <span style={styles.intentValue}>en</span>
            </div>
          </div>
        )}

        {/* Thinking Steps */}
        <div style={styles.stepsList}>
          {steps.map((step, index) => (
            <div key={index} style={styles.stepRow}>
              <div style={styles.stepIndicator}>
                {step.completed ? (
                  <div style={styles.completedIcon}>✓</div>
                ) : (
                  <div style={styles.loadingSpinner}></div>
                )}
              </div>
              <div style={styles.stepContent}>
                <span style={step.completed ? styles.completedText : styles.activeText}>
                  {step.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Loading dots if still analyzing */}
        {isAnalyzing && steps.length === 0 && (
          <div style={styles.loadingRow}>
            <div style={styles.loadingDots}>
              <span style={styles.dot}></span>
              <span style={styles.dot}></span>
              <span style={styles.dot}></span>
            </div>
            <span style={styles.loadingText}>Analyzing your request...</span>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    marginBottom: '16px',
    animation: 'fadeIn 0.3s ease-in'
  },
  aiAvatar: {
    width: '36px',
    height: '36px',
    minWidth: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff',
    marginTop: '4px'
  },
  thinkingBox: {
    maxWidth: '80%',
    padding: '16px 20px',
    borderRadius: '18px',
    backgroundColor: '#1a1f2e',
    border: '1px solid #2d3748',
    color: '#e2e8f0',
    fontSize: '14px',
    minWidth: '400px'
  },
  intentRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingBottom: '12px',
    borderBottom: '1px solid #2d3748',
    marginBottom: '12px'
  },
  checkIcon: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  intentText: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px'
  },
  intentLabel: {
    color: '#9ca3af',
    fontWeight: '400'
  },
  intentValue: {
    color: '#667eea',
    fontWeight: '600'
  },
  separator: {
    color: '#4b5563',
    margin: '0 2px'
  },
  stepsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  stepRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    animation: 'slideIn 0.3s ease-out'
  },
  stepIndicator: {
    marginTop: '2px'
  },
  completedIcon: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 'bold'
  },
  loadingSpinner: {
    width: '18px',
    height: '18px',
    border: '2px solid #2d3748',
    borderTop: '2px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  stepContent: {
    flex: 1,
    lineHeight: '1.5'
  },
  completedText: {
    color: '#9ca3af',
    fontSize: '14px'
  },
  activeText: {
    color: '#e2e8f0',
    fontSize: '14px',
    fontWeight: '500'
  },
  loadingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 0'
  },
  loadingDots: {
    display: 'flex',
    gap: '4px'
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#667eea',
    animation: 'bounce 1.4s infinite ease-in-out'
  },
  loadingText: {
    color: '#9ca3af',
    fontSize: '13px',
    fontStyle: 'italic'
  }
};

// CSS animations
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes bounce {
      0%, 80%, 100% { 
        transform: scale(0.8);
        opacity: 0.5;
      }
      40% { 
        transform: scale(1);
        opacity: 1;
      }
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-10px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default ThinkingIndicator;