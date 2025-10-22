
export function formatarValorBr(valorEmCentavos?: number): string {
  if (valorEmCentavos === undefined || valorEmCentavos === null) {
    return 'erro na con.'; 
  }

  const valorEmReais = valorEmCentavos / 100;
  return valorEmReais.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}


export function formatarValorGraph(valorEmCentavos: number): string {
  const valorEmReais = valorEmCentavos ;
  return valorEmReais.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

 export function formatValue(value: number): string {
   return (value / 100).toLocaleString("pt-BR", {
     minimumFractionDigits: 2,
     maximumFractionDigits: 2,
   });
 }