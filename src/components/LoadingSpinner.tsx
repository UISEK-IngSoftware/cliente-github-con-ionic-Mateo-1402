import React from 'react';
import { IonSpinner } from '@ionic/react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
    isOpen: boolean;
}   

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="loading-overlay">
            <div className="spinner-container">
                <IonSpinner name="crescent" color="primary" className="spinner" />
            </div>
        </div>
    );
};

export default LoadingSpinner;