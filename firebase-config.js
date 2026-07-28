/*
=====================================================================
 CONFIGURAÇÃO DO FIREBASE
=====================================================================
 Este é o ÚNICO arquivo que você precisa editar para o login
 (email + senha) funcionar de verdade.

 COMO PEGAR ESSES VALORES:
 1. Acesse https://console.firebase.google.com
 2. Crie um projeto novo (grátis)
 3. No painel do projeto, clique no ícone "</>" (Web) para
    registrar um app da web
 4. Copie o objeto "firebaseConfig" que aparece e cole abaixo,
    substituindo os valores de exemplo
 5. No menu lateral, vá em "Authentication" → "Sign-in method"
    → ative "Email/Senha"
 6. No menu lateral, vá em "Firestore Database" → "Criar banco
    de dados" → pode criar em modo produção ou teste

 Depois disso, o login, cadastro, recuperação de senha por email
 e o histórico de ações do usuário vão funcionar de verdade.
=====================================================================
*/

export const firebaseConfig = {
  apiKey: "COLE_AQUI_SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:xxxxxxxxxxxxxxxxxxxxxx"
};
