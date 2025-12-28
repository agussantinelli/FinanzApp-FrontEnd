import { OperacionResponseDTO, TipoOperacion } from "@/types/Operacion";

export interface OperationEvent {
    id?: string; // Optional, to identify existing vs new
    fecha: string | Date;
    tipo: TipoOperacion | string; // Allow "Compra" string for compatibility
    cantidad: number;
    activoSymbol?: string; // For error messages
}

/**
 * Validates that the sequence of operations never results in a negative balance.
 * Returns { valid: true } or { valid: false, message: string }.
 * 
 * @param currentOps - List of EXISTING operations (immutable, will be cloned)
 * @param action - The action being performed ('CREATE', 'EDIT', 'DELETE')
 * @param targetOp - The operation being added or modified (contains the new values)
 * @param targetOpId - The ID of the operation being edited/deleted (required for EDIT/DELETE)
 */
export function validateTemporalConsistency(
    currentOps: OperationEvent[],
    action: 'CREATE' | 'EDIT' | 'DELETE',
    targetOp: OperationEvent,
    targetOpId?: string
): { valid: boolean; message?: string } {

    // 1. Prepare the timeline
    let timeline = [...currentOps];

    if (action === 'DELETE') {
        if (!targetOpId) throw new Error("targetOpId required for DELETE");
        timeline = timeline.filter(o => o.id !== targetOpId);
    } else if (action === 'EDIT') {
        if (!targetOpId) throw new Error("targetOpId required for EDIT");
        // Remove old version
        timeline = timeline.filter(o => o.id !== targetOpId);
        // Add new version
        timeline.push(targetOp);
    } else if (action === 'CREATE') {
        timeline.push(targetOp);
    }

    // 2. Sort by Date Ascending
    timeline.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    // 3. Walk the timeline
    let balance = 0;
    const ERROR_EPSILON = 0.000001; // Tolerance for float math

    for (const op of timeline) {
        // Normalize type
        const isCompra = op.tipo === TipoOperacion.Compra || op.tipo === "Compra";

        if (isCompra) {
            balance += op.cantidad;
        } else {
            balance -= op.cantidad;
        }

        if (balance < -ERROR_EPSILON) {
            const dateStr = new Date(op.fecha).toLocaleDateString();
            return {
                valid: false,
                message: `Error de consistencia temporal: En fecha ${dateStr}, el saldo de ${targetOp.activoSymbol || 'el activo'} sería negativo (${balance.toFixed(4)}) tras esta operación. No puedes vender/eliminar lo que no tenías en ese momento.`
            };
        }
    }

    return { valid: true };
}
