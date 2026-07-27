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
    bgMusic.volume=0.35;
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

/* ---- Verificador de senha vazada (k-anonimato) ---- */
async function sha1Hex(message){
    const enc=new TextEncoder().encode(message);
    const hashBuffer=await crypto.subtle.digest("SHA-1",enc);
    const hashArray=Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b=>b.toString(16).padStart(2,"0")).join("").toUpperCase();
}

async function checkPasswordLeak(){
    if(!requireAuth()) return;
    const passInput=document.getElementById("leakPassInput");
    const resultDiv=document.getElementById("leakResult");
    const senha=passInput.value;

    if(!senha){ toast("Digite uma senha para verificar."); return; }

    resultDiv.innerText="🔎 Verificando (sem enviar sua senha completa)...";
    playClick();

    try{
        const hash=await sha1Hex(senha);
        const prefix=hash.slice(0,5);
        const suffix=hash.slice(5);

        const res=await fetch("https://api.pwnedpasswords.com/range/"+prefix);
        if(!res.ok) throw new Error("Falha na consulta");

        const text=await res.text();
        const lines=text.split("\n");
        let count=0;

        for(const line of lines){
            const [suf,cnt]=line.split(":");
            if(suf && suf.trim()===suffix){
                count=parseInt(cnt.trim(),10);
                break;
            }
        }

        if(count>0){
            resultDiv.innerHTML=`⚠ Essa senha já apareceu em <b>${count.toLocaleString("pt-BR")}</b> vazamentos conhecidos. Evite usá-la!`;
            resultDiv.style.color="#ff003c";
            playDenied();
        }else{
            resultDiv.innerHTML="✔ Boas notícias — essa senha não apareceu em vazamentos conhecidos.";
            resultDiv.style.color="#00ff80";
            playGranted();
        }

        logAction("leakCheck",count>0?("senha encontrada em "+count+" vazamentos"):"senha não encontrada em vazamentos");

    }catch(e){
        resultDiv.innerText="✖ Não foi possível verificar agora (sem conexão com a API).";
        resultDiv.style.color="#ff003c";
    }
}

/* ---- Verificador de email vazado (XposedOrNot — API gratuita, sem chave) ---- */
async function checkEmailLeak(){
    if(!requireAuth()) return;

    const emailInput=document.getElementById("emailLeakInput");
    const resultDiv=document.getElementById("emailLeakResult");
    const email=emailInput.value.trim();

    if(!email){ toast("Digite um email para verificar."); return; }

    resultDiv.innerText="🔎 Verificando email...";
    playClick();

    try{
        const res=await fetch("https://api.xposedornot.com/v1/check-email/"+encodeURIComponent(email));

        if(res.status===404){
            resultDiv.innerHTML="✔ Boas notícias — esse email não apareceu em vazamentos conhecidos.";
            resultDiv.style.color="#00ff80";
            playGranted();
            logAction("emailLeakCheck","email não encontrado em vazamentos");
            return;
        }

        if(!res.ok) throw new Error("Falha na consulta");

        const data=await res.json();
        const breaches=(data.breaches && data.breaches[0]) || [];

        if(breaches.length>0){
            resultDiv.innerHTML=`⚠ Esse email apareceu em <b>${breaches.length}</b> vazamento(s) conhecido(s): ${breaches.join(", ")}`;
            resultDiv.style.color="#ff003c";
            playDenied();
            logAction("emailLeakCheck",breaches.length+" vazamentos encontrados");
        }else{
            resultDiv.innerHTML="✔ Boas notícias — esse email não apareceu em vazamentos conhecidos.";
            resultDiv.style.color="#00ff80";
            playGranted();
            logAction("emailLeakCheck","email não encontrado em vazamentos");
        }

    }catch(e){
        resultDiv.innerText="✖ Não foi possível verificar agora (sem conexão com a API).";
        resultDiv.style.color="#ff003c";
    }
}

