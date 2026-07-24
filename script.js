const input=document.getElementById("pdfFiles");
const list=document.getElementById("list");
const terminal=document.getElementById("terminal");
const bar=document.getElementById("bar");
const bgMusic=document.getElementById("bgMusic");

/* ======================================================
   ÁUDIO — todos os efeitos são gerados via Web Audio API,
   não precisam de nenhum arquivo extra.
====================================================== */
let audioCtx=null;

function getCtx(){
    if(!audioCtx){
        audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    }
    return audioCtx;
}

function playClick(){
    try{
        const ctx=getCtx();
        const osc=ctx.createOscillator();
        const gain=ctx.createGain();
        osc.type="square";
        osc.frequency.value=520+Math.random()*180;
        gain.gain.setValueAtTime(0.05,ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime+0.04);
    }catch(e){}
}

function playDenied(){
    try{
        const ctx=getCtx();
        const osc=ctx.createOscillator();
        const gain=ctx.createGain();
        osc.type="sawtooth";
        osc.frequency.setValueAtTime(180,ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60,ctx.currentTime+0.4);
        gain.gain.setValueAtTime(0.12,ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime+0.45);
    }catch(e){}
}

function playGranted(){
    try{
        const ctx=getCtx();
        const notes=[440,660,880];
        notes.forEach((freq,i)=>{
            const osc=ctx.createOscillator();
            const gain=ctx.createGain();
            osc.type="sine";
            osc.frequency.value=freq;
            const t=ctx.currentTime+i*0.12;
            gain.gain.setValueAtTime(0.001,t);
            gain.gain.exponentialRampToValueAtTime(0.1,t+0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001,t+0.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t+0.22);
        });
    }catch(e){}
}

function playPdfSuccess(){
    try{
        const ctx=getCtx();
        const notes=[523,659,784,1046];
        notes.forEach((freq,i)=>{
            const osc=ctx.createOscillator();
            const gain=ctx.createGain();
            osc.type="triangle";
            osc.frequency.value=freq;
            const t=ctx.currentTime+i*0.1;
            gain.gain.setValueAtTime(0.001,t);
            gain.gain.exponentialRampToValueAtTime(0.12,t+0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001,t+0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t+0.27);
        });
    }catch(e){}
}

function playGlitchNoise(){
    try{
        const ctx=getCtx();
        const bufferSize=ctx.sampleRate*0.25;
        const buffer=ctx.createBuffer(1,bufferSize,ctx.sampleRate);
        const data=buffer.getChannelData(0);
        for(let i=0;i<bufferSize;i++){
            data[i]=(Math.random()*2-1)*(1-i/bufferSize);
        }
        const noise=ctx.createBufferSource();
        noise.buffer=buffer;
        const filter=ctx.createBiquadFilter();
        filter.type="bandpass";
        filter.frequency.value=900+Math.random()*800;
        const gain=ctx.createGain();
        gain.gain.value=0.08;
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
    }catch(e){}
}

function playLockdownAlarm(){
    try{
        const ctx=getCtx();
        const osc=ctx.createOscillator();
        const gain=ctx.createGain();
        osc.type="sawtooth";
        const now=ctx.currentTime;
        osc.frequency.setValueAtTime(440,now);
        osc.frequency.linearRampToValueAtTime(880,now+0.25);
        osc.frequency.linearRampToValueAtTime(440,now+0.5);
        osc.frequency.linearRampToValueAtTime(880,now+0.75);
        gain.gain.setValueAtTime(0.15,now);
        gain.gain.setValueAtTime(0.15,now+0.75);
        gain.gain.exponentialRampToValueAtTime(0.0001,now+1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now+1);
    }catch(e){}
}

/* ======================================================
   CURSOR CUSTOMIZADO
====================================================== */
const cursorDot=document.getElementById("cursorDot");
const cursorRing=document.getElementById("cursorRing");
let ringX=0,ringY=0,mouseX=0,mouseY=0;
let cursorReady=false;

function initCursor(){
    document.body.classList.add("customCursorActive");
    cursorReady=true;
}

let lastTrail=0;

document.addEventListener("mousemove",(e)=>{
    if(!cursorReady) initCursor();
    mouseX=e.clientX;
    mouseY=e.clientY;
    cursorDot.style.left=mouseX+"px";
    cursorDot.style.top=mouseY+"px";

    const now=Date.now();
    if(now-lastTrail>35){
        lastTrail=now;
        const trail=document.createElement("div");
        trail.className="cursor-trail";
        trail.style.left=mouseX+"px";
        trail.style.top=mouseY+"px";
        document.body.appendChild(trail);
        setTimeout(()=>trail.remove(),650);
    }
});

