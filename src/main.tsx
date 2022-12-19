import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ConsolesPage from "./pages/Consoles.page";
import JogosPage from "./pages/Jogos.page";
import AvaliacoesPage from "./pages/Avaliacoes.page";
import LoginPage from "./pages/Login.page";
import NavbarLayout from "./layouts/Navbar";
import { ToastContainer } from "react-toastify";

import { RecoilRoot } from "recoil";

import "react-toastify/dist/ReactToastify.css";
import RegistrarPage from "./pages/Registrar.page";
import Modal from "./components/Modal";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <NavbarLayout />
        <ConsolesPage />
      </>
    ),
  },
  {
    path: "/consoles",
    element: (
      <>
        <NavbarLayout />
        <ConsolesPage />
      </>
    ),
  },
  {
    path: "/jogos",
    element: (
      <>
        <NavbarLayout />
        <JogosPage />
      </>
    ),
  },
  {
    path: "/avaliacoes",
    element: (
      <>
        <NavbarLayout />
        <AvaliacoesPage />
      </>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/registrar",
    element: <RegistrarPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <ToastContainer />
      <Modal />
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>
);
