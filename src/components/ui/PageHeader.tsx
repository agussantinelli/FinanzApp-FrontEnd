import React from 'react';
import styles from './styles/PageHeader.module.css';

interface PageHeaderProps {
    title: string;
    subtitle: string;
    description?: string;
}

export default function PageHeader({ title, subtitle, description }: PageHeaderProps) {
    return (
        <div className={styles.headerContainer}>
            <span className={styles.subtitle}>
                {subtitle}
            </span>
            <h1 className={styles.title}>
                {title}
            </h1>
            {description && (
                <p className={styles.description}>
                    {description}
                </p>
            )}
        </div>
    );
}
