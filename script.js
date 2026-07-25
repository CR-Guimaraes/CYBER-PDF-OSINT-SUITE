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
        tabBtns.forEach(b=>b.classList.remove("active"));
        tabPanels.forEach(p=>p.classList.remove("active"));

        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");

        playClick();

        if(btn.dataset.tab==="tabGame"){
            initGameIfNeeded();
        }

        if(btn.dataset.tab==="tabHistory"){
            loadHistory();
        }
    });
});

/* ======================================================
   INÍCIO DA EXPERIÊNCIA — disparado pelo auth-firebase.js
   assim que o login/cadastro é confirmado de verdade
====================================================== */
document.addEventListener("cyberAuthReady",()=>{
    startExperience();
});

function startExperience(){
    boot();
    bgMusic.volume=0.35;
    bgMusic.play().catch(()=>{});
    loadVisitCounter();
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

/* Botão de modo claro/escuro */
const themeBtn=document.getElementById("themeBtn");
let lightMode=false;

themeBtn.addEventListener("click",()=>{
    lightMode=!lightMode;
    document.body.classList.toggle("lightMode",lightMode);
    themeBtn.innerText=lightMode?"🌙":"☀️";
    playClick();
});

/* ======================================================
   CONTADOR DE VISITAS REAL (CounterAPI v2 — serviço público
   e gratuito, feito exatamente pra sites estáticos)
====================================================== */
async function loadVisitCounter(){
    const el=document.getElementById("visitCounter");
    try{
        const res=await fetch("https://api.counterapi.dev/v2/cyberpdf-ca1m/visitas/up");
        const data=await res.json();
        const value=(data && data.data && (data.data.up_count ?? data.data.value))
            ?? data.value
            ?? "?";
        el.innerText="👁 Visitas: "+value;
    }catch(e){
        el.innerText="👁 Visitas: indisponível";
    }
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

/* ---- Verificador de senha vazada (k-anonimato) ---- */
async function sha1Hex(message){
    const enc=new TextEncoder().encode(message);
    const hashBuffer=await crypto.subtle.digest("SHA-1",enc);
    const hashArray=Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b=>b.toString(16).padStart(2,"0")).join("").toUpperCase();
}

async function checkPasswordLeak(){
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

/* ---- Gerador de chave segura ---- */
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
const HIGHSCORE_KEY="cyberpdf_highscore";

function getHighscore(){
    return parseInt(localStorage.getItem(HIGHSCORE_KEY)||"0",10);
}

function setHighscore(v){
    localStorage.setItem(HIGHSCORE_KEY,String(v));
}

document.getElementById("highscoreDisplay").innerText="🏆 Recorde: "+getHighscore();

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

        if(finalScore>getHighscore()){
            setHighscore(finalScore);
            highscoreDisplay.innerText="🏆 Recorde: "+finalScore;
            recordMsg=" — 🏆 NOVO RECORDE!";
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
