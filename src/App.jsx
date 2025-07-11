// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJ4dM6zdmTc1YzSC7SeChfZ6UnAiiWkZ0",
  authDomain: "urucum-react-project-efd56.firebaseapp.com",
  projectId: "urucum-react-project-efd56",
  storageBucket: "urucum-react-project-efd56.firebasestorage.app",
  messagingSenderId: "957567489545",
  appId: "1:957567489545:web:d4759d45fc93891ab04ad8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import { BrowserRouter, Routes, Route } from "react-router-dom";

import TelaCadastro from "./paginas/TelaCadastro";
import TelaEditarPerfil from "./paginas/TelaEditarPerfil"
import TelaLogin from "./paginas/TelaLogin";
import TelaPaginaInicial from "./componentes/PaginaInicial/PaginaInicial";
import PerfilArtista from "./componentes/PerfilArtista/PerfilArtista";
import TestarBancoDeDados from "./componentes/TestarBancoDeDados";



function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TelaCadastro />} />
          <Route path="/editar-perfil" element={<TelaEditarPerfil />} />
          <Route path="/login" element={<TelaLogin />} />
          <Route path="/pagina-inicial" element={<TelaPaginaInicial />} />
          <Route path="/perfil-artista" element={<PerfilArtista />} />
          {/* Adicione outras rotas conforme necessário */}
        </Routes>
      </BrowserRouter>

      <TestarBancoDeDados />
    </>
  )
}

export default App