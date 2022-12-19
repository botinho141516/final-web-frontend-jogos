import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const NavbarContainer = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  justify-content: space-between;
  height: 80px;
  background-color: #fff;
  box-shadow: 5px 3px 13px 3px rgba(0, 0, 0, 0.52);
  border-radius: 4px;
`;

const NavbarLogo = styled.div`
  font-size: 26px;
  margin: auto 0;
  padding: 20px;
`;

const LoginLogoutContainer = styled.div`
  padding: 20px;
  font-size: 26px;
  margin: auto 0;
  cursor: pointer;
  text-align: center;
`;

const LoginText = styled.div`
  margin: auto 0;
`;

const LogoutText = styled.div`
  margin: auto 0;
`;

function NavbarLayout() {
  const [logado, setLogado] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLogado(!!localStorage.getItem("JWT_TOKEN"));
  }, [setLogado]);

  function handleLoginClick() {
    navigate("/login");
  }

  function handleLogoutClick() {
    localStorage.removeItem("JWT_TOKEN");
    setLogado(false);
  }

  return (
    <NavbarContainer>
      <NavbarLogo>IGN - Game review</NavbarLogo>
      <LoginLogoutContainer>
        {!logado && (
          <LoginText onClick={handleLoginClick}>Login/Registrar</LoginText>
        )}
        {logado && <LogoutText onClick={handleLogoutClick}>Logout</LogoutText>}
      </LoginLogoutContainer>
    </NavbarContainer>
  );
}

export default NavbarLayout;
