const input=document.getElementById("pdfFiles");
const list=document.getElementById("list");
const terminal=document.getElementById("terminal");
const bar=document.getElementById("bar");
const bgMusic=document.getElementById("bgMusic");

/* ======================================================
   ÁUDIO — gerado via Web Audio API, sem arquivos extras
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

function playDenied(){
    try{
        const ctx=getCtx();
        const osc=ctx.createOscillator();
        const gain=ctx.createGain();
        osc.type="sawtooth";
        osc.frequency.setValueAtTime(180,ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60,ctx.currentTime+0.4);
        gain.gain.setValueAtTime(0.1,ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime+0.45);
    }catch(e){}
}

function playJump(){
    try{
        const ctx=getCtx();
        const osc=ctx.createOscillator();
        const gain=ctx.createGain();
        osc.type="square";
        osc.frequency.setValueAtTime(300,ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600,ctx.currentTime+0.1);
        gain.gain.setValueAtTime(0.08,ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime+0.15);
    }catch(e){}
}

function playGameOver(){
    try{
        const ctx=getCtx();
        const osc=ctx.createOscillator();
        const gain=ctx.createGain();
        osc.type="sawtooth";
        osc.frequency.setValueAtTime(300,ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80,ctx.currentTime+0.5);
        gain.gain.setValueAtTime(0.1,ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime+0.55);
    }catch(e){}
}

/* ======================================================
   CURSOR CUSTOMIZADO — só ativa em dispositivos com mouse
====================================================== */
const cursorDot=document.getElementById("cursorDot");
const cursorRing=document.getElementById("cursorRing");
let ringX=0,ringY=0,mouseX=0,mouseY=0;
let cursorReady=false;

const isTouchDevice=window.matchMedia("(pointer: coarse)").matches;

function initCursor(){
    if(isTouchDevice) return;
    document.body.classList.add("customCursorActive");
    cursorReady=true;
}

let lastTrail=0;

if(!isTouchDevice){

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

}else{
    cursorDot.style.display="none";
    cursorRing.style.display="none";
}

/* ======================================================
   ABAS DE FERRAMENTAS
====================================================== */
const tabBtns=document.querySelectorAll(".tabBtn");
const tabPanels=document.querySelectorAll(".tabPanel");

tabBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
        const group=btn.closest(".appSection");
        const scopedBtns=group?group.querySelectorAll(".tabBtn"):tabBtns;
        const scopedPanels=group?group.querySelectorAll(".tabPanel"):tabPanels;

        scopedBtns.forEach(b=>b.classList.remove("active"));
        scopedPanels.forEach(p=>p.classList.remove("active"));

        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");

        playClick();

        if(btn.dataset.tab==="tabGame"){
            initGameIfNeeded();
        }

        if(btn.dataset.tab==="tabHistory"){
            loadHistory();
        }

        if(btn.dataset.tab==="tabAdmin"){
            loadAdminDashboard();
        }
    });
});

/* ======================================================
   MODO DEV — bypass local do login, só pra testar o site
   sem precisar subir pro GitHub Pages toda hora (o login
   real do Firebase exige HTTPS, então não roda em localhost).

   AVISO IMPORTANTE: isso NÃO é segurança de verdade. Qualquer
   pessoa que abrir o código-fonte (Ctrl+U) vê essa senha. Ela
   só existe pra te poupar de re-upload constante durante o
   desenvolvimento, e NÃO concede acesso real ao Firestore —
   sem login de verdade, todas as gravações no banco continuam
   bloqueadas pelas regras de segurança (então não é uma brecha).

   Pra desativar quando terminar os testes, rode isso uma vez
   no console do navegador (F12 → Console):
       localStorage.removeItem('devBypass')
====================================================== */
const DEV_PASSWORD="root";

document.getElementById("devAccessLink").addEventListener("click",()=>{
    const pass=prompt("Senha de acesso local (modo dev):");
    if(pass===DEV_PASSWORD){
        localStorage.setItem("devBypass","true");
        location.reload();
    }else if(pass!==null){
        alert("Senha incorreta.");
    }
});

if(localStorage.getItem("devBypass")==="true"){
    const badge=document.getElementById("devModeBadge");
    badge.style.display="inline-block";
    badge.addEventListener("click",()=>{
        localStorage.removeItem("devBypass");
        location.reload();
    });

    // setTimeout(...,0) garante que isso só roda DEPOIS que todo o
    // resto do script.js (inclusive quem escuta "cyberAuthReady")
    // já registrou seus listeners. Sem isso, o evento disparava
    // antes de existir alguém escutando, e o site ficava em branco.
    setTimeout(()=>{
        document.getElementById("loginScreen").classList.add("hide");
        document.dispatchEvent(new CustomEvent("cyberAuthReady",{detail:{user:null}}));
    },0);
}

/* ======================================================
   HUB — escolha entre PDF TOOLS, CYBER TOOLS e GAME ZONE
====================================================== */
const hubScreen=document.getElementById("hubScreen");
const windowFrame=document.getElementById("windowFrame");
const mainTitle=document.getElementById("mainTitle");
const windowTitle=document.getElementById("windowTitle");
const pdfSection=document.getElementById("pdfSection");
const cyberSection=document.getElementById("cyberSection");
const gameSection=document.getElementById("gameSection");
const allSections={pdf:pdfSection,cyber:cyberSection,game:gameSection};

let experienceStarted=false;
let currentSection="pdf";

function showSection(section){
    closeGlobalSection();
    hubScreen.classList.remove("show");
    windowFrame.classList.add("show");
    currentSection=section;

    Object.entries(allSections).forEach(([key,el])=>{
        el.classList.toggle("active",key===section);
    });

    if(section==="pdf"){
        mainTitle.innerText="CYBER PDF SUITE";
        windowTitle.innerText="root@kali:~# ./pdf-tools.sh";
    }else if(section==="cyber"){
        mainTitle.innerText="CYBER OSINT SUITE";
        windowTitle.innerText="root@kali:~# ./cyber-tools.sh";
    }else{
        mainTitle.innerText="GAME ZONE";
        windowTitle.innerText="root@kali:~# ./firewall-runner.sh";
        initGameIfNeeded();
    }

    if(!experienceStarted){
        experienceStarted=true;
        startExperience();
    }
}

document.getElementById("hubPdfBtn").addEventListener("click",()=>{playClick();showSection("pdf");});
document.getElementById("hubCyberBtn").addEventListener("click",()=>{playClick();showSection("cyber");});
document.getElementById("hubGameBtn").addEventListener("click",()=>{playClick();showSection("game");});

document.getElementById("hubReturnBtn").addEventListener("click",()=>{
    playClick();
    windowFrame.classList.remove("show");
    hubScreen.classList.add("show");
});

/* ---- Histórico e Admin: acessíveis de qualquer módulo ---- */
const globalHistorySection=document.getElementById("globalHistorySection");
const globalAdminSection=document.getElementById("globalAdminSection");

function closeGlobalSection(){
    globalHistorySection.classList.remove("show");
    globalAdminSection.classList.remove("show");
    Object.values(allSections).forEach(el=>{
        if(currentSection && allSections[currentSection]===el){
            el.classList.add("active");
        }
    });
}

document.getElementById("globalHistoryBtn").addEventListener("click",()=>{
    playClick();
    Object.values(allSections).forEach(el=>el.classList.remove("active"));
    globalAdminSection.classList.remove("show");
    globalHistorySection.classList.add("show");
    loadHistory();
});

document.getElementById("adminTabBtn").addEventListener("click",()=>{
    playClick();
    Object.values(allSections).forEach(el=>el.classList.remove("active"));
    globalHistorySection.classList.remove("show");
    globalAdminSection.classList.add("show");
    loadAdminDashboard();
});

/* ======================================================
   INÍCIO DA EXPERIÊNCIA — disparado pelo auth-firebase.js
   assim que o login/cadastro é confirmado de verdade
====================================================== */
document.addEventListener("cyberAuthReady",()=>{
    hubScreen.classList.add("show");

    if(window.CyberAuth && window.CyberAuth.isAdmin){
        document.getElementById("adminTabBtn").style.display="inline-block";
    }
});

function startExperience(){
    boot();
    bgMusic.volume=0.25;
    bgMusic.play().catch(()=>{});
}

/* Botão de mudo/som */
const muteBtn=document.getElementById("muteBtn");
let muted=false;

muteBtn.addEventListener("click",()=>{
    muted=!muted;
    bgMusic.muted=muted;
    muteBtn.innerText=muted?"🔇":"🔊";
    if(!muted && bgMusic.paused){
        bgMusic.play().catch(()=>{});
    }
});

/* ======================================================
   COOKIES ESSENCIAIS (sem bibliotecas externas)
====================================================== */
function setCookie(name,value,days){
    const expires=new Date(Date.now()+days*864e5).toUTCString();
    document.cookie=name+"="+encodeURIComponent(value)+"; expires="+expires+"; path=/; SameSite=Lax";
}

