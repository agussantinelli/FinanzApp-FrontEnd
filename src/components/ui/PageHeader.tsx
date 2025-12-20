import React from 'react';
import styles from './styles/PageHeader.module.css';

interface PageHeaderProps {
    title: string;
    subtitle: string;
    description?: string;
    children?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, description, children }: PageHeaderProps) {
    return (
        <div className={styles.headerContainer}>
            <div className={styles.content}>
                <h1 className={styles.title}>
                    {title}
                </h1>
                {description && (
                    <p className={styles.description}>
                        {description}
                    </p>
                )}
            </div>
            {children && (
                <div className={styles.actions}>
                    {children}
                </div>
            )}
        </div>
    );
}
