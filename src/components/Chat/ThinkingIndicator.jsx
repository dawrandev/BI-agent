import React, { useState, useEffect, useRef } from "react";

const ThinkingIndicator = ({ steps = [], isStreaming = true }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef(null);
  const innerRef = useRef(null);
  const lastStepRef = useRef(null);

  // Auto-scroll to latest step when new steps arrive
  useEffect(() => {
    if (lastStepRef.current && isExpanded && isStreaming) {
      lastStepRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [steps.length, isExpanded, isStreaming]);

  // Measure content height for smooth animation
  useEffect(() => {
    if (innerRef.current) {
      setContentHeight(innerRef.current.scrollHeight);
    }
  }, [steps, isExpanded]);

  // Collapse when streaming ends
  useEffect(() => {
    if (!isStreaming && steps.length > 0) {
      // Small delay before collapsing for smoother UX
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isStreaming, steps.length]);

  // Expand when streaming starts
  useEffect(() => {
    if (isStreaming) {
      setIsExpanded(true);
    }
  }, [isStreaming]);

  if (steps.length === 0 && !isStreaming) {
    return null;
  }

  const totalSteps = steps.length;

  const getHeaderText = () => {
    if (isStreaming) {
      const lastStep = steps[steps.length - 1];
      if (lastStep) {
        const msg = lastStep.message || "Processing...";
        return msg.length > 60 ? msg.substring(0, 60) + "..." : msg;
      }
      return "Thinking...";
    }
    return `Reasoned through ${totalSteps} steps`;
  };

  return (
    <div style={styles.wrapper}>
      {/* Collapsible Header */}
      <button
        style={{
          ...styles.header,
          ...(isExpanded ? styles.headerExpanded : {})
        }}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div style={styles.headerLeft}>
          {isStreaming ? (
            <div style={styles.spinnerContainer}>
              <div style={styles.spinner}></div>
            </div>
          ) : (
            <div style={styles.completedIcon}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path
                  d="M13.5 4.5L6 12L2.5 8.5"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
          <span style={styles.headerText}>{getHeaderText()}</span>
        </div>

        <div style={styles.headerRight}>
          {!isStreaming && (
            <span style={styles.stepCount}>{totalSteps} steps</span>
          )}
          <div style={{
            ...styles.chevronWrapper,
            transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </button>

      {/* Animated Content Container */}
      <div
        style={{
          ...styles.contentWrapper,
          maxHeight: isExpanded ? `${Math.min(contentHeight + 20, 320)}px` : '0px',
          opacity: isExpanded ? 1 : 0,
        }}
        ref={contentRef}
      >
        <div style={styles.contentInner} ref={innerRef}>
          {steps.map((step, index) => (
            <StepItem
              key={`${step.type}-${index}`}
              step={step}
              index={index}
              isLast={index === steps.length - 1}
              isStreaming={isStreaming}
              ref={index === steps.length - 1 ? lastStepRef : null}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const StepItem = React.forwardRef(({ step, index, isLast, isStreaming }, ref) => {
  const isActive = isLast && isStreaming && !step.completed;

  const getStepConfig = () => {
    switch (step.type) {
      case 'react_thinking':
        return {
          icon: '💭',
          label: 'Thinking',
          color: '#a78bfa'
        };
      case 'react_action':
        return {
          icon: '⚡',
          label: step.tool ? `Using ${step.tool}` : 'Taking action',
          color: '#f59e0b'
        };
      case 'react_observation':
        return {
          icon: '👁️',
          label: 'Observed',
          color: '#3b82f6'
        };
      case 'react_finishing':
        return {
          icon: '✨',
          label: 'Finalizing',
          color: '#10b981'
        };
      case 'step_started':
        return {
          icon: '◐',
          label: step.step || 'Processing',
          color: '#6366f1'
        };
      case 'step_completed':
        return {
          icon: '●',
          label: step.step || 'Completed',
          color: '#10b981'
        };
      default:
        return {
          icon: '→',
          label: 'Step',
          color: '#71717a'
        };
    }
  };

  const config = getStepConfig();

  return (
    <div
      ref={ref}
      style={{
        ...styles.stepItem,
        animation: `fadeSlideIn 0.3s ease-out ${index * 0.05}s both`,
      }}
    >
      {/* Timeline connector */}
      <div style={styles.timeline}>
        <div style={{
          ...styles.timelineDot,
          backgroundColor: isActive ? 'transparent' : (step.completed ? '#10b981' : config.color),
          borderColor: config.color,
        }}>
          {isActive && (
            <div style={styles.timelineSpinner}></div>
          )}
        </div>
        {!isLast && (
          <div style={{
            ...styles.timelineLine,
            backgroundColor: step.completed ? '#10b981' : '#3f3f46'
          }}></div>
        )}
      </div>

      {/* Content */}
      <div style={styles.stepContent}>
        <div style={styles.stepHeader}>
          <span style={styles.stepIcon}>{step.icon || config.icon}</span>
          <span style={{
            ...styles.stepLabel,
            color: config.color
          }}>{config.label}</span>
        </div>
        {step.message && (
          <p style={{
            ...styles.stepMessage,
            opacity: step.completed ? 0.7 : 1
          }}>
            {step.message}
          </p>
        )}
      </div>
    </div>
  );
});

StepItem.displayName = 'StepItem';

const styles = {
  wrapper: {
    width: "100%",
    marginBottom: "16px",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.06)",
    backgroundColor: "rgba(255,255,255,0.02)",
    color: "#e4e4e7",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none",
  },
  headerExpanded: {
    borderBottomLeftRadius: "0",
    borderBottomRightRadius: "0",
    borderBottom: "none",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: 1,
    minWidth: 0,
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
  },
  spinnerContainer: {
    width: "16px",
    height: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    width: "14px",
    height: "14px",
    border: "2px solid rgba(167, 139, 250, 0.2)",
    borderTopColor: "#a78bfa",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  completedIcon: {
    width: "16px",
    height: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderRadius: "50%",
  },
  headerText: {
    fontSize: "13px",
    color: "#a1a1aa",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontWeight: "400",
  },
  stepCount: {
    fontSize: "11px",
    color: "#71717a",
    padding: "2px 8px",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: "10px",
  },
  chevronWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#52525b",
    transition: "transform 0.25s ease",
  },
  contentWrapper: {
    overflow: "hidden",
    transition: "max-height 0.3s ease, opacity 0.25s ease",
    borderLeft: "1px solid rgba(255,255,255,0.06)",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    borderBottomLeftRadius: "12px",
    borderBottomRightRadius: "12px",
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  contentInner: {
    padding: "12px 16px",
    maxHeight: "280px",
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "#3f3f46 transparent",
  },
  stepItem: {
    display: "flex",
    gap: "12px",
    paddingBottom: "12px",
  },
  timeline: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "16px",
    flexShrink: 0,
  },
  timelineDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    border: "2px solid",
    backgroundColor: "transparent",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  timelineSpinner: {
    width: "10px",
    height: "10px",
    border: "2px solid transparent",
    borderTopColor: "#a78bfa",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    position: "absolute",
  },
  timelineLine: {
    width: "2px",
    flex: 1,
    marginTop: "4px",
    borderRadius: "1px",
    transition: "background-color 0.3s ease",
  },
  stepContent: {
    flex: 1,
    minWidth: 0,
    paddingTop: "0px",
  },
  stepHeader: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "2px",
  },
  stepIcon: {
    fontSize: "12px",
    lineHeight: 1,
  },
  stepLabel: {
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  stepMessage: {
    fontSize: "13px",
    color: "#d4d4d8",
    lineHeight: "1.5",
    margin: "4px 0 0 0",
    wordBreak: "break-word",
    transition: "opacity 0.2s ease",
  },
};

// Inject CSS animations
if (typeof document !== "undefined") {
  const styleId = 'thinking-indicator-styles-v3';
  if (!document.getElementById(styleId)) {
    const styleSheet = document.createElement("style");
    styleSheet.id = styleId;
    styleSheet.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes fadeSlideIn {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
    document.head.appendChild(styleSheet);
  }
}

export default ThinkingIndicator;
