import Cabecalho from "./cabecalhos/CabecalhoImagem/CabecalhoImagem";
import "../estilos/Formulario.css";

import { database } from './Firebase';
import { ref, set, push, get, query, orderByChild, equalTo } from 'firebase/database';
import { useState } from 'react';

import { useNavigate } from "react-router-dom";
import { loginUsuario } from './contextos/auth.jsx';

export default function Cadastro() {
  const navegar = useNavigate();

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [nomeArtistico, setNomeArtistico] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");

  /*
    Essa parte aqui também fiz com a ajuda do Copilot
    Pra checar o email, tenho que importar os métodos do Firebase ali em cima
    aí uso eles pra pegar a referência com o query, organizo por email e comparo o email digitado pelo usuario
    se for igual, ele dá erro e não envia
  */
  async function verificarEmailExistente(email) {
    try {
      /*
        Aqui, muda-se a referência pro email ao invés do ID aleatório do Firebase quando a gente dá push
      */
      const emailKey = email.replace(/[^a-zA-Z0-9]/g, '_');
      const usuarioRef = ref(database, 'usuarios/' + emailKey);
      const snapshot = await get(usuarioRef);
      
      return snapshot.exists();
    } catch (error) {
      console.error("Erro ao verificar email:", error);
      return false;
    }
  }

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

    // Check if email already exists
    const emailJaExiste = await verificarEmailExistente(email);
    if (emailJaExiste) {
      alert("Este email já está cadastrado! Por favor, use outro email ou faça login.");
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
        
        Mudança: agora vou usar o email como chave única diretamente,
        sem usar push() para evitar duplicatas
      */
      const emailKey = email.replace(/[^a-zA-Z0-9]/g, '_');
      const usuarioRef = ref(database, 'usuarios/' + emailKey);

      // Use set instead of push to prevent duplicates
      await set(usuarioRef, novoUsuario);

      // Automatically log in the user after successful registration
      loginUsuario(novoUsuario);

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
