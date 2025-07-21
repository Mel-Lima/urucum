import CabecalhoPerfilArtista from '../cabecalhos/CabecalhoPerfilArtista';
import { CiLink } from "react-icons/ci";
import { FaWhatsapp } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaPencilAlt, FaPlus } from "react-icons/fa";
import DenunciarConta from '../pop-ups/DenunciarConta/DenunciarConta';
import DeletarObra from '../pop-ups/DeletarObra';
import AdicionarObra from '../pop-ups/AdicionarObra/AdicionarObra';
import AdicionarColecao from '../pop-ups/AdicionarColecao/AdicionarColecao';

import { useState } from 'react';

import { useNavigate } from "react-router-dom";

import './PerfilArtista.css';

export default function PerfilArtista() {

  const navegar = useNavigate();

  const quandoEditarPerfil = () => {
    navegar("/editar-perfil" + `?nomeArtistico=${artista.nomeArtistico}`);
  };

  const [popup, setPopup] = useState(null);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  // Função para abrir popup de adicionar obra
  const adicionarObra = () => {
    setModoEdicao(false);
    setItemSelecionado(null);
    setPopup("adicionar-obra");
  };

  // Função para abrir popup de editar obra
  const editarObra = (obra) => {
    setModoEdicao(true);
    setItemSelecionado(obra);
    setPopup("adicionar-obra");
  };

  // Função para abrir popup de adicionar coleção
  const adicionarColecao = () => {
    setModoEdicao(false);
    setItemSelecionado(null);
    setPopup("adicionar-colecao");
  };

  // Função para abrir popup de editar coleção
  const editarColecao = (colecao) => {
    setModoEdicao(true);
    setItemSelecionado(colecao);
    setPopup("adicionar-colecao");
  };

  const artista = {
    nome: "Nome do Artista",
    nomeArtistico: "O Peixão",
    bio: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu",
    imagem: "https://via.placeholder.com/150",
    tags: ["musica", "artista", "performer"],
    obras: [
      {
        id: 1,
        nome: "Obra 1",
        descricao: "Descrição da obra 1",
        imagem: "https://via.placeholder.com/150",
      },

      {
        id: 2,
        nome: "Obra 2",
        descricao: "Descrição da obra 2",
        imagem: "https://via.placeholder.com/150",
      }
    ],

    colecoes: [
      {
        id: 1,
        nome: "Coleção 1",
        descricao: "Descrição da coleção 1",
        imagem: "https://via.placeholder.com/150",
      },

      {
        id: 2,
        nome: "Coleção 2",
        descricao: "Descrição da coleção 2",
        imagem: "https://via.placeholder.com/150",
      }
    ]
  }

  return (
    <div>
      <CabecalhoPerfilArtista />
      <main>
        <div className="perfil-container">

          <div className='imagem-principal'></div>

          <div className='bloco-informacoes-basicas'>
            <div className='imagem-perfil-tags'>
              <div className='foto-perfil'>
                <img src={artista.imagem} alt={artista.nomeArtistico} />
              </div>
              <div className='tags'>
                {artista.tags.map(tag => (
                  <span key={tag} className='tag'>{tag}</span>
                ))}
              </div>
            </div>
            <div className='bio-editar'>
              <div className='bio'>
                <p>{artista.bio}</p>
              </div>
              <button className='botao-editar' onClick={quandoEditarPerfil}>Editar Perfil</button>
            </div>
          </div>
        </div>

        <div className='galeria-header'>
          <h3>Galeria</h3>
        </div>
        <div className='galeria'>
          {artista.obras.map(obra => (
            <div key={obra.id} className='obra'>
              <img src={obra.imagem} alt={obra.nome} />
              <div className='botoes-editar-deletar'>
                <button className='deletar' onClick={() => setPopup("deletar-obra")}>X</button>
                <button className='editar' onClick={() => editarObra(obra)}><FaPencilAlt /></button>
              </div>
            </div>
          ))}
          <button className='botao-adicionar' onClick={adicionarObra}>
            <FaPlus />
          </button>
        </div>

        <div className='colecoes-header'>
          <h3>Coleções</h3>
        </div>
        <div className='colecoes'>
          {artista.colecoes.map(colecao => (
            <div key={colecao.id} className='colecao'>
              <img src={colecao.imagem} alt={colecao.nome} />
              <div className='botoes-editar-deletar'>
                <button className='deletar' onClick={() => setPopup("deletar-colecao")}>X</button>
                <button className='editar' onClick={() => editarColecao(colecao)}><FaPencilAlt /></button>
              </div>
            </div>
          ))}
          <button className='botao-adicionar' onClick={adicionarColecao}>
            <FaPlus />
          </button>
        </div>

        <div className='contato'>
          <div className='contato-link'>
            <h4>Compartilhar Perfil</h4>
            <CiLink className='icone' />
          </div>

          <div className='redes-sociais'>
            <h4>Contato</h4>
            <FaWhatsapp className='icone' />
            <FaInstagram className='icone' />
          </div>
        </div>

        <div className='denunciar-container'>
          <button className='botao-denunciar' onClick={() => setPopup("denunciar")}>DENUNCIAR ESTA CONTA</button>
        </div>

        {popup === 'denunciar' && <DenunciarConta clicado={true} fechar={() => setPopup(null)} />}
        {popup === 'deletar-obra' && <DeletarObra clicado={true} fechar={() => setPopup(null)} />}
        {popup === 'adicionar-obra' && <AdicionarObra 
          clicado={true} 
          fechar={() => setPopup(null)} 
          modoEdicao={modoEdicao}
          itemParaEditar={itemSelecionado}
        />}
        {popup === 'deletar-colecao' && <DeletarObra clicado={true} fechar={() => setPopup(null)} />}
        {popup === 'adicionar-colecao' && <AdicionarColecao 
          clicado={true} 
          fechar={() => setPopup(null)}
          modoEdicao={modoEdicao}
          itemParaEditar={itemSelecionado}
        />}
          
      </main>
    </div>
  )
}