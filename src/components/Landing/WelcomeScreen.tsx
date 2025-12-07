import React from 'react';
import { WelcomeScreenProps } from '../../types';

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold mb-3 bg-gradient-accent bg-clip-text text-transparent">
        Welcome to BI Agent
      </h1>
      <p className="text-lg text-text-subtle mb-8">
        Chat with your Odoo ERP data
      </p>
      <button
        className="btn-primary px-10 py-3.5 text-base rounded-lg"
        onClick={onGetStarted}
      >
        Get Started
      </button>
    </div>
  );
};

export default WelcomeScreen;
