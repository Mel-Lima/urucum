import { useNavigate } from "react-router-dom";
import CabecalhoImagem from "./CabecalhoImagem/CabecalhoImagem";
import "../../estilos/CabecalhoGeral.css";
import { pegarUsuarioAtual, Deslogar } from "../contextos/auth.jsx";

export default function CabecalhoPaginaInicial() {
  const navegar = useNavigate();
  const usuarioAtual = pegarUsuarioAtual();

  const sairConta = () => {
    Deslogar();
    navegar("/login");
  };

  return (
    <>
      <CabecalhoImagem>
        <h1>Página Inicial</h1>
        <div className="botaoPerfil">
          <div className="fotoPerfil">
            <img src="teste.sql" alt="imagem do artista" />
          </div>
          <button className="deslogar" onClick={sairConta}> Sair da Conta </button>
        </div>
      </CabecalhoImagem>
    </>
  );
}