document.addEventListener("mousedown",(e)=>{
    cursorRing.style.width="18px";
    cursorRing.style.height="18px";
    cursorRing.style.borderColor="#ff003c";

    const ripple=document.createElement("div");
    ripple.className="click-ripple";
    ripple.style.left=e.clientX+"px";
    ripple.style.top=e.clientY+"px";
    document.body.appendChild(ripple);
    setTimeout(()=>ripple.remove(),600);
});

document.addEventListener("mouseup",()=>{
    cursorRing.style.width="28px";
    cursorRing.style.height="28px";
    cursorRing.style.borderColor="rgba(0,255,128,.55)";
});

function animateRing(){
    ringX+=(mouseX-ringX)*0.18;
    ringY+=(mouseY-ringY)*0.18;
    cursorRing.style.left=ringX+"px";
    cursorRing.style.top=ringY+"px";
    requestAnimationFrame(animateRing);
}
animateRing();

/* ======================================================
   TELA DE LOGIN — senha fixa "root" + tentativas + bloqueio
====================================================== */
const loginScreen=document.getElementById("loginScreen");
const loginBtn=document.getElementById("loginBtn");
const loginPass=document.getElementById("loginPass");
const loginStatus=document.getElementById("loginStatus");
const accessFlash=document.getElementById("accessFlash");

const SENHA_CORRETA="root";
let failedAttempts=0;
let lockedOut=false;

const tauntMessages=[
    "✖ ACESSO NEGADO — senha incorreta.",
    "✖ ACESSO NEGADO — tentativa 2. Se errar de novo, vou invadir seu Instagram 👀",
    "✖ ACESSO NEGADO — última chance antes do bloqueio total..."
];

function tryLogin(){

    if(lockedOut) return;

    const valor=loginPass.value.trim().toLowerCase();

    if(!valor){
        loginStatus.className="loginStatus denied";
        loginStatus.innerText="⚠ Digite a senha de acesso.";
        return;
    }

    if(valor!==SENHA_CORRETA){
        failedAttempts++;
        playDenied();
        loginPass.value="";

        if(failedAttempts>=3){
            triggerLockout();
            return;
        }

        loginStatus.className="loginStatus denied";
        loginStatus.innerText=tauntMessages[failedAttempts-1];
        return;
    }

    // senha correta
    failedAttempts=0;
    loginBtn.disabled=true;
    loginStatus.className="loginStatus";
    loginStatus.innerText="Verificando credenciais...";
    playClick();

    setTimeout(()=>{
        loginStatus.innerText="Descriptografando sessão...";
    },600);

    setTimeout(()=>{
        loginStatus.className="loginStatus granted";
        loginStatus.innerText="✔ ACESSO CONCEDIDO";
        accessFlash.style.animation="flashOn .8s ease";
        playGranted();
    },1300);

    setTimeout(()=>{
        loginScreen.classList.add("hide");
        startExperience();
    },2100);
}

async function triggerLockout(){
    lockedOut=true;
    loginBtn.disabled=true;
    loginPass.disabled=true;
    playLockdownAlarm();

    loginStatus.className="loginStatus locked";
    loginStatus.innerText="🚨 MUITAS TENTATIVAS DETECTADAS";

    await wait(900);
    loginStatus.innerText="🕵️ Iniciando protocolo de rastreamento...";

    await wait(1000);
    loginStatus.innerText="📡 Obtendo senhas salvas do Instagram... 42%";
    playGlitchNoise();

    await wait(1100);
    loginStatus.innerText="😏 Relaxa, é só brincadeira. Mas o bloqueio é de verdade.";

    await wait(1400);
    startCountdown(25);
}

function startCountdown(seconds){
    let remaining=seconds;
    loginStatus.className="loginStatus locked";

    const interval=setInterval(()=>{
        loginStatus.innerText=`🔒 SISTEMA BLOQUEADO — tente novamente em ${remaining}s`;
        remaining--;

        if(remaining<0){
            clearInterval(interval);
            lockedOut=false;
            failedAttempts=0;
            loginBtn.disabled=false;
            loginPass.disabled=false;
            loginStatus.className="loginStatus";
            loginStatus.innerText="Bloqueio encerrado. Pode tentar novamente.";
        }
    },1000);
}

