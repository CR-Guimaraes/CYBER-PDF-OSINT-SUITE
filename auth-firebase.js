/*
=====================================================================
 AUTENTICAÇÃO REAL (Firebase Auth + Firestore)
=====================================================================
 Este arquivo cuida de:
 - Criar conta com email + senha
 - Login com email + senha
 - Recuperação de senha por email (email real, enviado pelo Google)
 - Salvar um registro de cada ação da pessoa no Firestore, pra
   consulta futura (histórico)

 Você não precisa mexer neste arquivo — só no firebase-config.js
=====================================================================
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    collectionGroup,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    limit,
    getDocs,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    increment,
    getCountFromServer
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const isConfigured = firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("COLE_AQUI");

let app,auth,db;

if(isConfigured){
    app=initializeApp(firebaseConfig);
    auth=getAuth(app);
    db=getFirestore(app);
    incrementVisitCounter();
}

const loginScreen=document.getElementById("loginScreen");
const loginStatus=document.getElementById("loginStatus");
const emailInput=document.getElementById("authEmail");
const passInput=document.getElementById("authPass");
const signInBtn=document.getElementById("signInBtn");
const signUpBtn=document.getElementById("signUpBtn");
const googleBtn=document.getElementById("googleBtn");
const forgotBtn=document.getElementById("forgotBtn");
const userBadge=document.getElementById("userBadge");
const logoutBtn=document.getElementById("logoutBtn");

const googleProvider=new GoogleAuthProvider();

function setStatus(msg,type=""){
    loginStatus.className="loginStatus"+(type?" "+type:"");
    loginStatus.innerText=msg;
}

if(!isConfigured){
    setStatus("⚠ Firebase ainda não configurado. Edite firebase-config.js com as chaves do seu projeto.","denied");
    signInBtn.disabled=true;
    signUpBtn.disabled=true;
    googleBtn.disabled=true;
    forgotBtn.disabled=true;
}

/*
 Validação própria de senha — o Firebase por padrão só exige
 6 caracteres, então reforçamos aqui antes de criar a conta.
*/
function checkPasswordStrength(pass){
    const comuns=["12345678","123456789","password","senha123","qwerty123","11111111","00000000","abc12345","87654321"];

    if(pass.length<8){
        return "A senha precisa ter pelo menos 8 caracteres.";
    }
    if(comuns.includes(pass.toLowerCase())){
        return "Essa senha é muito comum/fraca. Escolha outra.";
    }
    if(!/[a-zA-Z]/.test(pass) || !/[0-9]/.test(pass)){
        return "Use letras e números na senha (ex: Cyber2026).";
    }
    return null; // ok
}

window.CyberAuth={
    currentUser:null,

    async logAction(type,details){
        if(!isConfigured || !this.currentUser) return;
        try{
            await addDoc(
                collection(db,"users",this.currentUser.uid,"actions"),
                {type,details:details||"",timestamp:serverTimestamp()}
            );
        }catch(e){
            console.warn("Não foi possível salvar a ação no histórico:",e);
        }
    },

    async getHistory(){
        if(!isConfigured || !this.currentUser) return [];
        try{
            const q=query(
                collection(db,"users",this.currentUser.uid,"actions"),
                orderBy("timestamp","desc"),
                limit(25)
            );
            const snap=await getDocs(q);
            return snap.docs.map(d=>d.data());
        }catch(e){
            console.warn("Não foi possível carregar o histórico:",e);
            return [];
        }
    },

    signOutUser(){
        if(isConfigured) signOut(auth);
    },

    /* ---- Métodos usados só pelo painel de admin (👑) ---- */

    async getTotalUsers(){
        if(!isConfigured) return null;
        try{
            const snap=await getCountFromServer(collection(db,"users"));
            return snap.data().count;
        }catch(e){
            console.warn("Não foi possível contar usuários:",e);
            return null;
        }
    },

    async getRecentSessionsAll(max=20){
        if(!isConfigured) return [];
        try{
            const q=query(collectionGroup(db,"sessions"),orderBy("timestamp","desc"),limit(max));
            const snap=await getDocs(q);
            return snap.docs.map(d=>d.data());
        }catch(e){
            console.warn("Não foi possível carregar sessões (verifique as regras/índices do Firestore):",e);
            return [];
        }
    },

    async getActionStatsAll(sampleSize=150){
        if(!isConfigured) return [];
        try{
            const q=query(collectionGroup(db,"actions"),orderBy("timestamp","desc"),limit(sampleSize));
            const snap=await getDocs(q);
            const counts={};
            snap.docs.forEach(d=>{
                const t=d.data().type||"outro";
                counts[t]=(counts[t]||0)+1;
            });
            return Object.entries(counts).sort((a,b)=>b[1]-a[1]);
        }catch(e){
            console.warn("Não foi possível carregar estatísticas de ações:",e);
            return [];
        }
    }
};

/*
 Contador de visitas real, sem depender de serviço terceiro.
 Usa um único documento em stats/visits com um campo "count",
 incrementado atomicamente a cada carregamento da página
 (funciona mesmo antes do login, pois usa uma regra pública
 restrita só a esse documento — veja firestore.rules).

 IMPORTANTE: o documento stats/visits precisa existir uma vez
 antes, criado manualmente no console do Firestore com o campo
 count = 0 (número). Depois disso o site cuida do resto.
*/
async function incrementVisitCounter(){
    const el=document.getElementById("visitCounter");
    const ref=doc(db,"stats","visits");

    try{
        await updateDoc(ref,{count:increment(1)});
        const snap=await getDoc(ref);
        const total=snap.exists()?snap.data().count:"?";
        if(el) el.innerText="👁 Visitas: "+total;
    }catch(e){
        console.warn("Contador de visitas: crie o documento stats/visits (campo count=0) no Firestore e confira as regras.",e);
        if(el) el.innerText="👁 Visitas: configure o Firestore";
    }
}

