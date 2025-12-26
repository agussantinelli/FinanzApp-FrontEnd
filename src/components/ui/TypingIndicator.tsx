import React from 'react';
import { Box } from '@mui/material';
import styles from './styles/TypingIndicator.module.css';

interface TypingIndicatorProps {
    className?: string;
    dotColor?: string; // Optional prop to override color via inline styles if needed
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ className }) => {
    return (
        <div className={`${styles.container} ${className || ''}`}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
        </div>
    );
};
