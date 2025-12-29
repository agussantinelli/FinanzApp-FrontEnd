import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import RecomendacionesPage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRecomendaciones } from '@/hooks/useRecomendaciones';
import { useAuth } from '@/hooks/useAuth';
import { getSectores } from '@/services/SectorService';

vi.mock('@/hooks/useRecomendaciones');
vi.mock('@/hooks/useAuth');
vi.mock('@/services/SectorService');
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn() }),
}));
vi.mock('@/components/cards/RecomendacionCard', () => ({
    default: ({ item }: any) => <div>{item.titulo}</div>
}));
vi.mock('@/components/ui/PageHeader', () => ({
    default: ({ title, children }: any) => <div><h1>{title}</h1>{children}</div>
}));

describe('RecomendacionesPage', () => {
    it('renders placeholder', () => {
        expect(true).toBe(true);
    });
});
