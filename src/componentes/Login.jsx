import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { database } from "./Firebase";
import { ref, get } from "firebase/database";
import { loginUsuario, usuarioEstaLogado } from "./contextos/auth.jsx";

import Cabecalho from "./cabecalhos/CabecalhoImagem/CabecalhoImagem";
import "../estilos/Formulario.css";

export default function Login() {
  const navegar = useNavigate();
  
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  /*
    Aqui, a gente checa se o usuário está logado
  */
  useEffect(() => {
    if (usuarioEstaLogado()) {
      navegar("/pagina-inicial");
    }
  }, [navegar]);

  const quandoEnviar = async (event) => {
    event.preventDefault();
    setCarregando(true);
    setErro("");

    if (!email || !senha) {
      setErro("Por favor, preencha todos os campos!");
      setCarregando(false);
      return;
    }

    try {
      /*
        Aqui a gente converte o email praquele formato lá que eu falei em um código anterior
        Mas repetindo, basicamente esse .replace muda os caracteres do email que são especiais para underline
      */
      const emailKey = email.replace(/[^a-zA-Z0-9]/g, '_');

      /*
        A referencia do usuario no firebase (seu id) vai ser seu email
      */
      const usuariosRef = ref(database, `usuarios/${emailKey}`);
      
      // Get user data from Firebase
      const snapshot = await get(usuariosRef);
      

      /*
        Como explicado no slide, o snapshot é um "print" do banco de dados antes de qualquer alteração
        Se o usuário existir, snapshot.exists() será true e podemos acessar os dados do usuário
      */
      if (snapshot.exists()) {
        const dadosUsuario = snapshot.val();

        if (dadosUsuario.senha === senha) {
          /*
            Ele loga - inclui todas as informações do usuário
          */
          loginUsuario({
            email: dadosUsuario.email,
            nomeCompleto: dadosUsuario.nomeCompleto,
            nomeArtistico: dadosUsuario.nomeArtistico,
            miniBiografia: dadosUsuario.miniBiografia,
            numeroWhatsApp: dadosUsuario.numeroWhatsApp,
            usuarioInstagram: dadosUsuario.usuarioInstagram,
            tags: dadosUsuario.tags,
            imagemPerfil: dadosUsuario.imagemPerfil
          });

          /*
            E depois vai pra home
          */
          navegar("/pagina-inicial");
        } else {
          setErro("Email ou senha incorretos!");
        }
      } else {
        setErro("Email ou senha incorretos!");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErro("Erro ao fazer login. Tente novamente.");
    }
    
    setCarregando(false);
  };

  const quandoCadastro = (event) => {
    event.preventDefault();
    navegar("/");
  };


  return (
    <>
      <Cabecalho />
      <main className="container">
        <form className="form-container" onSubmit={quandoEnviar}>
          <h2>LOGIN</h2>
          {erro && <div className="texto-vermelho">{erro}</div>}
          <div className="form-inputs">
            <input 
              type="email" 
              placeholder="Email" 
              maxLength={32}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // O disabled aqui serve para desabilitar o input enquanto a requisição está sendo feita
              // Isso é útil para evitar que o usuário envie o formulário várias vezes enquanto aguarda a resposta
              // Tive que usar barrinhas porque o código reclamou das minhas chaves (??)
              disabled={carregando}
            />
            <input 
              type="password" 
              placeholder="Senha" 
              maxLength={32}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={carregando}
            />
          </div>
          <button type="submit" disabled={carregando}>
            {carregando ? "ENTRANDO..." : "ENTRAR"}
          </button>
          <p>Não possui um login? <a href="/" onClick={quandoCadastro}>Cadastre-se</a></p>
        </form>
      </main>
    </>
  );
}
