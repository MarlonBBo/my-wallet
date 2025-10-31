export function formatToBR(dateStr?: string): string {
  if(dateStr){
    const date = new Date(dateStr); 

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }else{
    return "data inválida"
  }
}