function getCookie(name){
    const match=document.cookie.match(new RegExp("(?:^|; )"+name+"=([^;]*)"));
    return match?decodeURIComponent(match[1]):null;
}

/* Botão de modo claro/escuro — preferência salva em cookie essencial */
const themeBtn=document.getElementById("themeBtn");
let lightMode=getCookie("theme")==="light";

if(lightMode){
    document.body.classList.add("lightMode");
    themeBtn.innerText="🌙";
}

themeBtn.addEventListener("click",()=>{
    lightMode=!lightMode;
    document.body.classList.toggle("lightMode",lightMode);
    themeBtn.innerText=lightMode?"🌙":"☀️";
    setCookie("theme",lightMode?"light":"dark",365);
    playClick();
});

/* Banner de aviso de cookies essenciais */
const cookieBanner=document.getElementById("cookieBanner");
if(!getCookie("cookieConsent")){
    cookieBanner.classList.add("show");
}

document.getElementById("cookieAcceptBtn").addEventListener("click",()=>{
    setCookie("cookieConsent","1",365);
    cookieBanner.classList.remove("show");
});

/* ======================================================
   GUARDA DE AUTENTICAÇÃO — usada em toda ferramenta.
   Bloqueia a ação de verdade (não é só esconder um botão)
   caso a pessoa tente burlar a tela de login inspecionando
   e apagando elementos: sem sessão real do Firebase, as
   funções abaixo recusam executar.
====================================================== */
function requireAuth(){
    if(localStorage.getItem("devBypass")==="true") return true;
    if(!window.CyberAuth || !window.CyberAuth.currentUser){
        toast("🔒 Faça login para usar esta ferramenta.");
        return false;
    }
    return true;
}

/* ======================================================
   HISTÓRICO (Firestore, via auth-firebase.js)
====================================================== */
async function loadHistory(){
    const container=document.getElementById("historyList");

    if(!window.CyberAuth || !window.CyberAuth.currentUser){
        container.innerHTML="<p class='fieldLabel small'>Faça login para ver seu histórico.</p>";
        return;
    }

    container.innerHTML="<p class='fieldLabel small'>Carregando...</p>";

    const history=await window.CyberAuth.getHistory();

    if(!history.length){
        container.innerHTML="<p class='fieldLabel small'>Nenhuma ação registrada ainda.</p>";
        return;
    }

    container.innerHTML="";

    history.forEach(item=>{
        const div=document.createElement("div");
        div.className="historyItem";

        let dataStr="";
        try{
            if(item.timestamp && item.timestamp.toDate){
                dataStr=item.timestamp.toDate().toLocaleString("pt-BR");
            }
        }catch(e){}

        div.innerHTML=`<span class="histType">${item.type}</span> — ${item.details||""}<br><span class="histTime">${dataStr}</span>`;
        container.appendChild(div);
    });
}

function logAction(type,details){
    if(window.CyberAuth && window.CyberAuth.logAction){
        window.CyberAuth.logAction(type,details);
    }
}

/* ======================================================
   PAINEL ADMIN (só aparece pra quem tem isAdmin:true)
====================================================== */
async function loadAdminDashboard(){
    if(!window.CyberAuth || !window.CyberAuth.isAdmin){
        return;
    }

    const totalEl=document.getElementById("adminTotalUsers");
    const statsEl=document.getElementById("adminActionStats");
    const sessionsEl=document.getElementById("adminSessions");

    totalEl.innerText="…";
    statsEl.innerHTML="<div>Carregando...</div>";
    sessionsEl.innerHTML="<div>Carregando...</div>";

    const total=await window.CyberAuth.getTotalUsers();
    totalEl.innerText=total===null?"?":total;

    const stats=await window.CyberAuth.getActionStatsAll();
    if(!stats.length){
        statsEl.innerHTML="<div>Nenhum dado ainda.</div>";
    }else{
        statsEl.innerHTML=stats.map(([type,count])=>`<div>${type} — ${count}x</div>`).join("");
    }

    const sessions=await window.CyberAuth.getRecentSessionsAll();
    if(!sessions.length){
        sessionsEl.innerHTML="<div>Nenhuma sessão ainda.</div>";
    }else{
        sessionsEl.innerHTML=sessions.map(s=>{
            let dataStr="";
            try{ if(s.timestamp && s.timestamp.toDate) dataStr=s.timestamp.toDate().toLocaleString("pt-BR"); }catch(e){}
            return `<div>${s.email||"?"} — ${s.city||"?"}/${s.country||"?"} — ${s.ip||"?"}<br><small>${dataStr}</small></div>`;
        }).join("");
    }
}

/* ======================================================
   Botão "remover arquivo selecionado" — usado em todas as
   ferramentas de PDF que têm upload
====================================================== */
function clearFileInput(inputId,displayId){
    const input=document.getElementById(inputId);
    if(input) input.value="";

    const display=document.getElementById(displayId);
    if(display) display.innerHTML="";

    toast("🗑 Seleção removida.");
    playClick();
}

/* ======================================================
   ARRASTAR E SOLTAR (drag & drop) em todas as zonas
   de upload — antes só era possível clicar pra escolher
====================================================== */
document.querySelectorAll(".drop").forEach(dropZone=>{
    const input=dropZone.querySelector("input[type='file']");
    if(!input) return;

    dropZone.addEventListener("dragover",(e)=>{
        e.preventDefault();
        dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave",()=>{
        dropZone.classList.remove("dragover");
    });

    dropZone.addEventListener("drop",(e)=>{
        e.preventDefault();
        dropZone.classList.remove("dragover");

        if(e.dataTransfer.files && e.dataTransfer.files.length){
            input.files=e.dataTransfer.files;
            input.dispatchEvent(new Event("change"));
        }
    });
});

/* ======================================================
   LÓGICA DE PDF: UNIFICAR / EXTRAIR / TERMINAL / BOOT
====================================================== */
input.onchange=()=>{
    list.innerHTML="";
    for(let f of input.files){
        list.innerHTML+=`<div>✔ ${f.name}</div>`;
    }
    shell("📂 Detectados "+input.files.length+" PDFs.");
}

const extractInput=document.getElementById("pdfExtractFile");
const extractFileName=document.getElementById("extractFileName");
extractInput.onchange=()=>{
    if(extractInput.files.length) extractFileName.innerText="📄 "+extractInput.files[0].name;
};

const watermarkInput=document.getElementById("pdfWatermarkFile");
const watermarkFileName=document.getElementById("watermarkFileName");
watermarkInput.onchange=()=>{
    if(watermarkInput.files.length) watermarkFileName.innerText="📄 "+watermarkInput.files[0].name;
};

const compressInput=document.getElementById("pdfCompressFile");
const compressFileName=document.getElementById("compressFileName");
compressInput.onchange=()=>{
    if(compressInput.files.length) compressFileName.innerText="📄 "+compressInput.files[0].name;
};

const pageNumInput=document.getElementById("pdfPageNumFile");
const pageNumFileName=document.getElementById("pageNumFileName");
pageNumInput.onchange=()=>{
    if(pageNumInput.files.length) pageNumFileName.innerText="📄 "+pageNumInput.files[0].name;
};

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

/* Boot enxuto — sem "invasão detectada" nem ruído repetitivo,
   só a inicialização do sistema mesmo */
async function boot(){
    terminal.innerHTML="";

    terminalLine("██████╗ ██████╗ ███████╗");
    terminalLine("██╔══██╗██╔══██╗██╔════╝");
    terminalLine("██████╔╝██║  ██║█████╗  ");
    terminalLine("██╔═══╝ ██║  ██║██╔══╝  ");
    terminalLine("██║     ██████╔╝██║     ");
    terminalLine("╚═╝     ╚═════╝ ╚═╝     ");

    await wait(400);
    terminalLine("");

    await typeLine("[ OK ] Booting CyberPDF Engine...","#7CFF9A");
    await typeLine("[ OK ] Loading PDF-LIB","#7CFF9A");
    await typeLine("[ OK ] Loading OSINT Modules","#7CFF9A");
    await typeLine("[ OK ] Kernel Loaded","#7CFF9A");

    await wait(300);
    terminalLine("");
    terminalLine("✔ Sistema pronto.","#55ff55");
    terminalLine("");
}

function wait(ms){
    return new Promise(resolve=>setTimeout(resolve,ms));
}