if(isConfigured){

    signInBtn.addEventListener("click",async ()=>{
        const email=emailInput.value.trim();
        const pass=passInput.value;

        if(!email||!pass){
            setStatus("⚠ Preencha email e senha.","denied");
            return;
        }

        setStatus("Verificando credenciais...");

        try{
            await signInWithEmailAndPassword(auth,email,pass);
        }catch(e){
            setStatus("✖ "+traduzErro(e.code),"denied");
        }
    });

    signUpBtn.addEventListener("click",async ()=>{
        const email=emailInput.value.trim();
        const pass=passInput.value;

        if(!email||!pass){
            setStatus("⚠ Preencha email e senha.","denied");
            return;
        }

        const problema=checkPasswordStrength(pass);
        if(problema){
            setStatus("⚠ "+problema,"denied");
            return;
        }

        setStatus("Criando conta...");

        try{
            await createUserWithEmailAndPassword(auth,email,pass);
        }catch(e){
            setStatus("✖ "+traduzErro(e.code),"denied");
        }
    });

    googleBtn.addEventListener("click",async ()=>{
        setStatus("Abrindo login do Google...");
        try{
            await signInWithPopup(auth,googleProvider);
        }catch(e){
            setStatus("✖ "+traduzErro(e.code),"denied");
        }
    });

    forgotBtn.addEventListener("click",async ()=>{
        const email=emailInput.value.trim();

        if(!email){
            setStatus("⚠ Digite seu email para recuperar a senha.","denied");
            return;
        }

        try{
            await sendPasswordResetEmail(auth,email);
            setStatus("✔ Email de recuperação enviado! Verifique sua caixa de entrada.","granted");
        }catch(e){
            setStatus("✖ "+traduzErro(e.code),"denied");
        }
    });

    logoutBtn.addEventListener("click",()=>{
        window.CyberAuth.signOutUser();
        location.reload();
    });

    onAuthStateChanged(auth,async (user)=>{
        window.CyberAuth.currentUser=user;

        if(user){
            userBadge.innerText="👤 "+user.email;
            loginScreen.classList.add("hide");

            await ensureUserProfile(user);
            logSession(user);

            document.dispatchEvent(new CustomEvent("cyberAuthReady",{detail:{user}}));
        }
    });
}

/*
 Cria (se não existir) um documento legível em users/{uid} com
 o email, data de criação da conta e a flag isAdmin — assim,
 abrindo o Firestore você vê os campos direto, sem precisar
 caçar em subcoleções. Também é aqui que a flag de admin/master
 é lida, pra mostrar a coroa 👑 no topo do site.
*/
async function ensureUserProfile(user){
    if(!isConfigured) return;

    const ref=doc(db,"users",user.uid);

    try{
        const snap=await getDoc(ref);

        if(!snap.exists()){
            await setDoc(ref,{
                email:user.email,
                displayName:user.displayName||"",
                createdAt:serverTimestamp(),
                isAdmin:false
            });
            window.CyberAuth.isAdmin=false;
        }else{
            const data=snap.data();
            window.CyberAuth.isAdmin=!!data.isAdmin;

            if(window.CyberAuth.isAdmin){
                userBadge.innerText="👑 "+user.email+" (admin)";
            }
        }
    }catch(e){
        console.warn("Não foi possível carregar/criar o perfil do usuário:",e);
    }
}

/*
 Registra uma "sessão" a cada login: IP aproximado + localização
 (via API pública ipapi.co) e dados do dispositivo/navegador
 (via navigator, sem precisar de permissão especial).
 Fica salvo em: users/{uid}/sessions no Firestore — só você
 (dono do projeto Firebase) consegue ver isso no console.
*/
async function logSession(user){
    const deviceInfo={
        userAgent:navigator.userAgent,
        platform:navigator.platform||"",
        language:navigator.language||"",
        screenResolution:window.screen.width+"x"+window.screen.height,
        timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||"",
        referrer:document.referrer||"direto"
    };

    let geoInfo={};

    try{
        const res=await fetch("https://ipapi.co/json/");
        if(res.ok){
            const data=await res.json();
            geoInfo={
                ip:data.ip||"",
                city:data.city||"",
                region:data.region||"",
                country:data.country_name||"",
                org:data.org||"",
                isp:data.org||""
            };
        }
    }catch(e){
        console.warn("Não foi possível obter geolocalização por IP:",e);
    }

    try{
        await addDoc(
            collection(db,"users",user.uid,"sessions"),
            {
                email:user.email,
                ...deviceInfo,
                ...geoInfo,
                timestamp:serverTimestamp()
            }
        );
    }catch(e){
        console.warn("Não foi possível registrar a sessão:",e);
    }
}

function traduzErro(code){
    const mapa={
        "auth/invalid-email":"Email inválido.",
        "auth/user-not-found":"Usuário não encontrado.",
        "auth/wrong-password":"Senha incorreta.",
        "auth/invalid-credential":"Email ou senha incorretos.",
        "auth/email-already-in-use":"Esse email já tem uma conta.",
        "auth/weak-password":"Senha muito fraca (mín. 6 caracteres).",
        "auth/too-many-requests":"Muitas tentativas. Aguarde um pouco.",
        "auth/unauthorized-domain":"Este domínio não está autorizado no Firebase (Authentication → Settings → Authorized domains).",
        "auth/popup-closed-by-user":"Login com Google cancelado.",
        "auth/popup-blocked":"O navegador bloqueou o popup do Google. Permita popups para este site."
    };
    return mapa[code]||("Erro: "+code);
}
