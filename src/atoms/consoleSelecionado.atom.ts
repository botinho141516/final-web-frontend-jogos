import { atom } from "recoil";

const consoleIdSelecionadoAtom = atom<string>({
  key: "consoleIdSelecionadoAtom",
  default: "",
});

export default consoleIdSelecionadoAtom;