/* ---- IP Lookup (geolocalização/ISP) — clássico do OSINT ---- */
async function ipLookup(){
    if(!requireAuth()) return;

    const input=document.getElementById("ipLookupInput");
    const resultDiv=document.getElementById("ipLookupResult");
    const ip=input.value.trim();

    resultDiv.innerText="🔎 Consultando...";
    playClick();

    try{
        const url=ip?("https://ipwho.is/"+encodeURIComponent(ip)):"https://ipwho.is/";
        const res=await fetch(url);

        if(!res.ok){
            resultDiv.innerText="✖ Erro na consulta (HTTP "+res.status+"). Tente novamente em instantes.";
            resultDiv.style.color="#ff003c";
            return;
        }

        const data=await res.json();

        if(data.success===false){
            resultDiv.innerText="✖ "+(data.message||"IP inválido ou não encontrado.");
            resultDiv.style.color="#ff003c";
            return;
        }

        resultDiv.innerHTML=`
            <b>IP:</b> ${data.ip||"?"}<br>
            <b>Cidade:</b> ${data.city||"?"} / ${data.region||"?"}<br>
            <b>País:</b> ${data.country||"?"}<br>
            <b>Provedor (ISP):</b> ${(data.connection&&(data.connection.isp||data.connection.org))||"?"}<br>
            <b>Fuso horário:</b> ${(data.timezone&&data.timezone.id)||"?"}<br>
            <b>Coordenadas aprox.:</b> ${data.latitude||"?"}, ${data.longitude||"?"}
        `;
        resultDiv.style.color="#00ff80";

        logAction("ipLookup","consulta de IP "+(data.ip||ip));

    }catch(e){
        resultDiv.innerText="✖ Não foi possível verificar agora (rede ou API fora do ar).";
        resultDiv.style.color="#ff003c";
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
   - corrigido (over começa true, primeiro toque/clique/espaço
     dá o start de verdade)
   - highscore salvo em localStorage
   - cor do jogador/obstáculos customizável
   - velocidade inicial mais baixa e aceleração mais suave
====================================================== */
let gameInitialized=false;
let currentHighscore=0; // cache local, sincronizado com o Firestore

document.addEventListener("cyberAuthReady",async ()=>{
    if(window.CyberAuth){
        currentHighscore=await window.CyberAuth.getHighscore();
        document.getElementById("highscoreDisplay").innerText="🏆 Recorde: "+currentHighscore;
    }
});

function initGameIfNeeded(){
    if(gameInitialized) return;
    gameInitialized=true;
    setupGame();
}

function setupGame(){
    const canvas=document.getElementById("gameCanvas");
    const ctx=canvas.getContext("2d");
    const gameOverMsg=document.getElementById("gameOverMsg");
    const highscoreDisplay=document.getElementById("highscoreDisplay");
    const colorDots=document.querySelectorAll(".colorDot");

    const GROUND_Y=140;

    let playerColor="#00ff80";
    colorDots.forEach(dot=>{
        if(dot.dataset.color===playerColor) dot.classList.add("selected");
        dot.addEventListener("click",()=>{
            playerColor=dot.dataset.color;
            colorDots.forEach(d=>d.classList.remove("selected"));
            dot.classList.add("selected");
            playClick();
        });
    });

    let player={x:40,y:GROUND_Y,w:22,h:22,vy:0,jumping:false};
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
                player.y+22 > o.y &&
                player.y < o.y+o.h
            ){
                endGame();
                break;
            }
        }

        score+=0.1;
        speed+=0.0009;
    }

    function endGame(){
        over=true;
        playGameOver();

        const finalScore=Math.floor(score);
        let recordMsg="";

        if(finalScore>currentHighscore){
            currentHighscore=finalScore;
            highscoreDisplay.innerText="🏆 Recorde: "+finalScore;
            recordMsg=" — 🏆 NOVO RECORDE!";
            if(window.CyberAuth) window.CyberAuth.setHighscore(finalScore);
        }

        gameOverMsg.innerText="💀 GAME OVER — score "+finalScore+recordMsg+" — toque/clique ou ESPAÇO para tentar de novo";

        if(loopId) cancelAnimationFrame(loopId);
    }

    function draw(){
        ctx.fillStyle="#020402";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.strokeStyle="rgba(0,255,128,.4)";
        ctx.beginPath();
        ctx.moveTo(0,GROUND_Y+22);
        ctx.lineTo(canvas.width,GROUND_Y+22);
        ctx.stroke();

        ctx.fillStyle=playerColor;
        ctx.shadowColor=playerColor;
        ctx.shadowBlur=8;
        ctx.fillRect(player.x,player.y,player.w,player.h);

        ctx.fillStyle="#ff003c";
        ctx.shadowColor="#ff003c";
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
        if(e.code==="Space" && document.getElementById("tabGame").classList.contains("active")){
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
