
export const handleChange = (text: string, setValorCentavos: React.Dispatch<React.SetStateAction<number>>) => {
        const numeros = text.replace(/\D/g, '');
        const numeroComoInt = parseInt(numeros || '0', 10);
        setValorCentavos(Math.max(numeroComoInt, 0));
    };