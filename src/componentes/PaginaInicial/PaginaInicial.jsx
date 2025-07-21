import CabecalhoPaginaInicial from "../cabecalhos/CabecalhoPaginaInicial";
import "./PaginaInicial.css";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usuarioEstaLogado } from "../contextos/auth.jsx";
import { database } from "../Firebase.jsx";
import { ref, get } from "firebase/database";

export default function PaginaInicial() {
  const [artistas, setArtistas] = useState([]);
  const [todosArtistas, setTodosArtistas] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [pesquisaDebounced, setPesquisaDebounced] = useState("");
  const [carregando, setCarregando] = useState(true);
  const navegar = useNavigate();

  // Check if user is logged in when component mounts
  useEffect(() => {
    if (!usuarioEstaLogado()) {
      navegar("/login");
      return;
    }
  }, [navegar]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setPesquisaDebounced(pesquisa);
    }, 300);

    return () => clearTimeout(timer);
  }, [pesquisa]);

  // Load all artists once when component mounts
  useEffect(() => {
    const carregarTodosArtistas = async () => {
      try {
        setCarregando(true);
        const usuariosRef = ref(database, 'usuarios');
        const snapshot = await get(usuariosRef);

        if (snapshot.exists()) {
          const usuariosData = snapshot.val();
          let artistasEncontrados = [];

          Object.keys(usuariosData).forEach(emailKey => {
            const usuario = usuariosData[emailKey];
            
            if (usuario.nomeArtistico) {
              artistasEncontrados.push({
                id: emailKey,
                name: usuario.nomeArtistico,
                nomeCompleto: usuario.nomeCompleto,
                image: usuario.imagemPerfil || "https://placehold.co/150",
                bio: usuario.miniBiografia || "",
                tags: usuario.tags || [],
                email: usuario.email
              });
            }
          });

          setTodosArtistas(artistasEncontrados);
          setArtistas(artistasEncontrados);
        } else {
          setTodosArtistas([]);
          setArtistas([]);
        }
      } catch (error) {
        console.error("Erro ao buscar artistas:", error);
        setTodosArtistas([]);
        setArtistas([]);
      } finally {
        setCarregando(false);
      }
    };

    carregarTodosArtistas();
  }, []);

  // Filter artists based on search input
  useEffect(() => {
    if (pesquisaDebounced.trim() === "") {
      setArtistas(todosArtistas);
    } else {
      const artistasFiltrados = todosArtistas.filter(artista => {
        const pesquisaLower = pesquisaDebounced.toLowerCase();
        
        // Busca por nome artístico
        const nomeMatch = artista.name.toLowerCase().includes(pesquisaLower);
        
        // Busca por nome completo
        const nomeCompletoMatch = artista.nomeCompleto?.toLowerCase().includes(pesquisaLower);
        
        // Busca por tags
        const tagMatch = artista.tags.some(tag => 
          tag.toLowerCase().includes(pesquisaLower)
        );

        return nomeMatch || nomeCompletoMatch || tagMatch;
      });
      
      setArtistas(artistasFiltrados);
    }
  }, [pesquisaDebounced, todosArtistas]);
  
  return (
    <>
      <CabecalhoPaginaInicial />
      <div className="container">
        <main className="main">
          <div className="menu">
            <h2>Conecte-se com artistas e suas histórias</h2>
            <input
              className="barra-de-pesquisa"
              type="text"
              placeholder="Pesquisar por nome ou tag"
              value={pesquisa}
              onChange={evento => setPesquisa(evento.target.value)}
              maxLength={64}
            />
          </div>

          <div className="galeria-artistas">
            {carregando ? (
              <p className="carregando">Carregando artistas...</p>
            ) : artistas.length === 0 ? (
              <p className="nao-existe">
                {pesquisaDebounced.trim() !== "" ? `Nenhum artista encontrado para "${pesquisaDebounced}".` : "Nenhum artista encontrado."}
              </p>
            ) : (
              artistas.map((artista, index) => (
                <div key={index} className="cartinha-artista" onClick={() => {

                  /* 
                    Também não sabia desse window.location.href,
                    ele puxa o nome do artista e coloca na URL da página, assim cada artista vai ter uma página comn o link do seu nome
                    vou só trocar pra ID (caso não tenha sido implementado)
                  */

                  window.location.href = `/perfil-artista?name=${artista.name}`;
                }}>
                  <img src={artista.image} alt={artista.name} />
                  <div className="foto-perfil-artista">
                    <img src={artista.image} alt={artista.name} />
                  </div>
                  <p className="nome-artista">{artista.name}</p>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </>
  );
}
