import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import jogoSelecionadoAtom from "../atoms/jogoSelecionado.atom";
import { AvaliacaoModel } from "../interfaces";
import appFetch from "../services/appFetch.service";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding-top: 120px;
  background-color: #eee;
`;

const ImagemContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  min-height: 100px;
  margin: auto;
`;

const Imagem = styled.img`
  max-width: 220px;
  max-height: 310px;
`;

const TituloContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  width: 100%;
  min-height: 60px;
  font-size: 29px;
`;

const ResumoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  width: 100%;
  min-height: 50px;
  max-width: 70%;
  margin: 0 auto;
  text-align: center;
  word-wrap: break-word;
  font-style: italic;
`;

const CardAvalicoes = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 85%;
  font-size: 24px;
  min-height: 600px;
  margin: auto;
  border-radius: 5px;
  margin-bottom: 40px;
  background-color: #fff;
  box-shadow: 5px 3px 13px 3px rgba(0, 0, 0, 0.52);
  justify-content: space-between;
  padding: 20px;
`;

const AvaliacoesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 25px;
  align-items: center;
  width: 100%;
  font-size: 24px;
  border-radius: 5px;
  margin-bottom: 40px;
  background-color: #fff;
  justify-content: flex-start;
`;
const AvaliacaoIndividualContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 25px;
  align-items: center;
  width: 95%;
  min-height: 80px;
  border-radius: 5px;
  padding: 20px;
  align-items: flex-start;
  margin-bottom: 40px;
  background-color: #fff;
  box-shadow: 5px 3px 13px 3px rgba(0, 0, 0, 0.52);
`;
const AvaliacaoIndividualNota = styled.div`
  font-size: 18px;
`;
const AvaliacaoIndividualComentario = styled.div`
  font-size: 18px;
`;

const NovaAvaliacaoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-self: flex-start;
  justify-content: flex-start;
  align-items: flex-end;
  gap: 30px;
  justify-content: space-between;
  width: 100%;
`;

const NovaAvaliacaoLabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const NovaAvaliacaoLabel = styled.div`
  margin-bottom: 8px;
`;
const NovaAvaliacaoNotaInput = styled.input`
  text-align: center;
  width: 40px;
  padding: 8px;
`;
const NovaAvaliacaoComentarioInput = styled.input`
  padding: 8px;
  width: 80%;
  font-size: 14px;
`;
const NovaAvaliacaoBotaoContainer = styled.div``;
const NovaAvaliacaoBotao = styled.button`
  min-width: 200px;
  display: flex;
  justify-content: center;
  padding: 8px 12px;
  font-size: 120%;
  background-color: #26b9eb;
  border-color: #176079;
  border-radius: 4px;
  color: black;
  cursor: pointer;
`;

function AvaliacoesPage() {
  const jogoSelecionado = useRecoilValue(jogoSelecionadoAtom);
  const navigate = useNavigate();

  const [novaAvalicaoNota, setNovaAvalicaoNota] = useState(0);
  const [novaAvalicaoComentario, setNovaAvalicaoComentario] = useState("");
  const [avaliacoesAdicionadas, setAvaliacoesAdicionadas] = useState<
    AvaliacaoModel[]
  >([]);

  useEffect(() => {
    console.log(jogoSelecionado);
    if (!jogoSelecionado) {
      return navigate("/jogos");
    }
  }, [jogoSelecionado]);

  function isLogged() {
    return !!localStorage.getItem("JWT_TOKEN");
  }

  async function handleEnviarAvaliacao() {
    if (!jogoSelecionado) return;

    const resposta = await appFetch("/avaliacao", {
      method: "POST",
      body: {
        jogoId: jogoSelecionado._id,
        nota: novaAvalicaoNota > 10 ? 10 : novaAvalicaoNota,
        descricao: novaAvalicaoComentario,
      },
    });

    if (resposta.status === 200) {
      toast("Avaliacao criada", {
        type: "success",
        position: "bottom-right",
        pauseOnFocusLoss: false,
      });
      setAvaliacoesAdicionadas((prev) => [...prev, resposta.data]);
      return;
    }
    toast(resposta.mensagem, {
      type: "error",
      position: "bottom-right",
      pauseOnFocusLoss: false,
    });
  }

  function redirectBack() {
    if (!jogoSelecionado) navigate("/jogos");
  }
  if (!jogoSelecionado) {
    return <div onLoad={redirectBack}></div>;
  }

  return (
    <PageContainer>
      {jogoSelecionado?.imagem && (
        <ImagemContainer>
          <Imagem src={jogoSelecionado.imagem} />
        </ImagemContainer>
      )}
      <TituloContainer>{jogoSelecionado?.nome}</TituloContainer>
      <ResumoContainer>{jogoSelecionado?.resumo}</ResumoContainer>

      <CardAvalicoes>
        <AvaliacoesContainer>
          {[...jogoSelecionado.avaliacoes, ...avaliacoesAdicionadas].map(
            (avaliacao) => (
              <AvaliacaoIndividualContainer key={avaliacao._id}>
                <AvaliacaoIndividualNota>
                  Nota: {avaliacao.nota}
                </AvaliacaoIndividualNota>
                <AvaliacaoIndividualComentario>
                  {avaliacao.descricao}
                </AvaliacaoIndividualComentario>
              </AvaliacaoIndividualContainer>
            )
          )}
        </AvaliacoesContainer>
        {isLogged() && (
          <NovaAvaliacaoContainer>
            <div>
              <NovaAvaliacaoLabelContainer>
                <NovaAvaliacaoLabel>Nota:</NovaAvaliacaoLabel>
                <NovaAvaliacaoNotaInput
                  value={novaAvalicaoNota}
                  onChange={(e) => setNovaAvalicaoNota(Number(e.target.value))}
                  type={"number"}
                  min="0"
                  max="10"
                />
              </NovaAvaliacaoLabelContainer>
              <NovaAvaliacaoLabelContainer>
                <NovaAvaliacaoLabel>Comentário:</NovaAvaliacaoLabel>
                <NovaAvaliacaoComentarioInput
                  value={novaAvalicaoComentario}
                  onChange={(e) => setNovaAvalicaoComentario(e.target.value)}
                />
              </NovaAvaliacaoLabelContainer>
            </div>
            <NovaAvaliacaoBotaoContainer>
              <NovaAvaliacaoBotao onClick={handleEnviarAvaliacao}>
                Enviar Avaliacao
              </NovaAvaliacaoBotao>
            </NovaAvaliacaoBotaoContainer>
          </NovaAvaliacaoContainer>
        )}
      </CardAvalicoes>
    </PageContainer>
  );
}

export default AvaliacoesPage;
