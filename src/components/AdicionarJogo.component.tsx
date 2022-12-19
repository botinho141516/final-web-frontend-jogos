import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import consoleIdSelecionadoAtom from "../atoms/consoleSelecionado.atom";
import { GeneroModel, IOption } from "../interfaces";
import appFetch from "../services/appFetch.service";
import AutoCompleteSelect from "./AutoCompleteSelect";
import UploadComponent from "./Upload.component";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #eee;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  background-color: #fff;
  padding: 60px;
  border-radius: 4px;
  box-shadow: 5px 3px 13px 3px rgba(0, 0, 0, 0.52);
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  margin-bottom: 50px;
  font-size: 36px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Input = styled.input`
  margin-bottom: 10px;
  min-width: 400px;
  font-size: 18px;
  padding: 5px;
  padding-left: 8px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 70%;
  margin-top: 30px;
`;

const Button = styled.button`
  margin-bottom: 20px;
  min-width: 200px;
  display: flex;
  justify-content: center;
  font-size: 120%;
  background-color: #26b9eb;
  border-color: #176079;
  cursor: pointer;
`;
interface AdicionarJogoComponentProps {
  onCreate: () => void;
}

const AdicionarJogoComponent = (props: AdicionarJogoComponentProps) => {
  const { onCreate } = props;
  const [nome, setNome] = useState<string>("");
  const [resumo, setResumo] = useState<string>("");
  const [desenvolvedor, setDesenvolvedor] = useState<string>("");
  const [genero, setGenero] = useState<IOption | null>(null);
  const [imagem, setImagem] = useState<string>();
  const [generos, setGeneros] = useState<GeneroModel[]>();

  const selectedConsoleId = useRecoilValue(consoleIdSelecionadoAtom);

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

  async function handleCriar() {
    if (!genero) return;
    const jogoCriado = await appFetch("/jogo", {
      method: "POST",
      body: {
        nome,
        resumo,
        imagem,
        consoleId: selectedConsoleId,
        desenvolvedor,
        generoId: genero._id,
      },
    });

    if (jogoCriado.status === 201) {
      toast("Jogo cadatrado com sucesso", {
        type: "success",
        pauseOnFocusLoss: false,
        position: "bottom-right",
      });
      onCreate();
      return;
    }

    return toast(jogoCriado.mensagem, {
      type: "error",
      pauseOnFocusLoss: false,
      position: "bottom-right",
    });
  }

  function handleImageSubmition(imagemUpload: string) {
    console.log(imagemUpload);
    setImagem(imagemUpload);
  }

  return (
    <PageContainer>
      <ContentContainer>
        <TitleContainer>Adicionar Jogo</TitleContainer>
        <InputContainer>
          <Input
            value={nome}
            placeholder="Titulo"
            onChange={(e) => setNome(e.target.value)}
          />
          <Input
            value={resumo}
            placeholder="Resumo"
            onChange={(e) => setResumo(e.target.value)}
          />
          <Input
            value={desenvolvedor}
            placeholder="Desenvolvedor"
            onChange={(e) => setDesenvolvedor(e.target.value)}
          />
          <AutoCompleteSelect
            width={100}
            placeholder="Gênero"
            opcoes={generos}
            onChange={(e) => setGenero(e)}
          />
          <UploadComponent onFileSubmit={handleImageSubmition} />
          <ButtonContainer>
            <Button onClick={handleCriar}>Criar</Button>
          </ButtonContainer>
        </InputContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default AdicionarJogoComponent;
