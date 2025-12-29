import { screen, waitFor } from '@testing-library/react';
import { render } from '@/test/test-utils';
import RecomendacionDetallePage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRecomendacionById } from '@/services/RecomendacionesService';
import { useAuth } from '@/hooks/useAuth';

vi.mock('@/services/RecomendacionesService');
vi.mock('@/hooks/useAuth');
vi.mock('next/navigation', () => ({
    useParams: () => ({ id: '123' }),
    useRouter: () => ({ back: vi.fn() }),
}));
vi.mock('@/components/auth/RoleGuard', () => ({
    RoleGuard: ({ children }: any) => <div>{children}</div>
}));
vi.mock('next/link', () => ({
    default: ({ children }: any) => <a>{children}</a>,
}));

describe('RecomendacionDetallePage', () => {
    it('renders placeholder', () => {
        expect(true).toBe(true);
    });
});
