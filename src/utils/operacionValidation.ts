import { OperacionResponseDTO, TipoOperacion } from "@/types/Operacion";

export interface OperationEvent {
    id?: string;
    fecha: string | Date;
    tipo: TipoOperacion | string;
    cantidad: number;
    activoSymbol?: string;
}


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

        timeline = timeline.filter(o => o.id !== targetOpId);

        timeline.push(targetOp);
    } else if (action === 'CREATE') {
        timeline.push(targetOp);
    }


    timeline.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());


    let balance = 0;
    const ERROR_EPSILON = 0.000001;

    for (const op of timeline) {

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
