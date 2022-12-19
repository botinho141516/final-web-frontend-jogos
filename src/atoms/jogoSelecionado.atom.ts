import { atom } from "recoil";
import { ObterJogosInterface } from "../interfaces";

const jogoSelecionadoAtom = atom<ObterJogosInterface | null>({
  key: "jogoSelecionadoAtom",
  default: null,
});

export default jogoSelecionadoAtom;
