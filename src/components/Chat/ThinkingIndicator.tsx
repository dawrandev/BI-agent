import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { ThinkingIndicatorProps, StreamChunk } from '../../types';

interface StepConfig {
  icon: string;
  label: string;
  color: string;
}

interface StepItemProps {
  step: StreamChunk;
  index: number;
  isLast: boolean;
  isStreaming: boolean;
}

const StepItem = forwardRef<HTMLDivElement, StepItemProps>(
  ({ step, index, isLast, isStreaming }, ref) => {
    const isActive = isLast && isStreaming && !step.completed;

    const getStepConfig = (): StepConfig => {
      switch (step.type) {
        case 'react_thinking':
          return { icon: '💭', label: 'Thinking', color: '#a78bfa' };
        case 'react_action':
          return {
            icon: '⚡',
            label: step.tool ? `Using ${step.tool}` : 'Taking action',
            color: '#f59e0b',
          };
        case 'react_observation':
          return { icon: '👁️', label: 'Observed', color: '#3b82f6' };
        case 'react_finishing':
          return { icon: '✨', label: 'Finalizing', color: '#10b981' };
        case 'step_started':
          return { icon: '◐', label: step.step || 'Processing', color: '#6366f1' };
        case 'step_completed':
          return { icon: '●', label: step.step || 'Completed', color: '#10b981' };
        default:
          return { icon: '→', label: 'Step', color: '#71717a' };
      }
    };

    const config = getStepConfig();

    return (
      <div
        ref={ref}
        className="flex gap-3 pb-3 animate-fade-slide-in"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        {/* Timeline connector */}
        <div className="flex flex-col items-center w-4 flex-shrink-0">
          <div
            className="w-2.5 h-2.5 rounded-full border-2 relative flex items-center justify-center transition-all duration-200"
            style={{
              backgroundColor: isActive ? 'transparent' : step.completed ? '#10b981' : config.color,
              borderColor: config.color,
            }}
          >
            {isActive && (
              <div className="absolute w-2.5 h-2.5 border-2 border-transparent border-t-[#a78bfa] rounded-full animate-spin-slow" />
            )}
          </div>
          {!isLast && (
            <div
              className="w-0.5 flex-1 mt-1 rounded-sm transition-colors duration-300"
              style={{ backgroundColor: step.completed ? '#10b981' : '#3f3f46' }}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-xs leading-none">{step.icon || config.icon}</span>
            <span
              className="text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: config.color }}
            >
              {config.label}
            </span>
          </div>
          {step.message && (
            <p
              className="text-sm text-zinc-300 leading-normal mt-1 break-words transition-opacity duration-200"
              style={{ opacity: step.completed ? 0.7 : 1 }}
            >
              {step.message}
            </p>
          )}
        </div>
      </div>
    );
  }
);

StepItem.displayName = 'StepItem';

const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ steps = [], isStreaming = true }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const lastStepRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest step when new steps arrive
  useEffect(() => {
    if (lastStepRef.current && isExpanded && isStreaming) {
      lastStepRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

  const getHeaderText = (): string => {
    if (isStreaming) {
      const lastStep = steps[steps.length - 1];
      if (lastStep) {
        const msg = lastStep.message || 'Processing...';
        return msg.length > 60 ? msg.substring(0, 60) + '...' : msg;
      }
      return 'Thinking...';
    }
    return `Reasoned through ${totalSteps} steps`;
  };

  return (
    <div className="w-full mb-4 font-sans">
      {/* Collapsible Header */}
      <button
        className={`
          flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl
          border border-white/5 bg-white/[0.02] text-zinc-200 text-sm
          cursor-pointer transition-all duration-200 outline-none
          ${isExpanded ? 'rounded-b-none border-b-0' : ''}
        `}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {isStreaming ? (
            <div className="w-4 h-4 flex items-center justify-center">
              <div className="w-3.5 h-3.5 border-2 border-purple-400/20 border-t-purple-400 rounded-full animate-spin-slow" />
            </div>
          ) : (
            <div className="w-4 h-4 flex items-center justify-center bg-emerald-500/15 rounded-full">
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
          <span className="text-sm text-zinc-400 overflow-hidden text-ellipsis whitespace-nowrap font-normal">
            {getHeaderText()}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {!isStreaming && (
            <span className="text-[11px] text-zinc-500 px-2 py-0.5 bg-white/5 rounded-lg">
              {totalSteps} steps
            </span>
          )}
          <div
            className={`
              flex items-center justify-center text-zinc-600
              transition-transform duration-300
              ${isExpanded ? 'rotate-0' : '-rotate-90'}
            `}
          >
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
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 border-x border-b border-white/5 rounded-b-xl bg-black/15"
        style={{
          maxHeight: isExpanded ? `${Math.min(contentHeight + 20, 320)}px` : '0px',
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div ref={innerRef} className="p-3 px-4 max-h-[280px] overflow-y-auto scrollbar-thin">
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

export default ThinkingIndicator;
