import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { ConsoleModel } from "../interfaces";
import appFetch from "../services/appFetch.service";
import { useSetRecoilState } from "recoil";
import consoleIdSelecionadoAtom from "../atoms/consoleSelecionado.atom";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #eee;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: auto;
  padding: 60px;
  gap: 20px;
`;

const ConsoleCard = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  background-color: #fff;
  width: 30%;
  padding: 60px;
  font-size: 24px;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 5px 3px 13px 3px rgba(0, 0, 0, 0.52);
`;

function ConsolesPage() {
  const [consoles, setConsoles] = useState<ConsoleModel[]>([]);
  const setSelectedConsole = useSetRecoilState(consoleIdSelecionadoAtom);
  const navigate = useNavigate();

  useEffect(() => {
    appFetch("/console")
      .then((resposta) => {
        setConsoles(resposta.data);
      })
      .catch((erro) => {
        toast(erro.message, {
          type: "error",
          position: "bottom-right",
          pauseOnFocusLoss: false,
        });
      });
  }, []);

  const handleConsoleClick = (consoleId: string) => {
    setSelectedConsole(consoleId);
    navigate("/jogos");
  };

  return (
    <PageContainer>
      <ContentContainer>
        {consoles.map((console) => {
          return (
            <ConsoleCard
              key={console._id}
              onClick={() => handleConsoleClick(console._id)}
            >
              {console.nome}
            </ConsoleCard>
          );
        })}
      </ContentContainer>
    </PageContainer>
  );
}

export default ConsolesPage;
