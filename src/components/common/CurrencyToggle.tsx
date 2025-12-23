import * as React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

interface CurrencyToggleProps {
    currency: 'ARS' | 'USD';
    onCurrencyChange: (newCurrency: 'ARS' | 'USD') => void;
}

export const CurrencyToggle: React.FC<CurrencyToggleProps> = ({ currency, onCurrencyChange }) => {
    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newCurrency: 'ARS' | 'USD' | null,
    ) => {
        if (newCurrency !== null) {
            onCurrencyChange(newCurrency);
        }
    };

    return (
        <ToggleButtonGroup
            value={currency}
            exclusive
            onChange={handleChange}
            aria-label="currency"
            size="small"
            sx={{ height: 32 }}
        >
            <ToggleButton
                value="ARS"
                aria-label="ARS"
                sx={{
                    fontSize: '0.75rem',
                    color: 'success.main',
                    borderColor: 'success.main',
                    '&.Mui-selected': {
                        color: 'white',
                        backgroundColor: 'success.main',
                        borderColor: 'success.main',
                        '&:hover': {
                            backgroundColor: 'success.dark',
                        }
                    }
                }}
            >
                ARS
            </ToggleButton>
            <ToggleButton
                value="USD"
                aria-label="USD"
                sx={{
                    fontSize: '0.75rem',
                    color: 'success.main',
                    borderColor: 'success.main',
                    '&.Mui-selected': {
                        color: 'white',
                        backgroundColor: 'success.main',
                        borderColor: 'success.main',
                        '&:hover': {
                            backgroundColor: 'success.dark',
                        }
                    }
                }}
            >
                USD
            </ToggleButton>
        </ToggleButtonGroup>
    );
};