loginBtn.addEventListener("click",tryLogin);

loginPass.addEventListener("keydown",(e)=>{
    if(!lockedOut) playClick();
    if(e.key==="Enter") tryLogin();
});

function startExperience(){
    boot();
    bgMusic.volume=0.35;
    bgMusic.play().catch(()=>{});
    scheduleAmbientGlitches();
}

/* Botão de mudo/som */
const muteBtn=document.getElementById("muteBtn");
let muted=false;

muteBtn.addEventListener("click",()=>{
    muted=!muted;
    bgMusic.muted=muted;
    muteBtn.innerText=muted?"🔇 MUDO":"🔊 SOM";
    if(!muted && bgMusic.paused){
        bgMusic.play().catch(()=>{});
    }
});

/* Botão de modo claro/escuro */
const themeBtn=document.getElementById("themeBtn");
let lightMode=false;

themeBtn.addEventListener("click",()=>{
    lightMode=!lightMode;
    document.body.classList.toggle("lightMode",lightMode);
    themeBtn.innerText=lightMode?"🌙 MODO ESCURO":"☀️ MODO CLARO";
    playClick();
});

/* Ruídos de interferência aleatórios pra dar clima "dark web" */
function scheduleAmbientGlitches(){
    const delay=15000+Math.random()*20000;
    setTimeout(()=>{
        playGlitchNoise();
        terminalLine("⚠ INTERFERÊNCIA NO SINAL...","#ff003c");
        setTimeout(()=>terminalLine("✔ Sinal estabilizado.","#55ff55"),700);
        scheduleAmbientGlitches();
    },delay);
}

/* ======================================================
   EXTRAS: título assustador ao trocar de aba + easter egg
====================================================== */
const originalTitle=document.title;

document.addEventListener("visibilitychange",()=>{
    if(document.hidden){
        document.title="👀 Volte já...";
    }else{
        document.title=originalTitle;
    }
});

const konami=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
let konamiIndex=0;

document.addEventListener("keydown",(e)=>{
    if(e.key===konami[konamiIndex]){
        konamiIndex++;
        if(konamiIndex===konami.length){
            konamiIndex=0;
            terminalLine("🕶 MODO DEUS ATIVADO — você encontrou o easter egg!","#ff003c");
            playGranted();
        }
    }else{
        konamiIndex=0;
    }
});

/* ======================================================
   LÓGICA ORIGINAL DO SITE (merge de PDF, terminal, boot)
====================================================== */
input.onchange=()=>{
    list.innerHTML="";
    for(let f of input.files){
        list.innerHTML+=`<div>✔ ${f.name}</div>`;
    }
    shell("📂 Detectados "+input.files.length+" PDFs.");
}

function log(text){
    terminal.innerHTML+=`
    <div>
    <span style="color:#55ff55;">┌──(root㉿ca1m)-[~/CyberPDF]</span>
    <br>
    <span style="color:#00ff80;">└─$</span>
    ${text}
    <span class="cursor">█</span>
    </div><br>
    `;
    terminal.scrollTop=terminal.scrollHeight;
}

function toast(msg){
    const t=document.getElementById("toast");
    t.innerHTML=msg;
    t.style.display="block";
    setTimeout(()=>{t.style.display="none";},3000);
}

function terminalLine(text,color="#00ff80"){
    terminal.innerHTML+=`<div style="color:${color};margin:2px 0;">${text}</div>`;
    terminal.scrollTop=terminal.scrollHeight;
}

async function typeLine(text,color="#00ff80"){
    const div=document.createElement("div");
    div.style.color=color;
    div.style.margin="2px 0";
    div.style.whiteSpace="pre";
    terminal.appendChild(div);

    for(let i=0;i<text.length;i++){
        div.textContent+=text[i];
        if(text[i]!==" ") playClick();
        terminal.scrollTop=terminal.scrollHeight;
        await wait(14);
    }
}

function shell(text){
    terminal.innerHTML+=`
    <div style="margin-top:8px;">
        <span style="color:#66ff66;">┌──(root㉿ca1m)-[~/CyberPDF]</span><br>
        <span style="color:#00ff80;">└─$</span>
        ${text}
        <span class="cursor">█</span>
    </div>
    `;
    terminal.scrollTop=terminal.scrollHeight;
}

