import { React, useState } from 'react';
import { ref, set } from 'firebase/database';
import { database } from './Firebase';

export default function TestarBancoDeDados() {

    async function escreverNoBanco() {
        try {
            const filmes = [
                { id: 1, nome: "Filme 1", genero: "Ação" },
                { id: 2, nome: "Filme 2", genero: "Comédia" },
                { id: 3, nome: "Filme 3", genero: "Drama" }
            ]

            const chavePrimariaFilmes = ref(database, 'filmes');

            await set(chavePrimariaFilmes, filmes);
            console.log("Dados escritos com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar mensagem:", error);
            alert("Erro ao salvar mensagem: " + error.message);
        }

    }
    
    escreverNoBanco();
}