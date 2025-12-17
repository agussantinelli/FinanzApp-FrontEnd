export const getAvatarColor = (tipo: string) => {
    switch (tipo?.toLowerCase()) {
        case 'accion':
        case 'acciones':
            return "#0400ffff";
        case 'cedear':
        case 'cedears':
            return "#a73bffff";
        case 'bono':
        case 'bonos':
            return "#4caf50";
        case 'obligacion negociable':
        case 'on':
            return "#ff9800";
        case 'fci':
            return "#63deeeff";
        case 'cripto':
        case 'crypto':
            return "#f14ae4ff";
        default:
            return "#757575";
    }
};
