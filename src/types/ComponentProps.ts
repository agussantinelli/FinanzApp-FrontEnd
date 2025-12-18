export interface NeonLoaderProps {
    message?: string;
    size?: number;
}

export interface FormStatusProps {
    successMessage?: string | null;
    errorMessage?: string | null;
}

export interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
