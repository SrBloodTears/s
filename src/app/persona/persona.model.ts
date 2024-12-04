export class Grupo {
    public id: number; // ID do grupo
    public nome: number; // Representa a opção em OPCOES_GRUPOS
    public nome_display: string; // Nome legível do grupo

    constructor() {
        this.id = 0;
        this.nome = 0;
        this.nome_display = '';
    }
}

export class Poder {
    public id: number; // ID do poder
    public nome: number; // Representa a opção em OPCOES_PODERES
    public nome_display: string; // Nome legível do poder

    constructor() {
        this.id = 0;
        this.nome = 0;
        this.nome_display = '';
    }
}

export class Personagem {
    public id: number; // ID do personagem
    public nome: string; // Nome do personagem
    public descricao: string; // Descrição detalhada
    public poderes: Poder[]; // Lista de poderes associados
    public grupos: Grupo[]; // Lista de grupos associados
    public raca: number; // Representa a opção em OPCOES_RACAS
    public raca_display: string; // Nome legível da raça
    public foto?: string; // URL da foto, opcional
    public alinhamento: number; // Representa a opção em OPCOES_ALINHAMENTOS
    public alinhamento_display: string; // Nome legível do alinhamento
    public rank: number; // Rank atual
    public rank_display: string; // Nome legível do rank
    public pontosDeCombate: number; // Pontos de combate
    public criador: string; // Criador do personagem
    public usuario?: number; // ID do usuário associado, opcional
    public favorito: boolean; // Indica se é favorito

    constructor() {
        this.id = 0;
        this.nome = '';
        this.descricao = '';
        this.poderes = [];
        this.grupos = [];
        this.raca = 0;
        this.raca_display = '';
        this.foto = undefined;
        this.alinhamento = 0;
        this.alinhamento_display = '';
        this.rank = 0;
        this.rank_display = '';
        this.pontosDeCombate = 0;
        this.criador = '';
        this.usuario = undefined;
        this.favorito = false;
    }
}