async function boot(){
    terminal.innerHTML="";

    terminalLine("██████╗ ██████╗ ███████╗");
    terminalLine("██╔══██╗██╔══██╗██╔════╝");
    terminalLine("██████╔╝██║  ██║█████╗  ");
    terminalLine("██╔═══╝ ██║  ██║██╔══╝  ");
    terminalLine("██║     ██████╔╝██║     ");
    terminalLine("╚═╝     ╚═════╝ ╚═╝     ");

    await wait(500);
    terminalLine("");

    await typeLine("[ OK ] Booting CyberPDF Engine...","#7CFF9A");
    await typeLine("[ OK ] Loading PDF-LIB","#7CFF9A");
    await typeLine("[ OK ] Initializing Memory","#7CFF9A");
    await typeLine("[ OK ] Loading Security Modules","#7CFF9A");
    await typeLine("[ OK ] Loading Merge Engine","#7CFF9A");
    await typeLine("[ OK ] Kernel Loaded","#7CFF9A");

    await wait(400);
    terminalLine("");
    terminalLine("✔ Secure Mode Enabled","#55ff55");
    terminalLine("✔ Encryption Active","#55ff55");
    terminalLine("✔ Waiting for PDF files...","#55ff55");
    terminalLine("");

    shell("Engine Ready.");

    await wait(2200);
    await typeLine("⚠ UNKNOWN CONNECTION DETECTED...","#ff003c");
    await typeLine("⚠ ANALYZING TRAFFIC...","#ff003c");
    await wait(300);
    terminalLine("✔ CONNECTION BLOCKED. Firewall OK.","#55ff55");
    terminalLine("");
}

function wait(ms){
    return new Promise(resolve=>setTimeout(resolve,ms));
}

async function mergePDFs(){
    const files=input.files;

    if(!files.length){
        toast("Selecione PDFs.");
        return;
    }

    log("⚙ Inicializando PDF Engine...");

    const merged=await PDFLib.PDFDocument.create();

    for(let i=0;i<files.length;i++){
        log("📄 Processando "+files[i].name);
        const buffer=await files[i].arrayBuffer();
        const pdf=await PDFLib.PDFDocument.load(buffer);
        const pages=await merged.copyPages(pdf,pdf.getPageIndices());
        pages.forEach(p=>merged.addPage(p));
        bar.style.width=((i+1)/files.length*100)+"%";
    }

    shell("📄 Processando ...");
    shell("🧩 Copiando páginas...");
    shell("⚙ Gerando PDF...");
    shell("💾 Iniciando Download...");

    const bytes=await merged.save();
    const blob=new Blob([bytes],{type:"application/pdf"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="PDF_UNIFICADO.pdf";
    a.click();

    toast("✔ PDF_UNIFICADO.pdf criado com sucesso");
    shell("✔ Operação concluída.");
    playPdfSuccess();
}

/* ======================================================
   NOVO BOTÃO: Gerador de chave/senha segura
====================================================== */
async function generateKey(){
    const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
    const length=20;
    const randomValues=new Uint32Array(length);
    crypto.getRandomValues(randomValues);
    const key=Array.from(randomValues,x=>chars[x%chars.length]).join("");

    await typeLine("🔑 Gerando chave segura...","#00e5ff");
    await typeLine("KEY> "+key,"#00ff80");

    try{
        await navigator.clipboard.writeText(key);
        toast("🔑 Chave copiada para a área de transferência!");
    }catch(e){
        toast("🔑 Chave gerada (copie manualmente do terminal).");
    }
}

/* ======================================================
   Chuva de código estilo Matrix no fundo
====================================================== */
(function(){
    const canvas=document.getElementById("matrix");
    const ctx=canvas.getContext("2d");

    function resize(){
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
    }
    resize();
    window.addEventListener("resize",resize);

    const chars="01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize=16;
    let columns=Math.floor(canvas.width/fontSize);
    let drops=new Array(columns).fill(1);

    function draw(){
        ctx.fillStyle="rgba(0,0,0,0.08)";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle="#00ff80";
        ctx.font=fontSize+"px monospace";

        for(let i=0;i<drops.length;i++){
            const text=chars[Math.floor(Math.random()*chars.length)];
            ctx.fillText(text,i*fontSize,drops[i]*fontSize);
            if(drops[i]*fontSize>canvas.height && Math.random()>0.975){
                drops[i]=0;
            }
            drops[i]++;
        }
    }

    setInterval(draw,50);
})();
