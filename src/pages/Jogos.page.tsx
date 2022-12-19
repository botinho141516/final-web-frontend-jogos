import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import consoleIdSelecionadoAtom from "../atoms/consoleSelecionado.atom";
import jogoSelecionadoAtom from "../atoms/jogoSelecionado.atom";
import AdicionarJogoComponent from "../components/AdicionarJogo.component";
import AutoCompleteSelect from "../components/AutoCompleteSelect";
import AutocompleteSelect from "../components/AutoCompleteSelect";
import { useModal } from "../components/Modal";
import {
  DesenvolvedorModel,
  GeneroModel,
  IOption,
  ObterJogosInterface,
} from "../interfaces";
import appFetch from "../services/appFetch.service";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 80vh;
  background-color: #eee;
  padding-top: 120px;
  padding-bottom: 80px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 0 auto;
  width: 80%;
`;

const AutoCompleteContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 auto;
  width: 95%;
`;

const BuscarButton = styled.button`
  margin-bottom: 20px;
  min-width: 100px;
  display: flex;
  justify-content: center;
  font-size: 120%;
  padding: 5px;
  background-color: #26b9eb;
  border-color: #176079;
  cursor: pointer;
`;

const AdicionarJogoContainer = styled.div`
  margin: 0 auto;
`;
const AdicionarJogoBotao = styled.button`
  margin-bottom: 20px;
  min-width: 100px;
  display: flex;
  justify-content: center;
  font-size: 120%;
  padding: 5px;
  background-color: #26b9eb;
  border-color: #176079;
  cursor: pointer;
`;

const JogoCard = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  width: 30%;
  padding: 30px;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 5px 3px 13px 3px rgba(0, 0, 0, 0.52);
  margin-top: 40px;
`;

const JogoCardImagem = styled.img`
  max-width: 220px;
  max-height: 310px;
`;

const JogoCardTituloContainer = styled.div`
  padding: 10px;
  font-size: 22px;
  font-weight: bold;
`;

const JogoCardResumo = styled.div`
  font-size: 15px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const JogoCardGenero = styled.div`
  font-style: italic;
  padding: 5px;
  padding-top: 0px;
  font-size: 19px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const JogoCardDesenvolvedor = styled.div`
  font-size: 22px;
  padding-bottom: 10px;
  font-weight: 500;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const VerTodosButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: auto;
  width: 30%;
  padding: 30px;
  border: 3px solid black;
  cursor: pointer;
`;
const VerTodosButton = styled.button`
  border: none;
  font-size: 28px;
  color: black;
