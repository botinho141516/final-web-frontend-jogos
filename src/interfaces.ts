export interface AvaliacaoModel {
  _id: string;
  jogo: string;
  nota: number;
  descricao: string;
}
export interface ConsoleModel {
  _id: string;
  nome: string;
}
export interface DesenvolvedorModel {
  _id: string;
  nome: string;
}
export interface GeneroModel {
  _id: string;
  nome: string;
}

export interface JogoModel {
  _id: string;
  nome: string;
  imagem?: string;
  resumo: string;
  desenvolvedorId: string;
  generoId: string;
  consoleId: string;
}

export interface UsuarioModel {
  _id: string;
  nome: string;
  email: string;
  senha: string;
}

export interface CriarJogoInterface extends Omit<JogoModel, "_id"> {}

export interface ObterJogosInterface extends JogoModel {
  console: ConsoleModel;
  desenvolvedor: DesenvolvedorModel;
  genero: GeneroModel;
  avaliacoes: AvaliacaoModel[];
  notaMedia: number | null;
}

export interface IOption {
  _id: string;
  nome: string;
}
