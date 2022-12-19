import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { toast } from "react-toastify";
import appFetch from "../services/appFetch.service";

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
  padding-bottom: 40px;
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

function RegistrarPage() {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const navigation = useNavigate();

  const handleRegistrar = async () => {
    const resposta = await appFetch("/registrar", {
      method: "POST",
      body: { nome, email, senha },
      headers: {
        "Content-type": "application/json",
      },
    });

    if (resposta.status === 201) {
      toast("Conta criada com sucesso", {
        type: "success",
        position: "bottom-right",
        pauseOnFocusLoss: false,
      });

      return navigation("/login");
    }

    toast(resposta.mensagem, {
      position: "bottom-right",
      type: "error",
      pauseOnFocusLoss: false,
    });
  };

  return (
    <PageContainer>
      <ContentContainer>
        <TitleContainer>Registro</TitleContainer>
        <InputContainer>
          <Input
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            value={nome}
            placeholder="Nome"
            onChange={(e) => setNome(e.target.value)}
          />
          <Input
            value={senha}
            placeholder="Senha"
            type="password"
            onChange={(e) => setSenha(e.target.value)}
          />
          <ButtonContainer>
            <Button onClick={handleRegistrar}>Registrar</Button>
          </ButtonContainer>
        </InputContainer>
      </ContentContainer>
    </PageContainer>
  );
}

export default RegistrarPage;