`;

function JogosPage() {
  const [jogos, setJogos] = useState<ObterJogosInterface[]>([]);
  const [jogosFiltrados, setJogosFiltrados] = useState<ObterJogosInterface[]>(
    []
  );
  const [limite, setLimite] = useState<number>(3);
  const [filtroTitulo, setFiltroTitulo] = useState<IOption | null>();
  const [filtroDesenvolvedor, setFiltroDesenvolvedor] =
    useState<IOption | null>();
  const [filtroGenero, setFiltroGenero] = useState<IOption | null>();
  const [desenvolvedores, setDesenvolvedores] = useState<DesenvolvedorModel[]>(
    []
  );
  const [generos, setGeneros] = useState<GeneroModel[]>([]);
  const selectedConsole = useRecoilValue(consoleIdSelecionadoAtom);
  const setJogoSelecionado = useSetRecoilState(jogoSelecionadoAtom);

  const [mode, setMode] = useState<"read" | "create">("read");

  const modal = useModal();
  const navigate = useNavigate();
  useEffect(() => {
    if (!selectedConsole) {
      toast("Selecione um console", {
        type: "info",
        pauseOnFocusLoss: false,
      });
      return navigate("/consoles");
    }

    const queryParams = new URLSearchParams();
    queryParams.append("consoleId", selectedConsole);

    appFetch(`/jogo?${queryParams}`)
      .then((resposta) => {
        setJogos(resposta.data);
        setJogosFiltrados(resposta.data);
      })
      .catch((erro) => {
        toast(erro.message, {
          type: "error",
          position: "bottom-right",
          pauseOnFocusLoss: false,
        });
      });
  }, [selectedConsole]);

  useEffect(() => {
    appFetch(`/desenvolvedor`)
      .then((resposta) => {
        setDesenvolvedores(resposta.data);
      })
      .catch((erro) => {
        toast(erro.message, {
          type: "error",
          position: "bottom-right",
          pauseOnFocusLoss: false,
        });
      });
  }, []);

  useEffect(() => {
    appFetch(`/genero`)
      .then((resposta) => {
        setGeneros(resposta.data);
      })
      .catch((erro) => {
        toast(erro.message, {
          type: "error",
          position: "bottom-right",
          pauseOnFocusLoss: false,
        });
      });
  }, []);

  function handleVerTodos() {
    setLimite(jogos.length + 1);
  }

  function isLogged() {
    return !!localStorage.getItem("JWT_TOKEN");
  }

  function handleBuscar() {
    const queryParams = new URLSearchParams();
    queryParams.append("consoleId", selectedConsole);
    if (filtroTitulo) queryParams.append("nome", filtroTitulo.nome);
    if (filtroGenero) queryParams.append("generoId", filtroGenero._id);
    if (filtroDesenvolvedor)
      queryParams.append("desenvolvedorId", filtroDesenvolvedor._id);

    appFetch(`/jogo?${queryParams}`)
      .then((resposta) => {
        setJogosFiltrados(resposta.data);
      })
      .catch((erro) => {
        toast(erro.message, {
          type: "error",
          position: "bottom-right",
          pauseOnFocusLoss: false,
        });
      });
  }

  function handleJogoCard(jogo: ObterJogosInterface) {
    setJogoSelecionado(jogo);
    navigate("/avaliacoes");
  }

  function handleFiltroTitulo(opcaoSelecionada: IOption | null) {
    setFiltroTitulo(opcaoSelecionada);
  }
  function handleFiltroDesenvolvedor(opcaoSelecionada: IOption | null) {
    setFiltroDesenvolvedor(opcaoSelecionada);
  }
  function handleFiltroGenero(opcaoSelecionada: IOption | null) {
    setFiltroGenero(opcaoSelecionada);
  }

  function handleAdicionarJogoBotao() {
    setMode("create");
  }

  function handleAdicionarJogo() {
    setMode("read");
    handleBuscar();
  }

  if (mode === "create") {
    return <AdicionarJogoComponent onCreate={handleAdicionarJogo} />;
  }

  if (jogos.length >= limite) {
    return (
      <PageContainer>
        {isLogged() && (
          <AdicionarJogoContainer>
            <AdicionarJogoBotao onClick={handleAdicionarJogoBotao}>
              Adicionar Jogo
            </AdicionarJogoBotao>
          </AdicionarJogoContainer>
        )}
        <ContentContainer>
          {jogosFiltrados.map((jogo, index) => {
            if (index >= limite) return null;
            return (
              <JogoCard onClick={() => handleJogoCard(jogo)}>
                {jogo.imagem && <JogoCardImagem src={jogo.imagem} />}
                <JogoCardTituloContainer>{jogo.nome}</JogoCardTituloContainer>
                <JogoCardGenero>{jogo.genero.nome}</JogoCardGenero>
                <JogoCardDesenvolvedor>
                  {jogo.desenvolvedor.nome}
                </JogoCardDesenvolvedor>
                <JogoCardResumo>{jogo.resumo}</JogoCardResumo>
              </JogoCard>
            );
          })}
          <VerTodosButtonContainer onClick={handleVerTodos}>
            <VerTodosButton>Ver Todos...</VerTodosButton>
          </VerTodosButtonContainer>
        </ContentContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <AutoCompleteContainer>
        <AutoCompleteSelect
          placeholder="Título"
          opcoes={jogos}
          onChange={handleFiltroTitulo}
        />
        <AutoCompleteSelect
          placeholder="Desenvolvedora"
          opcoes={desenvolvedores}
          onChange={handleFiltroDesenvolvedor}
        />
        <AutoCompleteSelect
          placeholder="Gênero"
          opcoes={generos}
          onChange={handleFiltroGenero}
        />
        <BuscarButton onClick={handleBuscar}>Buscar</BuscarButton>
      </AutoCompleteContainer>
      {isLogged() && (
        <AdicionarJogoContainer>
          <AdicionarJogoBotao onClick={handleAdicionarJogoBotao}>
            Adicionar Jogo
          </AdicionarJogoBotao>
        </AdicionarJogoContainer>
      )}
      <ContentContainer>
        {jogosFiltrados.map((jogo, index) => {
          if (index >= limite) return null;
          return (
            <JogoCard key={jogo._id} onClick={() => handleJogoCard(jogo)}>
              {jogo.imagem && (
                <JogoCardImagem src={`data:image/jpeg;base64,${jogo.imagem}`} />
              )}
              <JogoCardTituloContainer>{jogo.nome}</JogoCardTituloContainer>
              <JogoCardGenero>{jogo.genero.nome}</JogoCardGenero>
              <JogoCardDesenvolvedor>
                {jogo.desenvolvedor.nome}
              </JogoCardDesenvolvedor>
              <JogoCardResumo>{jogo.resumo}</JogoCardResumo>
            </JogoCard>
          );
        })}
      </ContentContainer>
    </PageContainer>
  );
}

export default JogosPage;
