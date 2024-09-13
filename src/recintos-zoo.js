class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: ['macaco', 'macaco', 'macaco'] },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: ['gazela'] },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: ['leão'] }
        ];

        this.animais = {
            'LEAO': { tamanho: 3, bioma: 'savana', carnívoro: true },
            'LEOPARDO': { tamanho: 2, bioma: 'savana', carnívoro: true },
            'CROCODILO': { tamanho: 3, bioma: 'rio', carnívoro: true },
            'MACACO': { tamanho: 1, bioma: 'savana ou floresta', carnívoro: false },
            'GAZELA': { tamanho: 2, bioma: 'savana', carnívoro: false },
            'HIPOPOTAMO': { tamanho: 4, bioma: 'savana e rio', carnívoro: false }
        };
    }

    analisaRecintos(animal, quantidade) {
        const tipoAnimal = animal.toUpperCase();

        // Validar tipo de animal
        if (!this.animais[tipoAnimal]) {
            return { erro: 'Animal inválido' };
        }

        // Validar quantidade
        if (typeof quantidade !== 'number' || quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: 'Quantidade inválida' };
        }

        const infoAnimal = this.animais[tipoAnimal];
        const recintosViaveis = [];

        this.recintos.forEach((recinto) => {
            if (this.ehViavelParaAnimal(recinto, infoAnimal, quantidade)) {
                const espacoOcupado = this.calculaEspacoOcupado(recinto, infoAnimal, quantidade);
                const espacoLivre = recinto.tamanho - espacoOcupado;
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanho})`);
            }
        });

        if (recintosViaveis.length > 0) {
            return { recintosViaveis: recintosViaveis.sort() };
        } else {
            return { erro: 'Não há recinto viável' };
        }
    }

    ehViavelParaAnimal(recinto, animal, quantidade) {
        // Verifica se o bioma do recinto é adequado para o animal
        const biomasAceitos = animal.bioma.split(' ou ');
        if (!biomasAceitos.some(bioma => recinto.bioma.includes(bioma))) {
            return false;
        }

        // Verifica se há espaço suficiente
        const espacoOcupado = this.calculaEspacoOcupado(recinto, animal, quantidade);
        if (espacoOcupado > recinto.tamanho) {
            return false;
        }

        // Regras adicionais de convivência
        if (animal.carnívoro) {
            if (quantidade > 1 || recinto.animais.some(a => this.animais[a.toUpperCase()].carnívoro)) {
                return false;
            }
        } else if (animal.bioma.includes('savana') && quantidade === 1 && recinto.animais.length === 0) {
            return false;
        } else if (animal.bioma === 'savana e rio' && !recinto.bioma.includes('savana e rio')) {
            return false;
        }

        return true;
    }

    calculaEspacoOcupado(recinto, animal, quantidade) {
        // Calcula o espaço ocupado pelos animais existentes
        const espacoAnimaisExistentes = recinto.animais.reduce((total, a) => {
            const info = this.animais[a.toUpperCase()];
            return total + (info ? info.tamanho : 0);
        }, 0);

        // Calcula o espaço ocupado pelos novos animais
        const espacoNovoAnimal = animal.tamanho * quantidade;

        // Calcula o espaço extra se houver mais de uma espécie
        const numEspéciesExistentes = new Set(recinto.animais.map(a => a.toUpperCase())).size;
        const espacoExtra = numEspéciesExistentes > 0 ? 0 : 0; // Aqui deve ser 0, porque não há espa
    }
}