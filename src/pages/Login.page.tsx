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

function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigation = useNavigate();

  const handleLogin = async () => {
    const resposta = await appFetch("/login", {
      method: "POST",
      body: { email, senha },
      headers: {
        "Content-type": "application/json",
      },
    });

    if (resposta.status === 200) {
      localStorage.setItem("JWT_TOKEN", resposta.data.access_token);
      return navigation(-1);
    }

    toast("Usuário ou senha incorretos", {
      position: "bottom-right",
      type: "error",
      pauseOnFocusLoss: false,
    });
  };

  const handleRegistrar = () => {
    navigation("/registrar");
  };

  return (
    <PageContainer>
      <ContentContainer>
        <TitleContainer>Login</TitleContainer>
        <InputContainer>
          <Input
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            value={senha}
            placeholder="Senha"
            type="password"
            onChange={(e) => setSenha(e.target.value)}
          />
          <ButtonContainer>
            <Button onClick={handleLogin}>Login</Button>
            <Button onClick={handleRegistrar}>Registrar</Button>
          </ButtonContainer>
        </InputContainer>
      </ContentContainer>
    </PageContainer>
  );
}

export default LoginPage;
