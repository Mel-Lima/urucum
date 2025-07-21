/*
    Isso aqui foi feito com Copilot
    Tentei assistir um vídeo de como fazer auth, implementei tudo, não funcionou
    Como a gente não tem essa parte na matéria, resolvi usar a IA
    Depois que ela fez, consegui entender os conceitos
    Por isso vou deixar tudo comentado por aqui
*/

/*
    Aprendi que em um documento, só pode ter um export default
    Então, como não tem nenhum export default nesse arquivo, vou deixar o export normal
*/

export function usuarioEstaLogado() {
    /*
        Esse localstorage verifica se, na memória do navegador, já tem um usuario logado
    */
  const usuario = localStorage.getItem('usuarioLogado');
  if (usuario) {
    try {
        /*
            ese json.parse transforma o texto que está no localstorage em um objeto javascript
        */
      const dadosUsuario = JSON.parse(usuario);
      return dadosUsuario.logado === true;
    } catch {
      return false;
    }
  }
  return false;
}

export function pegarUsuarioAtual() {
  const usuario = localStorage.getItem('usuarioLogado');
  if (usuario) {
    try {
      return JSON.parse(usuario);
    } catch {
      return null;
    }
  }
  return null;
}

export function Deslogar() {
  localStorage.removeItem('usuarioLogado');
}

export function loginUsuario(dadosUsuario) {
  localStorage.setItem('usuarioLogado', JSON.stringify({
    email: dadosUsuario.email,
    nomeCompleto: dadosUsuario.nomeCompleto,
    nomeArtistico: dadosUsuario.nomeArtistico,
    miniBiografia: dadosUsuario.miniBiografia,
    numeroWhatsApp: dadosUsuario.numeroWhatsApp,
    usuarioInstagram: dadosUsuario.usuarioInstagram,
    tags: dadosUsuario.tags,
    imagemPerfil: dadosUsuario.imagemPerfil,
    logado: true
  }));
}
