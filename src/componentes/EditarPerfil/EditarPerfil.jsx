import CabecalhoEditarPerfil from '../cabecalhos/CabecalhoEditarPefil';
import { FaWhatsapp } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import AlterarEmail from '../pop-ups/AlterarEmail';
import AlterarSenha from '../pop-ups/AlterarSenha';
import AdicionarTag from '../pop-ups/AdicionarTag/AdicionarTag';
import DeletarConta from '../pop-ups/DeletarConta';
import { pegarUsuarioAtual, Deslogar } from '../contextos/auth.jsx';
import { database } from '../Firebase.jsx';
import { ref, remove, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/*
  Aqui, aprendi por fora como usar o css modular, que foi visto um pouquinho em sala
  mas não lembrava muito bem como aplicar

  Eu queria parte dos dois CSSs funcionando e sem afetar as outras páginas. Aí descobri
  que se usa assim, com um styles e o outro normal mesmo.
*/
import styles from './EditarPerfil.module.css';
import '../../estilos/Formulario.css';

export default function EditarPerfil() {

  const navegar = useNavigate();
  const [popup, setPopup] = useState(null);
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [nomeArtistico, setNomeArtistico] = useState('');
  const [miniBiografia, setMiniBiografia] = useState('');
  const [numeroWhatsApp, setNumeroWhatsApp] = useState('');
  const [usuarioInstagram, setUsuarioInstagram] = useState('');
  const [tagsUsuario, setTagsUsuario] = useState([]);
  const [imagemPerfil, setImagemPerfil] = useState('');
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [previewImagem, setPreviewImagem] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const usuarioAtual = pegarUsuarioAtual();
    if (usuarioAtual) {
      setNomeCompleto(usuarioAtual.nomeCompleto || '');
      setNomeArtistico(usuarioAtual.nomeArtistico || '');
      setMiniBiografia(usuarioAtual.miniBiografia || '');
      setNumeroWhatsApp(usuarioAtual.numeroWhatsApp || '');
      setUsuarioInstagram(usuarioAtual.usuarioInstagram || '');
      setTagsUsuario(usuarioAtual.tags || []);
      setImagemPerfil(usuarioAtual.imagemPerfil || '');
    } else {
      alert("Usuário não encontrado. Verifique se o usuário está logado.");
    }
  }, []);

  /*
    Essa parte eu fiz com o Copilot
    Basicamente, pra permitir APENAS números no campo de WhatsApp, preciso fazer um checagem ANTES
    pois, aparentemente, o problema é quando o setNumeroWhatsApp é chamado com um valor que contém caracteres não numéricos, porque ele simplesmente DEIXA
  */
  const mudancaNumeroWhatsapp = (event) => {
    const value = event.target.value;

    /*
      Aqui, eu substituo todos os caracteres não numéricos por um espaço vazio
    */
    const numeros = value.replace(/[^0-9]/g, '');
    setNumeroWhatsApp(numeros);
  };

  const salvarTags = (tagsAdicionadas) => {
    setTagsUsuario(tagsAdicionadas);
  };

  /*
    A parte de imagem foi feita com o Copilot, já que não temos esse conteúdo em sala
    Fui comentando o que fui entendendo
  */
  const quandoMudarImagem = (event) => {
    const file = event.target.files[0];
    if (file) {
      
      /*
        Aqui a gente checa o tipo de arquivo, pra ver se é uma imagem mesmo
      */
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      
      /*
        Checa se tem 20mb (uma das nossas regras de negócio)
      */
      if (file.size > 20 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 20MB.');
        return;
      }
      
      setImagemSelecionada(file);
      
      /*
        Aqui pra mim foi grego
        entendi que tem essa função FileReader, que eu acho que converte o arquivo em uma URL de dados
        e ali embaixo ele le o arquivo como a URL dos dados
        mto estranho
      */
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImagem(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /*
    Quando o usuario clicar na area da imagem, vai chamar o input de arquivo
  */
  const enviarArquivo = () => {
    document.getElementById('enviar-arquivo').click();
  };

  /*
    É assim que upa a imagem no Firebase Storage aparentemente
  */
  const uploadImage = async () => {
    if (!imagemSelecionada) {
      return null;
    }
    
    try {
      const usuarioAtual = pegarUsuarioAtual();
      if (!usuarioAtual || !usuarioAtual.email) {
        throw new Error('Usuário não encontrado.');
      }

      /*
        Mesmo role da da parte de deletar conta, onde o email vira chave
      */
      const storage = getStorage();
      const emailKey = usuarioAtual.email.replace(/[^a-zA-Z0-9]/g, '_');
      const imageRef = storageRef(storage, `imagens-perfil/${emailKey}`);

      /*
        Aqui upa os bytes da imagem mesmo
      */
      await uploadBytes(imageRef, imagemSelecionada);
      
      /*
        Aqui ele cria uma URL de download, provavelmente pra exibir o preview e a imagem depois
      */
      const downloadURL = await getDownloadURL(imageRef);
      
      return downloadURL;
      
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  };

  /*
    Assim que envia o forms
  */
  const quandoEnviar = async (event) => {
    event.preventDefault();
    setUploading(true);

    try {
      const usuarioAtual = pegarUsuarioAtual();
      if (!usuarioAtual || !usuarioAtual.email) {
        alert('Erro: Usuário não encontrado.');
        return;
      }

      /*
        Mesma coisa da chave email
      */
      const emailKey = usuarioAtual.email.replace(/[^a-zA-Z0-9]/g, '_');
      const userRef = ref(database, 'usuarios/' + emailKey);

      /*
        Puxa os dados do usuário atual
      */
      const dadosUsuario = {
        nomeCompleto,
        nomeArtistico,
        miniBiografia,
        numeroWhatsApp,
        usuarioInstagram,
        tags: tagsUsuario
      };

      /*
        Upa a imagem
      */
      if (imagemSelecionada) {
        const imagemUrl = await uploadImage();
        dadosUsuario.imagemPerfil = imagemUrl;
        setImagemPerfil(imagemUrl);
        setImagemSelecionada(null);
        setPreviewImagem(''); // Clear preview after successful upload
      }

      /*
        Atualiza os dados do usuário no banco de dados
      */
      await update(userRef, dadosUsuario);

      alert('Perfil atualizado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('Erro ao salvar perfil. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  /*
    Deletando a conta 
  */
  const deletarConta = async () => {
    try {
      const usuarioAtual = pegarUsuarioAtual();
      if (!usuarioAtual || !usuarioAtual.email) {
        alert("Erro: Usuário não encontrado.");
        return;
      }

      /*
        Aqui é onde eu usei a conversao de email pra chave a primeira vez (o copilot no caso, pq eu n sabia disso n kk)
      */
      const emailKey = usuarioAtual.email.replace(/[^a-zA-Z0-9]/g, '_');
      const usuarioRef = ref(database, 'usuarios/' + emailKey);

      await remove(usuarioRef);

      Deslogar();

      alert("Conta deletada com sucesso!");

      navegar("/login");

    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      alert("Erro ao deletar conta. Tente novamente.");
    }
  };

  return (
    <>
      <CabecalhoEditarPerfil />
      <main className={`container ${styles.container}`}>
        <form className={`form-container ${styles.formContainer}`} onSubmit={quandoEnviar}>
          <h2 className={styles.titulo}>Informações de Perfil</h2>

          <div className={styles.imagemContainer}>
            <div className={styles.enviarFotoPerfil} onClick={enviarArquivo} style={{ cursor: 'pointer' }}>
              <div className={styles.imagemPreviewContainer}>
                {previewImagem ? (
                  <img 
                    src={previewImagem} 
                    alt="Preview da imagem selecionada" 
                    className={styles.imagemPreview}
                  />
                ) : imagemPerfil ? (
                  <img 
                    src={imagemPerfil} 
                    alt="Foto de perfil atual" 
                    className={styles.imagemPreview}
                  />
                ) : (
                  <div className={styles.imagemVazio}>
                    <div className={styles.imagemPlaceholder}>
                      <img src="https://placehold.co/150" alt="Placeholder de perfil" />
                    </div>
                  </div>
                )}
              </div>
              
              <div className={styles.imageControls}>
                <input 
                  id="enviar-arquivo" 
                  className="esconder-entrada-padrao" 
                  type="file" 
                  accept="image/*" 
                  onChange={quandoMudarImagem}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
            <div className={styles.botoesAlterar}>
              <button type="button" onClick={() => setPopup("email")}>ALTERAR EMAIL</button>
              <button type="button" onClick={() => setPopup("senha")}>ALTERAR SENHA</button>
            </div>
          </div>

          <div className={`form-inputs ${styles.formInputs}`}>
            <input className={styles.input} type="text" placeholder="Nome Completo" maxLength={64} value={nomeCompleto} onChange={(event) => setNomeCompleto(event.target.value)} />
            <input className={styles.input} type="text" placeholder="Nome Artístico" maxLength={64} value={nomeArtistico} onChange={(event) => setNomeArtistico(event.target.value)} />
          </div>


          <textarea className={styles.biografia} placeholder="Mini Biografia" maxLength="500" value={miniBiografia} onChange={(event) => setMiniBiografia(event.target.value)}></textarea>
          <p className={styles.textoLimite}>Tamanho máximo de 500 caracteres</p>

          <h3 className={styles.subtitulo}>Tags:</h3>
          <div className={styles.tagsContainer}>
            {tagsUsuario.length > 0 ? (
              tagsUsuario.map((tag, i) => (
                <span key={i} className={styles.tags}>{tag}</span>
              ))
            ) : (
              <p className={styles.textoSemTags}>Nenhuma tag adicionada.</p>
            )}
          </div>
          <button id={styles.adicionarTag} type="button" onClick={() => setPopup("tags")}>+</button>

          <h3 className={styles.subtitulo}>Contato:</h3>

          <div className={styles.iconesContato}>
            <FaWhatsapp />
            <input 
              className={styles.input} 
              type="tel" 
              placeholder="Número do WhatsApp" 
              value={numeroWhatsApp} 
              onChange={mudancaNumeroWhatsapp}
              maxLength={15}
            />
            <FaInstagram />
            <input className={styles.input} type="text" placeholder="Usuário do Instagram" value={usuarioInstagram} onChange={(event) => setUsuarioInstagram(event.target.value)} />
          </div>

          <div className={styles.deletarSalvar}>
            <button id={styles.deletarConta} type="button" onClick={() => setPopup("deletar")}>DELETAR CONTA</button>
            <button type="submit" disabled={uploading}>
              {uploading ? 'SALVANDO...' : 'SALVAR'}
            </button>
          </div>
        </form>

        {/* Essa parte de pop-up eu tive que pesquisar por fora e fiz junto com o Copilot */}
        {popup === 'email' && <AlterarEmail clicado={true} fechar={() => setPopup(null)} />}
        {popup === 'senha' && <AlterarSenha clicado={true} fechar={() => setPopup(null)} />}
        {popup === 'tags' && <AdicionarTag clicado={true} fechar={() => setPopup(null)} salvar={salvarTags} tagsExistentes={tagsUsuario} />}
        {popup === 'deletar' && <DeletarConta clicado={true} fechar={() => setPopup(null)} deletar={deletarConta} />}
      </main>
    </>
  );
}