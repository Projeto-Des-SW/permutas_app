export function parseSolicitationStatus(status){
    if(status === 'confirmed') return 'Confirmado';
    if(status === 'declined') return 'Negado';
    if(status === 'pending') return 'Pendente';
}