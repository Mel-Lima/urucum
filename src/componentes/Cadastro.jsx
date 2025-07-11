import Cabecalho from "./cabecalhos/CabecalhoImagem/CabecalhoImagem";
import "../estilos/Formulario.css";

import { database } from './Firebase';
import { ref, set, push } from 'firebase/database';
import { useState } from 'react';

import { useNavigate } from "react-router-dom";

export default function Cadastro() {
  const navegar = useNavigate();

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [nomeArtistico, setNomeArtistico] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");

  async function cadastrarUsuario(event) {
    event.preventDefault();
    
    if (nomeCompleto.length < 5) {
      alert("Nome completo deve ter pelo menos 5 caracteres!");
      return;
    }
    
    /*
      Deve estar sentindo falta do nome atístico aqui ne
      mas o cara pode simplesmente não ter mesmo, aí lá em baixo eu coloco pra ele substituir pelo nome completo
    */

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Por favor, insira um email válido!");
      return;
    }
    
    
    if (senha !== confirmacaoSenha) {
      alert("As senhas não coincidem!");
      return;
    }
    
    if (senha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres!");
      return;
    }
    
    try {
      const novoUsuario = {
        nomeCompleto: nomeCompleto,
        nomeArtistico: nomeArtistico,
        email: email,
        senha: senha,
        confirmacaoSenha: confirmacaoSenha,

        /*
          Esse ISO foi do copilot me ajudando
          Pesquisei e vi que é um padrão de data e hora
        */
        timestamp: new Date().toISOString()
      };

      /*
        Isso aqui foi outra parada também que achei loco
        o replace vai substituir todos os caracteres especiais do email por '_'
      */
      const usuarioRef = ref(database, 'usuarios/' + email.replace(/[^a-zA-Z0-9]/g, '_'));

      const novoUsuarioIdRef = push(usuarioRef);

      await set(novoUsuarioIdRef, novoUsuario);

      navegar("/editar-perfil");

      console.log("Usuário cadastrado com sucesso!");
      setNomeCompleto("");
      setNomeArtistico("");
      setEmail("");
      setSenha("");
      setConfirmacaoSenha("");
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      alert("Erro ao cadastrar usuário. Tente novamente.");
    }
  }

  const quandoLogin = (event) => {
    event.preventDefault();
    navegar("/login");
  };

  return (
    <>
      <Cabecalho />
      <main className="container">
        <form className="form-container" onSubmit={cadastrarUsuario}>
          <h2>CADASTRO</h2>
          <div className="form-inputs">
            <input type="text" placeholder="Nome Completo" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} maxLength={64} />

            {
              nomeCompleto.length > 0 && nomeCompleto.length < 5 && (
                <span className="error">Nome completo deve ter pelo menos 5 caracteres.</span>
              )
            }

            <input type="text" placeholder="Nome Artístico" value={nomeArtistico} onChange={(e) => setNomeArtistico(e.target.value)} maxLength={64} />

            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={32} />

            {
              email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                <span className="error">Por favor, insira um email válido.</span>
              )
            }

            <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} maxLength={32} />
            
            {
              senha.length > 0 && senha.length < 6 && (
                <span className="error">A senha deve ter pelo menos 6 caracteres.</span>
              )
            }
            
            <input type="password" placeholder="Confirme sua senha" value={confirmacaoSenha} onChange={(e) => setConfirmacaoSenha(e.target.value)} maxLength={32} />

            {
              confirmacaoSenha.length > 0 && senha !== confirmacaoSenha && (
                <span className="error">As senhas não coincidem.</span>
              )
            }

          </div>
          <button type="submit" className="botao-cadastrar">CADASTRAR</button>
          <p>Já possui um login? <a href="/login" onClick={quandoLogin}>Faça login</a></p>
        </form>
      </main>
    </>
  );
}