async function mergePDFs(){
    if(!requireAuth()) return;
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

    shell("💾 Gerando PDF unificado...");

    const bytes=await merged.save();
    const blob=new Blob([bytes],{type:"application/pdf"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="PDF_UNIFICADO.pdf";
    a.click();

    toast("✔ PDF_UNIFICADO.pdf criado com sucesso");
    shell("✔ Operação concluída.");
    playPdfSuccess();
    logAction("merge",files.length+" arquivos unificados");
}

/* ---- Extrair páginas específicas ---- */
function parsePageRange(rangeStr,totalPages){
    const pages=new Set();
    const parts=rangeStr.split(",").map(p=>p.trim()).filter(Boolean);

    for(const part of parts){
        if(part.includes("-")){
            const [startStr,endStr]=part.split("-").map(s=>s.trim());
            const start=parseInt(startStr,10);
            const end=parseInt(endStr,10);
            if(!isNaN(start)&&!isNaN(end)){
                for(let p=start;p<=end;p++){
                    if(p>=1&&p<=totalPages) pages.add(p-1);
                }
            }
        }else{
            const p=parseInt(part,10);
            if(!isNaN(p)&&p>=1&&p<=totalPages) pages.add(p-1);
        }
    }

    return Array.from(pages).sort((a,b)=>a-b);
}

async function extractPages(){
    if(!requireAuth()) return;
    const file=extractInput.files[0];
    const rangeStr=document.getElementById("pageRange").value.trim();

    if(!file){ toast("Selecione um PDF primeiro."); return; }
    if(!rangeStr){ toast("Informe as páginas (ex: 1-3,5)."); return; }

    shell("✂ Carregando "+file.name+"...");

    const buffer=await file.arrayBuffer();
    const srcDoc=await PDFLib.PDFDocument.load(buffer);
    const totalPages=srcDoc.getPageCount();
    const indices=parsePageRange(rangeStr,totalPages);

    if(!indices.length){
        toast("Intervalo de páginas inválido.");
        return;
    }

    shell("🧩 Extraindo páginas: "+indices.map(i=>i+1).join(", "));

    const newDoc=await PDFLib.PDFDocument.create();
    const copiedPages=await newDoc.copyPages(srcDoc,indices);
    copiedPages.forEach(p=>newDoc.addPage(p));

    const bytes=await newDoc.save();
    const blob=new Blob([bytes],{type:"application/pdf"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="PDF_EXTRAIDO.pdf";
    a.click();

    toast("✔ PDF_EXTRAIDO.pdf criado com sucesso");
    shell("✔ Extração concluída ("+indices.length+" páginas).");
    playPdfSuccess();
    logAction("extract",indices.length+" páginas extraídas de "+file.name);
}

/* ---- Marca d'água ---- */
async function addWatermark(){
    if(!requireAuth()) return;
    const file=watermarkInput.files[0];
    const text=document.getElementById("watermarkText").value.trim();

    if(!file){ toast("Selecione um PDF primeiro."); return; }
    if(!text){ toast("Digite o texto da marca d'água."); return; }

    shell("💧 Aplicando marca d'água...");

    const buffer=await file.arrayBuffer();
    const pdfDoc=await PDFLib.PDFDocument.load(buffer);
    const pages=pdfDoc.getPages();
    const font=await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);

    pages.forEach(page=>{
        const {width,height}=page.getSize();
        const fontSize=Math.min(width,height)/9;

        page.drawText(text,{
            x:width/2 - (text.length*fontSize)/4.2,
            y:height/2,
            size:fontSize,
            font:font,
            color:PDFLib.rgb(1,0,0.15),
            opacity:0.25,
            rotate:PDFLib.degrees(-35)
        });
    });

    const bytes=await pdfDoc.save();
    const blob=new Blob([bytes],{type:"application/pdf"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="PDF_MARCADO.pdf";
    a.click();

    toast("✔ PDF_MARCADO.pdf criado com sucesso");
    shell("✔ Marca d'água aplicada.");
    playPdfSuccess();
    logAction("watermark","marca d'água \""+text+"\" aplicada em "+file.name);
}

/* ---- Comprimir PDF ---- */
async function compressPDF(){
    if(!requireAuth()) return;
    const file=compressInput.files[0];
    const resultDiv=document.getElementById("compressResult");

    if(!file){ toast("Selecione um PDF primeiro."); return; }

    shell("📦 Carregando "+file.name+"...");

    const buffer=await file.arrayBuffer();
    const originalSize=buffer.byteLength;

    const pdfDoc=await PDFLib.PDFDocument.load(buffer);

    pdfDoc.setTitle("");
    pdfDoc.setAuthor("");
    pdfDoc.setSubject("");
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer("");
    pdfDoc.setCreator("");

    shell("📦 Otimizando estrutura interna...");

    const bytes=await pdfDoc.save({useObjectStreams:true});
    const newSize=bytes.byteLength;
    const reduction=(((originalSize-newSize)/originalSize)*100).toFixed(1);

    const blob=new Blob([bytes],{type:"application/pdf"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="PDF_COMPRIMIDO.pdf";
    a.click();

    const origKB=(originalSize/1024).toFixed(1);
    const newKB=(newSize/1024).toFixed(1);

    resultDiv.innerText=`Original: ${origKB} KB → Novo: ${newKB} KB (${reduction>0?"-"+reduction:reduction}%)`;

    toast("✔ PDF_COMPRIMIDO.pdf criado com sucesso");
    shell("✔ Compressão concluída: "+origKB+" KB → "+newKB+" KB");
    playPdfSuccess();
    logAction("compress",origKB+"KB → "+newKB+"KB ("+file.name+")");
}

/* ---- Numerar páginas ---- */
async function addPageNumbers(){
    if(!requireAuth()) return;
    const file=pageNumInput.files[0];

    if(!file){ toast("Selecione um PDF primeiro."); return; }

    shell("🔢 Numerando páginas...");

    const buffer=await file.arrayBuffer();
    const pdfDoc=await PDFLib.PDFDocument.load(buffer);
    const pages=pdfDoc.getPages();
    const font=await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

    pages.forEach((page,i)=>{
        const {width}=page.getSize();
        const text=`${i+1} / ${pages.length}`;

        page.drawText(text,{
            x:width/2-18,
            y:18,
            size:11,
            font:font,
            color:PDFLib.rgb(0,0,0)
        });
    });

    const bytes=await pdfDoc.save();
    const blob=new Blob([bytes],{type:"application/pdf"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="PDF_NUMERADO.pdf";
    a.click();

    toast("✔ PDF_NUMERADO.pdf criado com sucesso");
    shell("✔ Numeração aplicada em "+pages.length+" páginas.");
    playPdfSuccess();
    logAction("pageNumbers",pages.length+" páginas numeradas em "+file.name);
}

/* ---- Rotacionar páginas ---- */
const rotateInput=document.getElementById("pdfRotateFile");
const rotateFileName=document.getElementById("rotateFileName");
rotateInput.onchange=()=>{
    if(rotateInput.files.length) rotateFileName.innerText="📄 "+rotateInput.files[0].name;
};

let selectedAngle=90;
document.querySelectorAll(".angleBtn").forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelectorAll(".angleBtn").forEach(b=>b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedAngle=parseInt(btn.dataset.angle,10);
        playClick();
    });
});
document.querySelector(".angleBtn[data-angle='90']").classList.add("selected");

async function rotatePages(){
    if(!requireAuth()) return;
    const file=rotateInput.files[0];

    if(!file){ toast("Selecione um PDF primeiro."); return; }

    shell("🔄 Rotacionando páginas em "+selectedAngle+"°...");

    const buffer=await file.arrayBuffer();
    const pdfDoc=await PDFLib.PDFDocument.load(buffer);
    const pages=pdfDoc.getPages();

    pages.forEach(page=>{
        const current=page.getRotation().angle;
        page.setRotation(PDFLib.degrees(current+selectedAngle));
    });

    const bytes=await pdfDoc.save();
    const blob=new Blob([bytes],{type:"application/pdf"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="PDF_ROTACIONADO.pdf";
    a.click();

    toast("✔ PDF_ROTACIONADO.pdf criado com sucesso");
    shell("✔ "+pages.length+" página(s) rotacionada(s) em "+selectedAngle+"°.");
    playPdfSuccess();
    logAction("rotate",pages.length+" páginas rotacionadas "+selectedAngle+"° em "+file.name);
}

/* ---- Dividir PDF em vários arquivos (a cada N páginas) ---- */
const splitInput=document.getElementById("pdfSplitFile");
document.getElementById("pdfSplitFile").onchange=()=>{
    if(splitInput.files.length) document.getElementById("splitFileName").innerText="📄 "+splitInput.files[0].name;
};

async function splitPdf(){
    if(!requireAuth()) return;
    if(typeof zip==="undefined"){
        toast("⚠ Biblioteca de compactação não carregou. Recarregue a página.");
        return;
    }

    const file=splitInput.files[0];
    const every=parseInt(document.getElementById("splitEveryInput").value,10)||1;

    if(!file){ toast("Selecione um PDF primeiro."); return; }

    shell("🪓 Dividindo "+file.name+" a cada "+every+" página(s)...");

    const buffer=await file.arrayBuffer();
    const srcDoc=await PDFLib.PDFDocument.load(buffer);
    const totalPages=srcDoc.getPageCount();

    const blobWriter=new zip.BlobWriter("application/zip");
    const writer=new zip.ZipWriter(blobWriter);

    let partNumber=1;
    for(let start=0;start<totalPages;start+=every){
        const end=Math.min(start+every,totalPages);
        const indices=[];
        for(let p=start;p<end;p++) indices.push(p);

        const newDoc=await PDFLib.PDFDocument.create();
        const copied=await newDoc.copyPages(srcDoc,indices);
        copied.forEach(p=>newDoc.addPage(p));

        const partBytes=await newDoc.save();
        await writer.add("parte_"+partNumber+".pdf",new zip.BlobReader(new Blob([partBytes],{type:"application/pdf"})));

        shell("📄 Parte "+partNumber+" gerada (páginas "+(start+1)+"-"+end+")");
        partNumber++;
    }

    await writer.close();
    const zipBlob=await blobWriter.getData();

    const a=document.createElement("a");
    a.href=URL.createObjectURL(zipBlob);
    a.download="PDF_DIVIDIDO.zip";
    a.click();

    toast("✔ PDF_DIVIDIDO.zip criado com "+(partNumber-1)+" arquivo(s)");
    shell("✔ Divisão concluída: "+(partNumber-1)+" arquivo(s) no zip.");
    playPdfSuccess();
    logAction("split",(partNumber-1)+" partes geradas de "+file.name);
}

/* ---- Remover páginas específicas ---- */
const removePagesInputFile=document.getElementById("pdfRemovePagesFile");
document.getElementById("pdfRemovePagesFile").onchange=()=>{
    if(removePagesInputFile.files.length) document.getElementById("removePagesFileName").innerText="📄 "+removePagesInputFile.files[0].name;
};

async function removePages(){
    if(!requireAuth()) return;

    const file=removePagesInputFile.files[0];
    const rangeStr=document.getElementById("removePagesInput").value.trim();

    if(!file){ toast("Selecione um PDF primeiro."); return; }
    if(!rangeStr){ toast("Informe as páginas a remover (ex: 2,4-6)."); return; }

    shell("🗑 Carregando "+file.name+"...");

    const buffer=await file.arrayBuffer();
    const srcDoc=await PDFLib.PDFDocument.load(buffer);
    const totalPages=srcDoc.getPageCount();

    const toRemove=new Set(parsePageRange(rangeStr,totalPages));
    const keepIndices=[];
    for(let i=0;i<totalPages;i++){
        if(!toRemove.has(i)) keepIndices.push(i);
    }

    if(!keepIndices.length){
        toast("Isso removeria todas as páginas — operação cancelada.");
        return;
    }

    shell("🗑 Removendo "+toRemove.size+" página(s), mantendo "+keepIndices.length+"...");

    const newDoc=await PDFLib.PDFDocument.create();
    const copied=await newDoc.copyPages(srcDoc,keepIndices);
    copied.forEach(p=>newDoc.addPage(p));

    const bytes=await newDoc.save();
    const blob=new Blob([bytes],{type:"application/pdf"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="PDF_SEM_PAGINAS.pdf";
    a.click();

    toast("✔ PDF_SEM_PAGINAS.pdf criado com sucesso");
    shell("✔ "+toRemove.size+" página(s) removida(s).");
    playPdfSuccess();
    logAction("removePages",toRemove.size+" páginas removidas de "+file.name);
}

/* ---- Converter imagens (JPG/PNG) em PDF ---- */
const imgInput=document.getElementById("imgFiles");
const imgList=document.getElementById("imgList");

imgInput.onchange=()=>{
    imgList.innerHTML="";
    for(let f of imgInput.files){
        imgList.innerHTML+=`<div>🖼 ${f.name}</div>`;
    }
};

async function imagesToPdf(){
    if(!requireAuth()) return;
    const files=imgInput.files;

    if(!files.length){ toast("Selecione ao menos uma imagem."); return; }

    shell("🖼 Convertendo "+files.length+" imagem(ns) em PDF...");

    const pdfDoc=await PDFLib.PDFDocument.create();

    for(let i=0;i<files.length;i++){
        const file=files[i];
        shell("🖼 Processando "+file.name);

        const bytes=await file.arrayBuffer();
        let image;

        if(file.type==="image/png"){
            image=await pdfDoc.embedPng(bytes);
        }else{
            image=await pdfDoc.embedJpg(bytes);
        }

        const page=pdfDoc.addPage([image.width,image.height]);
        page.drawImage(image,{x:0,y:0,width:image.width,height:image.height});

        bar.style.width=((i+1)/files.length*100)+"%";
    }

    const pdfBytes=await pdfDoc.save();
    const blob=new Blob([pdfBytes],{type:"application/pdf"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="IMAGENS_PARA_PDF.pdf";
    a.click();

    toast("✔ IMAGENS_PARA_PDF.pdf criado com sucesso");
    shell("✔ "+files.length+" imagem(ns) convertida(s) em PDF.");
    playPdfSuccess();
    logAction("img2pdf",files.length+" imagens convertidas em PDF");
}

/* Resolve o pdfjsLib não importa qual nome global a versão usa
   (algumas versões expõem window.pdfjsLib, outras
   window['pdfjs-dist/build/pdf']) */
const pdfjsLib=window.pdfjsLib||window["pdfjs-dist/build/pdf"];

if(pdfjsLib){
    pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.3.122/legacy/build/pdf.worker.min.js";
}else{
    console.warn("pdf.js não carregou — PDF->Imagem, PDF->Word, PDF->Excel e PDF->PowerPoint não vão funcionar.");
}

/* Função auxiliar: renderiza cada página de um PDF em um canvas e
   devolve um array de dataURLs (PNG) — usada por PDF->Imagem e
   PDF->PowerPoint */
async function renderPdfPagesToImages(buffer,scale=1.5){
    if(!pdfjsLib){ toast("✖ Biblioteca de PDF não carregou. Recarregue a página."); throw new Error("pdfjsLib indisponível"); }
    const pdf=await pdfjsLib.getDocument({data:buffer}).promise;
    const images=[];

    for(let i=1;i<=pdf.numPages;i++){
        const page=await pdf.getPage(i);
        const viewport=page.getViewport({scale});
        const canvas=document.createElement("canvas");
        canvas.width=viewport.width;
        canvas.height=viewport.height;
        const ctx=canvas.getContext("2d");
        await page.render({canvasContext:ctx,viewport}).promise;
        images.push({dataUrl:canvas.toDataURL("image/png"),width:viewport.width,height:viewport.height});
    }

    return images;
}

/* ---- PDF -> Imagem (uma PNG por página) ---- */
const pdf2imgInput=document.getElementById("pdf2imgFile");
document.getElementById("pdf2imgFile").onchange=()=>{
    if(pdf2imgInput.files.length) document.getElementById("pdf2imgFileName").innerText="📄 "+pdf2imgInput.files[0].name;
};

async function pdfToImages(){
    if(!requireAuth()) return;
    if(typeof pdfjsLib==="undefined"){
        toast("⚠ Biblioteca de renderização de PDF não carregou. Recarregue a página.");
        return;
    }
    const file=pdf2imgInput.files[0];
    if(!file){ toast("Selecione um PDF primeiro."); return; }

    shell("📷 Renderizando páginas...");

    const buffer=await file.arrayBuffer();
    const images=await renderPdfPagesToImages(buffer,2);

    images.forEach((img,i)=>{
        const a=document.createElement("a");
        a.href=img.dataUrl;
        a.download=`pagina_${i+1}.png`;
        a.click();
    });

    toast("✔ "+images.length+" imagem(ns) baixada(s)");
    shell("✔ "+images.length+" página(s) convertida(s) em PNG.");
    playPdfSuccess();
    logAction("pdf2img",images.length+" páginas convertidas em imagem ("+file.name+")");
}

/* ---- PDF -> Word (texto extraído, versão básica) ---- */
const pdf2wordInput=document.getElementById("pdf2wordFile");
document.getElementById("pdf2wordFile").onchange=()=>{
    if(pdf2wordInput.files.length) document.getElementById("pdf2wordFileName").innerText="📄 "+pdf2wordInput.files[0].name;
};

async function extractAllText(buffer){
    if(!pdfjsLib){ toast("✖ Biblioteca de PDF não carregou. Recarregue a página."); throw new Error("pdfjsLib indisponível"); }
    const pdf=await pdfjsLib.getDocument({data:buffer}).promise;
    const pagesText=[];

    for(let i=1;i<=pdf.numPages;i++){
        const page=await pdf.getPage(i);
        const content=await page.getTextContent();
        const text=content.items.map(it=>it.str).join(" ");
        pagesText.push(text);
    }

    return pagesText;
}

async function pdfToWord(){
    if(!requireAuth()) return;
    if(typeof pdfjsLib==="undefined"){
        toast("⚠ Biblioteca de leitura de PDF não carregou. Recarregue a página.");
        return;
    }
    if(typeof docx==="undefined"){
        toast("⚠ Biblioteca de geração de Word não carregou. Recarregue a página.");
        return;
    }
    const file=pdf2wordInput.files[0];
    if(!file){ toast("Selecione um PDF primeiro."); return; }

    shell("📝 Extraindo texto do PDF...");

    const buffer=await file.arrayBuffer();
    const pagesText=await extractAllText(buffer);

    const paragraphs=[];
    pagesText.forEach((text,i)=>{
        paragraphs.push(new docx.Paragraph({text:"— Página "+(i+1)+" —",heading:docx.HeadingLevel.HEADING_3}));
        paragraphs.push(new docx.Paragraph({text:text||"(sem texto detectado nesta página)"}));
    });

    const doc=new docx.Document({sections:[{children:paragraphs}]});

    shell("💾 Gerando arquivo .docx...");

    const blob=await docx.Packer.toBlob(doc);
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="PDF_CONVERTIDO.docx";
    a.click();

    toast("✔ PDF_CONVERTIDO.docx criado com sucesso");
    shell("✔ Texto extraído e salvo em .docx.");
    playPdfSuccess();
    logAction("pdf2word","texto de "+file.name+" convertido em Word");
}

/* ---- PDF -> Excel (linhas de texto, versão básica) ---- */
const pdf2excelInput=document.getElementById("pdf2excelFile");
document.getElementById("pdf2excelFile").onchange=()=>{
    if(pdf2excelInput.files.length) document.getElementById("pdf2excelFileName").innerText="📄 "+pdf2excelInput.files[0].name;
};

async function pdfToExcel(){
    if(!requireAuth()) return;
    if(typeof pdfjsLib==="undefined"){
        toast("⚠ Biblioteca de leitura de PDF não carregou. Recarregue a página.");
        return;
    }
    if(typeof XLSX==="undefined"){
        toast("⚠ Biblioteca de geração de Excel não carregou. Recarregue a página.");
        return;
    }
    const file=pdf2excelInput.files[0];
    if(!file){ toast("Selecione um PDF primeiro."); return; }

    shell("📊 Extraindo texto do PDF...");

    const buffer=await file.arrayBuffer();
    const pagesText=await extractAllText(buffer);

    const rows=[["Página","Texto"]];
    pagesText.forEach((text,i)=>{
        text.split(/\.\s+/).forEach(line=>{
            if(line.trim()) rows.push([i+1,line.trim()]);
        });
    });

    const ws=XLSX.utils.aoa_to_sheet(rows);
    const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,"PDF");

    shell("💾 Gerando arquivo .xlsx...");

    XLSX.writeFile(wb,"PDF_CONVERTIDO.xlsx");

    toast("✔ PDF_CONVERTIDO.xlsx criado com sucesso");
    shell("✔ Texto extraído e organizado em .xlsx.");
    playPdfSuccess();
    logAction("pdf2excel","texto de "+file.name+" convertido em Excel");
}

/* ---- PDF -> PowerPoint (cada página vira slide de imagem) ---- */
const pdf2pptInput=document.getElementById("pdf2pptFile");
document.getElementById("pdf2pptFile").onchange=()=>{
    if(pdf2pptInput.files.length) document.getElementById("pdf2pptFileName").innerText="📄 "+pdf2pptInput.files[0].name;
};

async function pdfToPowerpoint(){
    if(!requireAuth()) return;
    if(typeof pdfjsLib==="undefined"){
        toast("⚠ Biblioteca de renderização de PDF não carregou. Recarregue a página.");
        return;
    }
    if(typeof PptxGenJS==="undefined"){
        toast("⚠ Biblioteca de geração de PowerPoint não carregou. Recarregue a página.");
        return;
    }
    const file=pdf2pptInput.files[0];
    if(!file){ toast("Selecione um PDF primeiro."); return; }

    shell("📽 Renderizando páginas para slides...");

    const buffer=await file.arrayBuffer();
    const images=await renderPdfPagesToImages(buffer,2);

    const pres=new PptxGenJS();

    images.forEach(img=>{
        const slide=pres.addSlide();
        slide.addImage({data:img.dataUrl,x:0,y:0,w:"100%",h:"100%"});
    });

    shell("💾 Gerando arquivo .pptx...");

    await pres.writeFile({fileName:"PDF_CONVERTIDO.pptx"});

    toast("✔ PDF_CONVERTIDO.pptx criado com sucesso");
    shell("✔ "+images.length+" página(s) convertida(s) em slides.");
    playPdfSuccess();
    logAction("pdf2ppt",images.length+" páginas convertidas em PowerPoint");
}

/* ---- Proteger PDF com senha (via ZIP criptografado real) ---- */
const protectInput=document.getElementById("protectFile");
document.getElementById("protectFile").onchange=()=>{
    if(protectInput.files.length) document.getElementById("protectFileName").innerText="📄 "+protectInput.files[0].name;
};

async function protectPdf(){
    if(!requireAuth()) return;
    if(typeof zip==="undefined"){
        toast("⚠ Biblioteca de compactação não carregou. Recarregue a página.");
        return;
    }
    const file=protectInput.files[0];
    const password=document.getElementById("protectPassInput").value;

    if(!file){ toast("Selecione um PDF primeiro."); return; }
    if(!password){ toast("Digite uma senha para proteger o arquivo."); return; }

    shell("🔒 Criptografando "+file.name+" em um .zip protegido...");

    const buffer=await file.arrayBuffer();
    const blobWriter=new zip.BlobWriter("application/zip");
    const writer=new zip.ZipWriter(blobWriter,{password,encryptionStrength:3});

    await writer.add(file.name,new zip.BlobReader(new Blob([buffer])));
    await writer.close();

    const zipBlob=await blobWriter.getData();
    const a=document.createElement("a");
    a.href=URL.createObjectURL(zipBlob);
    a.download="PDF_PROTEGIDO.zip";
    a.click();

    toast("✔ PDF_PROTEGIDO.zip criado com sucesso");
    shell("✔ Arquivo protegido com senha (AES, formato zip).");
    playPdfSuccess();
    logAction("protect","PDF protegido em zip com senha ("+file.name+")");
}

/* ======================================================
   MÓDULO OSINT — agora via BACKEND (Render), não mais chamando
   as APIs externas direto do navegador. O DevTools do usuário só
   vê "POST /api/osint/..." — a URL real de cada API (crt.sh,
   dns.google, NVD etc.) fica escondida no backend.
====================================================== */

/* Helper genérico: chama um endpoint do backend, já mandando o
   token de autenticação do Firebase no cabeçalho. */
async function callBackend(endpoint, body) {
    const token = window.CyberAuth ? await window.CyberAuth.getIdToken() : null;

    if (!token) {
        toast("🔒 Faça login para usar esta ferramenta.");
        throw new Error("Sem token de autenticação.");
    }

    const res = await fetch(BACKEND_URL + endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Erro na requisição ao backend.");
    }

    return data;
}

/* ---- Verificador de senha vazada ---- */
async function checkPasswordLeak(){
    if(!requireAuth()) return;

    const passInput=document.getElementById("leakPassInput");
    const resultDiv=document.getElementById("leakResult");
    const senha=passInput.value;

    if(!senha){ toast("Digite uma senha para verificar."); return; }

    resultDiv.innerText="🔎 Verificando (sem enviar sua senha completa)...";
    playClick();

    try{
        const data=await callBackend("/api/osint/password-leak",{password:senha});

        if(data.leaked){
            resultDiv.innerHTML=`⚠ Essa senha já apareceu em <b>${data.count.toLocaleString("pt-BR")}</b> vazamentos conhecidos. Evite usá-la!`;
            resultDiv.style.color="#ff003c";
            playDenied();
        }else{
            resultDiv.innerHTML="✔ Boas notícias — essa senha não apareceu em vazamentos conhecidos.";
            resultDiv.style.color="#00ff80";
            playGranted();
        }

    }catch(e){
        resultDiv.innerText="✖ "+e.message;
        resultDiv.style.color="#ff003c";
    }
}

/* ---- Verificador de email vazado ---- */
async function checkEmailLeak(){
    if(!requireAuth()) return;

    const emailInput=document.getElementById("emailLeakInput");
    const resultDiv=document.getElementById("emailLeakResult");
    const email=emailInput.value.trim();

    if(!email){ toast("Digite um email para verificar."); return; }

    resultDiv.innerText="🔎 Verificando email...";
    playClick();

    try{
        const data=await callBackend("/api/osint/email-leak",{email});

        if(data.breaches && data.breaches.length>0){
            resultDiv.innerHTML=`⚠ Esse email apareceu em <b>${data.breaches.length}</b> vazamento(s) conhecido(s): ${data.breaches.join(", ")}`;
            resultDiv.style.color="#ff003c";
            playDenied();
        }else{
            resultDiv.innerHTML="✔ Boas notícias — esse email não apareceu em vazamentos conhecidos.";
            resultDiv.style.color="#00ff80";
            playGranted();
        }

    }catch(e){
        resultDiv.innerText="✖ "+e.message;
        resultDiv.style.color="#ff003c";
    }
}

/* ---- IP Lookup ---- */
async function ipLookup(){
    if(!requireAuth()) return;

    const input=document.getElementById("ipLookupInput");
    const resultDiv=document.getElementById("ipLookupResult");
    const raw=input.value.trim();

    resultDiv.innerText="🔎 Consultando...";
    playClick();

    try{
        const data=await callBackend("/api/osint/ip-lookup",{query:raw});

        resultDiv.innerHTML=`
            ${data.resolvedFrom?`<b>Domínio:</b> ${data.resolvedFrom} → <b>${data.ip}</b><br>`:""}
            <b>IP:</b> ${data.ip||"?"}<br>
            <b>Cidade:</b> ${data.city||"?"} / ${data.region||"?"}<br>
            <b>País:</b> ${data.country||"?"}<br>
            <b>Provedor (ISP):</b> ${(data.connection&&(data.connection.isp||data.connection.org))||"?"}<br>
            <b>Fuso horário:</b> ${(data.timezone&&data.timezone.id)||"?"}<br>
            <b>Coordenadas aprox.:</b> ${data.latitude||"?"}, ${data.longitude||"?"}
        `;
        resultDiv.style.color="#00ff80";

    }catch(e){
        resultDiv.innerText="✖ "+e.message;
        resultDiv.style.color="#ff003c";
    }
}

/* ---- Gerador de Google Dorks ---- */
async function generateDorks(){
    if(!requireAuth()) return;

    const target=document.getElementById("dorkTarget").value.trim();
    const resultDiv=document.getElementById("dorksResult");

    if(!target){ toast("Digite um domínio ou palavra-chave alvo."); return; }

    const types=Array.from(document.querySelectorAll(".dorkChecks input:checked")).map(c=>c.value);
    if(!types.length){ toast("Marque pelo menos um tipo de busca."); return; }

    playClick();

    try{
        const data=await callBackend("/api/osint/dorks",{target,types});

        resultDiv.innerHTML=data.dorks.map(d=>`
            <div class="dorkItem">
                <span>${d.query}</span>
                <a href="${d.url}" target="_blank" rel="noopener">🔍 Abrir</a>
            </div>
        `).join("");

        shell("🔍 "+data.dorks.length+" dork(s) gerado(s) para "+target);

    }catch(e){
        resultDiv.innerHTML="✖ "+e.message;
    }
}

/* ---- Buscador de subdomínios ---- */
async function findSubdomains(){
    if(!requireAuth()) return;

    const domain=document.getElementById("subdomainInput").value.trim();
    const resultDiv=document.getElementById("subdomainResult");

    if(!domain){ toast("Digite um domínio."); return; }

    resultDiv.innerHTML="🔎 Consultando certificados públicos (pode levar alguns segundos)...";
    playClick();

    try{
        const data=await callBackend("/api/osint/subdomains",{domain});
        const sorted=data.subdomains||[];

        if(!sorted.length){
            resultDiv.innerText="Nenhum subdomínio encontrado nos certificados públicos.";
            return;
        }

        resultDiv.innerHTML=`<p class="fieldLabel small">${sorted.length} subdomínio(s) encontrado(s):</p>`+
            sorted.map(s=>`<div class="subdomainItem">${s}</div>`).join("");

        shell("🌐 "+sorted.length+" subdomínio(s) encontrado(s) para "+domain);

    }catch(e){
        resultDiv.innerText="✖ "+e.message;
    }
}

/* ---- DNS Lookup ---- */
async function dnsLookup(){
    if(!requireAuth()) return;

    const domain=document.getElementById("dnsInput").value.trim();
    const resultDiv=document.getElementById("dnsResult");

    if(!domain){ toast("Digite um domínio."); return; }

    resultDiv.innerHTML="🔎 Consultando registros DNS...";
    playClick();

    try{
        const data=await callBackend("/api/osint/dns",{domain});
        let html="";

        Object.entries(data.records).forEach(([type,values])=>{
            html+=`<div class="dnsRecordGroup"><b>${type}</b>`;
            if(values.length){
                values.forEach(v=>{ html+=`<div class="dnsRecordLine">${v}</div>`; });
            }else{
                html+=`<div class="dnsRecordLine" style="opacity:.5;">— nenhum registro —</div>`;
            }
            html+="</div>";
        });

        resultDiv.innerHTML=html;
        shell("🔎 DNS consultado para "+domain);

    }catch(e){
        resultDiv.innerText="✖ "+e.message;
    }
}

/* ---- Whois/RDAP ---- */
async function whoisLookup(){
    if(!requireAuth()) return;

    const domain=document.getElementById("whoisInput").value.trim();
    const resultDiv=document.getElementById("whoisResult");

    if(!domain){ toast("Digite um domínio."); return; }

    resultDiv.innerText="🔎 Consultando RDAP...";
    playClick();

    try{
        const data=await callBackend("/api/osint/whois",{domain});

        const fmt=(d)=>d?new Date(d).toLocaleDateString("pt-BR"):"?";

        resultDiv.innerHTML=`
            <b>Domínio:</b> ${data.domain}<br>
            <b>Registrador:</b> ${data.registrar||"?"}<br>
            <b>Criado em:</b> ${fmt(data.createdAt)}<br>
            <b>Última atualização:</b> ${fmt(data.updatedAt)}<br>
            <b>Expira em:</b> ${fmt(data.expiresAt)}<br>
            <b>Status:</b> ${(data.status||[]).join(", ")||"?"}<br>
            <b>Nameservers:</b><br>${(data.nameservers||[]).join("<br>")||"?"}
        `;

        shell("📋 WHOIS/RDAP consultado para "+domain);

    }catch(e){
        resultDiv.innerText="✖ "+e.message;
    }
}

/* ---- Gerador de Hashes (MD5 + SHA-1/256/384/512) ----
   O Web Crypto do navegador não suporta MD5 nativamente,
   por isso incluímos uma implementação compacta própria. */
function md5(str){
    function rotl(x,c){return (x<<c)|(x>>>(32-c));}
    function toHex(n){
        let s="",v;
        for(let i=0;i<4;i++){
            v=(n>>>(i*8))&255;
            s+=("0"+v.toString(16)).slice(-2);
        }
        return s;
    }
    const K=[];
    for(let i=0;i<64;i++) K[i]=Math.floor(Math.abs(Math.sin(i+1))*4294967296);
    const S=[7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,
        5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,
        4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,
        6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];

    const msgBytes=new TextEncoder().encode(str);
    const bitLen=msgBytes.length*8;
    let data=Array.from(msgBytes);
    data.push(0x80);
    while(data.length%64!==56) data.push(0);
    for(let i=0;i<8;i++) data.push((bitLen/Math.pow(2,i*8))&255);

    let a0=1732584193,b0=-271733879,c0=-1732584194,d0=271733878;

    for(let chunk=0;chunk<data.length;chunk+=64){
        const M=[];
        for(let i=0;i<16;i++){
            M[i]=data[chunk+i*4] | (data[chunk+i*4+1]<<8) | (data[chunk+i*4+2]<<16) | (data[chunk+i*4+3]<<24);
        }

        let [A,B,C,D]=[a0,b0,c0,d0];

        for(let i=0;i<64;i++){
            let F,g;
            if(i<16){F=(B&C)|(~B&D);g=i;}
            else if(i<32){F=(D&B)|(~D&C);g=(5*i+1)%16;}
            else if(i<48){F=B^C^D;g=(3*i+5)%16;}
            else{F=C^(B|~D);g=(7*i)%16;}

            F=(F+A+K[i]+M[g])|0;
            A=D;D=C;C=B;
            B=(B+rotl(F,S[i]))|0;
        }

        a0=(a0+A)|0;b0=(b0+B)|0;c0=(c0+C)|0;d0=(d0+D)|0;
    }

    return [a0,b0,c0,d0].map(toHex).join("");
}

async function sha(algo,text){
    const enc=new TextEncoder().encode(text);
    const buf=await crypto.subtle.digest(algo,enc);
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
}

async function generateHashes(){
    if(!requireAuth()) return;

    const text=document.getElementById("hashInput").value;
    const resultDiv=document.getElementById("hashResult");

    if(!text){ toast("Digite um texto primeiro."); return; }

    playClick();

    const md5Hash=md5(text);
    const sha1Hash=await sha("SHA-1",text);
    const sha256Hash=await sha("SHA-256",text);
    const sha512Hash=await sha("SHA-512",text);

    const rows=[
        ["MD5",md5Hash],
        ["SHA-1",sha1Hash],
        ["SHA-256",sha256Hash],
        ["SHA-512",sha512Hash]
    ];

    resultDiv.innerHTML=rows.map(([label,hash])=>`
        <div class="hashRow">
            <b>${label}</b>
            <span>${hash}</span>
            <button onclick="navigator.clipboard.writeText('${hash}');toast('📋 ${label} copiado!')">Copiar</button>
        </div>
    `).join("");

    logAction("hashGenerator","hashes gerados para um texto");
}

/* ---- Busca de CVEs ---- */
async function searchCve(){
    if(!requireAuth()) return;

    const keyword=document.getElementById("cveInput").value.trim();
    const resultDiv=document.getElementById("cveResult");

    if(!keyword){ toast("Digite uma palavra-chave (ex: apache)."); return; }

    resultDiv.innerHTML="🔎 Buscando CVEs (a base do NIST pode demorar alguns segundos)...";
    playClick();

    try{
        const data=await callBackend("/api/osint/cve",{keyword});
        const items=data.results||[];

        if(!items.length){
            resultDiv.innerText="Nenhuma CVE encontrada para essa palavra-chave.";
            return;
        }

        resultDiv.innerHTML=items.map(v=>{
            const score=v.score;
            let severityColor="#7CFF9A";
            if(score>=9) severityColor="#ff003c";
            else if(score>=7) severityColor="#ff9500";
            else if(score>=4) severityColor="#ffd400";

            return `
                <div class="cveItem">
                    <b>${v.id}</b>
                    ${score?`<span class="cveSeverity" style="background:${severityColor};color:#000;">CVSS ${score}</span>`:""}
                    <p style="margin:6px 0;font-size:11.5px;">${v.description}</p>
                    <a href="${v.detailsUrl}" target="_blank" rel="noopener">Ver detalhes completos →</a>
                </div>
            `;
        }).join("");

        shell("🐛 "+items.length+" CVE(s) encontrada(s) para \""+keyword+"\"");

    }catch(e){
        resultDiv.innerText="✖ "+e.message;
    }
}

/* ---- Extrator de metadados EXIF — clássico do OSINT em fotos ---- */
const exifInput=document.getElementById("exifFile");
document.getElementById("exifFile").onchange=()=>{
    if(exifInput.files.length) document.getElementById("exifFileName").innerText="📄 "+exifInput.files[0].name;
};

function extractExif(){
    if(!requireAuth()) return;

    if(typeof EXIF==="undefined"){
        toast("✖ Biblioteca de EXIF não carregou. Recarregue a página.");
        return;
    }

    const file=exifInput.files[0];
    const resultDiv=document.getElementById("exifResult");

    if(!file){ toast("Selecione uma foto JPG primeiro."); return; }

    resultDiv.innerText="🔎 Lendo metadados...";
    playClick();

    const img=new Image();
    img.src=URL.createObjectURL(file);

    img.onload=()=>{
        EXIF.getData(img,function(){
            const allTags=EXIF.getAllTags(this);

            if(!Object.keys(allTags).length){
                resultDiv.innerText="Nenhum metadado EXIF encontrado nesta imagem (muitas redes sociais removem isso ao salvar).";
                resultDiv.style.color="#7CFF9A";
                return;
            }

            let html="";

            const lat=EXIF.getTag(this,"GPSLatitude");
            const lon=EXIF.getTag(this,"GPSLongitude");

            if(lat && lon){
                const latRef=EXIF.getTag(this,"GPSLatitudeRef")||"N";
                const lonRef=EXIF.getTag(this,"GPSLongitudeRef")||"E";
                const toDecimal=(dms,ref)=>{
                    const dec=dms[0]+dms[1]/60+dms[2]/3600;
                    return (ref==="S"||ref==="W")?-dec:dec;
                };
                const latDec=toDecimal(lat,latRef);
                const lonDec=toDecimal(lon,lonRef);
                html+=`<b>⚠ Localização GPS encontrada:</b> ${latDec.toFixed(6)}, ${lonDec.toFixed(6)}<br>`;
            }

            if(allTags.Make) html+=`<b>Fabricante:</b> ${allTags.Make}<br>`;
            if(allTags.Model) html+=`<b>Modelo do dispositivo:</b> ${allTags.Model}<br>`;
            if(allTags.DateTimeOriginal) html+=`<b>Data da foto:</b> ${allTags.DateTimeOriginal}<br>`;
            if(allTags.Software) html+=`<b>Software:</b> ${allTags.Software}<br>`;

            html+="<br><b>Todos os metadados encontrados:</b><br>";
            Object.keys(allTags).forEach(key=>{
                const value=allTags[key];
                if(typeof value==="object") return; // pula GPS bruto já tratado acima
                html+=`${key}: ${value}<br>`;
            });

            resultDiv.innerHTML=html||"Metadados encontrados, mas sem campos reconhecidos.";
            resultDiv.style.color=(lat&&lon)?"#ff003c":"#00ff80";

            logAction("exifExtract","metadados EXIF extraídos de "+file.name);
        });
    };
}

/* ---- Gerador de chave segura ---- */
async function generateKey(){
    if(!requireAuth()) return;
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

    logAction("keygen","nova chave segura gerada");
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

/* ======================================================
   MINI-GAME: "FIREWALL RUNNER"
   - boneco (não mais um quadrado), com cor equipável
   - moedas ganhas jogando, gastas na loja (cores + mapas)
   - highscore e moedas salvos na CONTA (Firestore), com
     localStorage como cache rápido/offline
   - mapas diferentes (temas de cor de fundo/chão)
====================================================== */
let gameInitialized=false;
let currentHighscore=0;
let currentCoins=0;
let ownedItems=["hat_green","map_matrix"]; // itens gratuitos por padrão
let equippedHat="hat_green";
let equippedMap="map_matrix";

const SHOP_HATS=[
    {id:"hat_green",name:"Verde",color:"#00ff80",price:0},
    {id:"hat_cyan",name:"Ciano",color:"#00e5ff",price:50},
    {id:"hat_orange",name:"Laranja",color:"#ff9500",price:100},
    {id:"hat_purple",name:"Roxo",color:"#c400ff",price:150}
];

const SHOP_MAPS=[
    {id:"map_matrix",name:"Matrix Verde",bg:"#020402",ground:"rgba(0,255,128,.4)",obstacle:"#ff003c",price:0},
    {id:"map_blood",name:"Vermelho Sangue",bg:"#0a0202",ground:"rgba(255,0,60,.45)",obstacle:"#ffcc00",price:80},
    {id:"map_deep",name:"Azul Profundo",bg:"#020410",ground:"rgba(0,180,255,.45)",obstacle:"#ff00aa",price:80}
];

function getHatColor(id){
    const hat=SHOP_HATS.find(h=>h.id===id);
    return hat?hat.color:"#00ff80";
}

function getMapTheme(id){
    return SHOP_MAPS.find(m=>m.id===id)||SHOP_MAPS[0];
}

/* Carrega highscore/moedas/itens: localStorage primeiro (rápido),
   Firestore depois (fonte da verdade, sincroniza entre dispositivos) */
function loadLocalGameCache(){
    try{
        const cache=JSON.parse(localStorage.getItem("cyberpdf_gamecache")||"{}");
        currentHighscore=cache.highscore||0;
        currentCoins=cache.coins||0;
        ownedItems=cache.ownedItems||["hat_green","map_matrix"];
        equippedHat=cache.equippedHat||"hat_green";
        equippedMap=cache.equippedMap||"map_matrix";
    }catch(e){}
}

function saveLocalGameCache(){
    localStorage.setItem("cyberpdf_gamecache",JSON.stringify({
        highscore:currentHighscore,
        coins:currentCoins,
        ownedItems,
        equippedHat,
        equippedMap
    }));
}

function updateGameHud(){
    document.getElementById("highscoreDisplay").innerText="🏆 Recorde: "+currentHighscore;
    document.getElementById("coinsDisplay").innerText="🪙 "+currentCoins+" moedas";
    const shopCoins=document.getElementById("coinsDisplayShop");
    if(shopCoins) shopCoins.innerText="🪙 "+currentCoins+" moedas";
}

async function syncGameDataFromAccount(){
    loadLocalGameCache();
    updateGameHud();

    if(window.CyberAuth && window.CyberAuth.currentUser){
        const remote=await window.CyberAuth.getGameData();
        if(remote){
            // usa o maior highscore entre local e nuvem, e a lista de itens da nuvem
            currentHighscore=Math.max(currentHighscore,remote.highscore||0);
            currentCoins=(typeof remote.coins==="number")?remote.coins:currentCoins;
            ownedItems=remote.ownedItems||ownedItems;
            equippedHat=remote.equippedHat||equippedHat;
            equippedMap=remote.equippedMap||equippedMap;
            saveLocalGameCache();
        }
    }

    updateGameHud();
    renderShop();
    renderMapSelector();
}

async function persistGameData(){
    saveLocalGameCache();
    if(window.CyberAuth && window.CyberAuth.currentUser){
        window.CyberAuth.saveGameData({
            highscore:currentHighscore,
            coins:currentCoins,
            ownedItems,
            equippedHat,
            equippedMap
        });
    }
}

document.addEventListener("cyberAuthReady",()=>{
    syncGameDataFromAccount();
});

/* ---- Sub-abas Jogar / Loja ---- */
document.querySelectorAll(".gameSubTabBtn").forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelectorAll(".gameSubTabBtn").forEach(b=>b.classList.remove("active"));
        document.querySelectorAll(".gamePanel").forEach(p=>p.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(btn.dataset.gametab).classList.add("active");
        playClick();
        if(btn.dataset.gametab==="gameShop") renderShop();
    });
});

/* ---- Renderiza a loja (chapéus/cores + mapas) ---- */
function renderShop(){
    const hatsEl=document.getElementById("shopHats");
    const mapsEl=document.getElementById("shopMaps");
    if(!hatsEl||!mapsEl) return;

    hatsEl.innerHTML=SHOP_HATS.map(item=>renderShopItem(item,"hat")).join("");
    mapsEl.innerHTML=SHOP_MAPS.map(item=>renderShopItem(item,"map")).join("");

    document.querySelectorAll(".shopItem button").forEach(btn=>{
        btn.addEventListener("click",()=>{
            const id=btn.dataset.id;
            const type=btn.dataset.type;
            const action=btn.dataset.action;

            if(action==="buy") buyItem(id,type);
            if(action==="equip") equipItem(id,type);
        });
    });
}

function renderShopItem(item,type){
    const owned=ownedItems.includes(item.id)||item.price===0;
    const equipped=(type==="hat"?equippedHat:equippedMap)===item.id;
    const icon=type==="hat"?"👤":"🗺";

    let btnHtml="";
    if(equipped){
        btnHtml=`<button disabled>Equipado ✔</button>`;
    }else if(owned){
        btnHtml=`<button data-id="${item.id}" data-type="${type}" data-action="equip">Equipar</button>`;
    }else{
        btnHtml=`<button data-id="${item.id}" data-type="${type}" data-action="buy">Comprar 🪙${item.price}</button>`;
    }

    return `
        <div class="shopItem ${owned?"owned":""} ${equipped?"equipped":""}">
            <span class="shopItemIcon" style="${type==='hat'?'color:'+item.color:''}">${icon}</span>
            ${item.name}
            ${btnHtml}
        </div>
    `;
}

function buyItem(id,type){
    const list=type==="hat"?SHOP_HATS:SHOP_MAPS;
    const item=list.find(i=>i.id===id);
    if(!item) return;

    if(currentCoins<item.price){
        toast("🪙 Moedas insuficientes.");
        playDenied();
        return;
    }

    currentCoins-=item.price;
    ownedItems.push(id);
    persistGameData();
    updateGameHud();
    renderShop();
    playPdfSuccess();
    toast("✔ "+item.name+" comprado!");
}

function equipItem(id,type){
    if(type==="hat") equippedHat=id;
    else equippedMap=id;

    persistGameData();
    renderShop();
    renderMapSelector();
    playClick();
}

/* ---- Seletor rápido de mapa (fora da loja, na tela do jogo) ---- */
function renderMapSelector(){
    const el=document.getElementById("mapSelector");
    if(!el) return;

    const availableMaps=SHOP_MAPS.filter(m=>ownedItems.includes(m.id)||m.price===0);

    el.innerHTML=availableMaps.map(m=>
        `<button class="mapChip ${equippedMap===m.id?"active":""}" data-id="${m.id}">${m.name}</button>`
    ).join("");

    el.querySelectorAll(".mapChip").forEach(chip=>{
        chip.addEventListener("click",()=>{
            equippedMap=chip.dataset.id;
            persistGameData();
            renderMapSelector();
            playClick();
        });
    });
}

function initGameIfNeeded(){
    if(gameInitialized) return;
    gameInitialized=true;
    setupGame();
}

function setupGame(){
    const canvas=document.getElementById("gameCanvas");
    const ctx=canvas.getContext("2d");
    const gameOverMsg=document.getElementById("gameOverMsg");

    const GROUND_Y=140;

    let player={x:40,y:GROUND_Y,w:20,h:26,vy:0,jumping:false,legPhase:0};
    let obstacles=[];
    let speed=3.2;
    let score=0;
    let frame=0;
    let over=true;
    let loopId=null;

    function resetGame(){
        player.y=GROUND_Y;
        player.vy=0;
        player.jumping=false;
        obstacles=[];
        speed=3.2;
        score=0;
        frame=0;
        over=false;
        gameOverMsg.innerText="";
        loop();
    }

    function jump(){
        if(over){
            resetGame();
            return;
        }
        if(!player.jumping){
            player.vy=-9;
            player.jumping=true;
            playJump();
        }
    }

    function spawnObstacle(){
        const h=16+Math.random()*22;
        obstacles.push({
            x:canvas.width+10,
            y:GROUND_Y+22-h,
            w:14+Math.random()*10,
            h:h
        });
    }

    function update(){
        frame++;

        player.vy+=0.5;
        player.y+=player.vy;
        player.legPhase+=0.3;

        if(player.y>GROUND_Y){
            player.y=GROUND_Y;
            player.vy=0;
            player.jumping=false;
        }

        if(frame%Math.max(55,Math.floor(110-speed*5))===0){
            spawnObstacle();
        }

        obstacles.forEach(o=>o.x-=speed);
        obstacles=obstacles.filter(o=>o.x+o.w>0);

        for(const o of obstacles){
            if(
                player.x < o.x+o.w &&
                player.x+player.w > o.x &&
                player.y+26 > o.y &&
                player.y < o.y+o.h
            ){
                endGame();
                break;
            }
        }

        score+=0.1;
        speed+=0.0009;
    }

    async function endGame(){
        over=true;
        playGameOver();

        const finalScore=Math.floor(score);
        const coinsEarned=Math.floor(finalScore/5);
        let recordMsg="";

        currentCoins+=coinsEarned;

        if(finalScore>currentHighscore){
            currentHighscore=finalScore;
            recordMsg=" — 🏆 NOVO RECORDE!";
        }

        updateGameHud();
        persistGameData();

        gameOverMsg.innerText="💀 GAME OVER — score "+finalScore+recordMsg+" — +🪙"+coinsEarned+" moedas — toque/clique ou ESPAÇO para tentar de novo";

        if(loopId) cancelAnimationFrame(loopId);
    }

    /* Desenha um bonequinho simples (cabeça + corpo + pernas
       animadas), na cor do chapéu/roupa equipado */
    function drawBoneco(x,y,w,h,color,legPhase,jumping){
        ctx.save();
        ctx.fillStyle=color;
        ctx.shadowColor=color;
        ctx.shadowBlur=8;

        const headR=w*0.32;
        const cx=x+w/2;

        // cabeça
        ctx.beginPath();
        ctx.arc(cx,y+headR,headR,0,Math.PI*2);
        ctx.fill();

        // corpo
        ctx.fillRect(cx-w*0.18,y+headR*1.7,w*0.36,h*0.42);

        // pernas (animadas, ou "esticadas" no ar)
        const legOffset=jumping?4:Math.sin(legPhase)*5;
        ctx.beginPath();
        ctx.moveTo(cx-w*0.15,y+headR*1.7+h*0.42);
        ctx.lineTo(cx-w*0.15+legOffset,y+h);
        ctx.moveTo(cx+w*0.15,y+headR*1.7+h*0.42);
        ctx.lineTo(cx+w*0.15-legOffset,y+h);
        ctx.strokeStyle=color;
        ctx.lineWidth=3;
        ctx.stroke();

        ctx.restore();
    }

    function draw(){
        const theme=getMapTheme(equippedMap);

        ctx.fillStyle=theme.bg;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.strokeStyle=theme.ground;
        ctx.beginPath();
        ctx.moveTo(0,GROUND_Y+22);
        ctx.lineTo(canvas.width,GROUND_Y+22);
        ctx.stroke();

        drawBoneco(player.x,player.y,player.w,player.h,getHatColor(equippedHat),player.legPhase,player.jumping);

        ctx.fillStyle=theme.obstacle;
        ctx.shadowColor=theme.obstacle;
        obstacles.forEach(o=>{
            ctx.fillRect(o.x,o.y,o.w,o.h);
        });

        ctx.shadowBlur=0;
        ctx.fillStyle="#7CFF9A";
        ctx.font="14px monospace";
        ctx.fillText("SCORE: "+Math.floor(score),canvas.width-140,20);
    }

    function loop(){
        if(!over){
            update();
            draw();
            loopId=requestAnimationFrame(loop);
        }
    }

    document.addEventListener("keydown",(e)=>{
        const gamePlayVisible=document.getElementById("gamePlay").classList.contains("active");
        const gameSectionVisible=document.getElementById("gameSection").classList.contains("active");
        if(e.code==="Space" && gamePlayVisible && gameSectionVisible){
            e.preventDefault();
            jump();
        }
    });

    canvas.addEventListener("mousedown",jump);
    canvas.addEventListener("touchstart",(e)=>{
        e.preventDefault();
        jump();
    },{passive:false});

    draw();
    gameOverMsg.innerText="Toque/clique no jogo ou pressione ESPAÇO para começar";
}
