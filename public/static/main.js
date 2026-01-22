import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, deleteDoc, updateDoc, doc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC_JTgYh5-eJroKw3TG0uabPRLEl0cqiu8",
    authDomain: "banco-de-dados-95f69.firebaseapp.com",
    projectId: "banco-de-dados-95f69",
    storageBucket: "banco-de-dados-95f69.firebasestorage.app",
    messagingSenderId: "840265398728",
    appId: "1:840265398728:web:bb6912cb31a724f9e9a8fd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const dbCollection = collection(db, "colaboradores_ti");

let allData = [];

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app-screen').style.display = 'block';
        loadData();
    } else {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('app-screen').style.display = 'none';
    }
});

document.getElementById('btnLogin').addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    signInWithEmailAndPassword(auth, email, pass).catch(err => {
        document.getElementById('loginError').style.display = 'block';
    });
});
document.getElementById('btnLogout').addEventListener('click', () => signOut(auth));

function loadData() {
    const q = query(dbCollection, orderBy("nome"));
    onSnapshot(q, (snapshot) => {
        allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderTable(allData);
        document.getElementById('loading').style.display = 'none';
    });
}

document.getElementById('tiForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSubmit');
    btn.disabled = true; btn.innerText = "Salvando...";
    
    const docId = document.getElementById('docId').value;
    const data = {
        empresa: document.getElementById('empresa').value,
        nome: document.getElementById('nome').value,
        cargo: document.getElementById('cargo').value,
        email: document.getElementById('email').value,
        ramal: document.getElementById('ramal').value,
        usuarioPc: document.getElementById('usuarioPc').value,
        senhaPc: document.getElementById('senhaPc').value,
        senhaEmail: document.getElementById('senhaEmail').value,
        ip: document.getElementById('ip').value,
        userProtheus: document.getElementById('userProtheus').value,
        senhaProtheus: document.getElementById('senhaProtheus').value,
        userOrpen: document.getElementById('userOrpen').value,
        senhaOrpen: document.getElementById('senhaOrpen').value,
        emailTeams: document.getElementById('emailTeams').value,
        senhaTeams: document.getElementById('senhaTeams').value,
        updatedAt: new Date()
    };

    try {
        if(docId) await updateDoc(doc(db, "colaboradores_ti", docId), data);
        else { data.createdAt = new Date(); await addDoc(dbCollection, data); }
        showToast("Registro salvo!");
        resetForm();
    } catch (err) { alert("Erro: " + err.message); }
    finally { btn.disabled = false; btn.innerHTML = `<span class="material-icons-round">save</span> Salvar Registro`; }
});

function renderTable(list) {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = "";
    
    if(list.length === 0) {
         tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:1rem;">Nenhum registro encontrado.</td></tr>';
         return;
    }
    
    list.forEach(item => {
        const badgeClass = item.empresa === 'Chiaperini' || item.empresa === 'Chiaperini PRO' ? 'badge-chiaperini' : 'badge-mercadao';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div style="font-weight:700;">${item.nome}</div>
                <div style="font-size:0.8rem; color:var(--text-sec)">${item.cargo || 'N/A'}</div>
                <span class="badge ${badgeClass}">${item.empresa || 'N/A'}</span>
                <div style="margin-top:4px; font-size:0.8rem">${item.email}</div>
            </td>
            <td>
                ${renderBox('PC', item.usuarioPc, item.senhaPc)}
                ${renderBox('E-mail', item.email, item.senhaEmail)}
            </td>
            <td>
                ${renderBox('Protheus', item.userProtheus, item.senhaProtheus)}
                ${renderBox('Orpen', item.userOrpen, item.senhaOrpen)}
            </td>
            <td>
                <div style="font-size:0.8rem; margin-bottom:4px;">Ramal: ${item.ramal || '-'}</div>
                <div style="font-size:0.8rem;">IP: ${item.ip || 'DHCP'}</div>
                ${item.senhaTeams ? renderBox('Teams', item.emailTeams, item.senhaTeams) : ''}
            </td>
            <td>
                <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                    <button class="btn-icon" onclick="openOutlook('${item.id}')" title="Enviar Senhas por E-mail">
                        <span class="material-icons-round" style="color:var(--text-sec)">mail</span>
                    </button>
                    <button class="btn-icon" onclick="copySignature('${item.id}')" title="Copiar Assinatura com LOGO">
                        <span class="material-icons-round" style="color:#0ea5e9">assignment</span>
                    </button>
                    <button class="btn-icon" onclick="editItem('${item.id}')" title="Editar">
                        <span class="material-icons-round" style="color:var(--primary)">edit</span>
                    </button>
                    <button class="btn-icon" onclick="deleteItem('${item.id}')" title="Excluir">
                        <span class="material-icons-round" style="color:var(--danger)">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderBox(label, user, pass) {
    if(!user && !pass) return '';
    const safePass = (pass || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    
    return `
        <div class="cred-box">
            <div>
                <span style="font-weight:700; color:var(--primary)">${label}:</span> 
                <span class="password-mask" onclick="this.classList.toggle('revealed')">${pass || '***'}</span>
            </div>
            <div class="btn-copy-mini" onclick="copyText('${safePass}')" title="Copiar Senha">
                <span class="material-icons-round" style="font-size:16px;">content_copy</span>
            </div>
        </div>
    `;
}

window.copyText = (text) => {
    if (!text) return;
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if(successful) showToast("Copiado para área de transferência!");
        else throw new Error("Falha");
    } catch (err) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => showToast("Copiado!"));
        } else {
            alert("Não foi possível copiar automaticamente.");
        }
    }
    document.body.removeChild(textArea);
};

window.copySignature = (id) => {
    const item = allData.find(d => d.id === id);
    if (!item) return;

    const isChiaperini = item.empresa === 'Chiaperini' || item.empresa === 'Chiaperini PRO';
    const logoUrl = isChiaperini ? "/media/logo-chiaperini.png" : "/media/logo-mercadao.png";
    const iconMail = "/media/icon-email.png";
    const iconPhone = "/media/icon-phone.png";
    const iconWeb = "/media/icon-web.png";

    const site = isChiaperini ? 'www.chiaperini.com.br' : 'www.mercadaolojista.com.br';
    const tel = isChiaperini ? '(16) 3954-9400' : '(16) 3954-9415';
    const ramalText = item.ramal ? ` – Ramal ${item.ramal}` : '';

    const htmlSignature = `
<div style="font-family: Calibri, sans-serif; font-size: 12pt; color: #000;">
    <p style="margin: 0 0 2px 0; font-size: 12pt; font-weight: bold;">
        ${item.nome}
    </p>
    <p style="margin: 0 0 10px 0; font-size: 12pt; font-style: italic; color: #000;">
        ${item.cargo}
    </p>
    <table cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td style="vertical-align: middle; padding-right: 50px;">
                <img src="${logoUrl}" alt="${item.empresa}" width="250" height="54" style="display: block;">
            </td>
            <td style="vertical-align: middle;">
                <table cellpadding="0" cellspacing="0" border="0" style="font-size: 11pt;">
                    <tr>
                        <td style="padding: 1px 3px 1px 0; vertical-align: middle;">
                            <img src="${iconMail}" width="16" height="16" style="display: block;" onerror="this.style.display='none'">
                        </td>
                        <td style="padding: 1px 0; vertical-align: middle;">
                            <a href="mailto:${item.email}" style="color: #0563c1; text-decoration: none; font-weight: bold;">${item.email}</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 1px 3px 1px 0; vertical-align: middle;">
                            <img src="${iconPhone}" width="16" height="16" style="display: block;" onerror="this.style.display='none'">
                        </td>
                        <td style="padding: 1px 0; vertical-align: middle; font-weight: bold;">
                            ${tel}${ramalText}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 1px 3px 1px 0; vertical-align: middle;">
                            <img src="${iconWeb}" width="16" height="16" style="display: block;" onerror="this.style.display='none'">
                        </td>
                        <td style="padding: 1px 0; vertical-align: middle;">
                            <a href="http://${site}" style="color: #0563c1; text-decoration: none; font-weight: bold;">${site}</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</div>
    `.trim();

    const container = document.getElementById('signature-clipboard-container');
    container.innerHTML = htmlSignature;
    const range = document.createRange();
    range.selectNode(container);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    try {
        document.execCommand('copy');
        showToast("✅ Assinatura copiada! Cole no Outlook com Ctrl+V");
    } catch (err) {
        alert("❌ Erro ao copiar. Tente novamente.");
    }
    window.getSelection().removeAllRanges();
};

window.deleteItem = async (id) => {
    if(confirm("Excluir este colaborador?")) await deleteDoc(doc(db, "colaboradores_ti", id));
};

window.editItem = (id) => {
    const item = allData.find(d => d.id === id);
    if(!item) return;
    const fields = ['empresa','nome','cargo','email','ramal','usuarioPc','senhaPc','senhaEmail','ip',
                  'userProtheus','senhaProtheus','userOrpen','senhaOrpen','emailTeams','senhaTeams'];
    fields.forEach(f => {
        if(document.getElementById(f)) document.getElementById(f).value = item[f] || '';
    });
    document.getElementById('docId').value = item.id;
    document.getElementById('formTitle').innerText = "Editando Colaborador";
    document.getElementById('btnCancelEdit').style.display = 'inline-block';
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
};

document.getElementById('btnCancelEdit').addEventListener('click', resetForm);

function resetForm() {
    document.getElementById('tiForm').reset();
    document.getElementById('docId').value = "";
    document.getElementById('formTitle').innerText = "Novo Colaborador";
    document.getElementById('btnCancelEdit').style.display = 'none';
}

window.openOutlook = (id) => {
    const item = allData.find(d => d.id === id);
    if (!item) return;

    const subject = `Bem-vindo(a) - Credenciais de Acesso | ${item.empresa}`;
    let footerInfo = item.empresa === "Chiaperini" || item.empresa === "Chiaperini PRO"
        ? "Telefone: (16) 3954-9400\nSite: www.chiaperini.com.br"
        : "Telefone: (16) 3954-9415\nSite: www.mercadaolojista.com.br";

    const bodyText = `
Olá ${item.nome},

Seja bem-vindo(a)! Abaixo estão suas credenciais de acesso aos sistemas.

------------------------------------------
COMPUTADOR / REDE
Usuário: ${item.usuarioPc || '-'}
Senha: ${item.senhaPc || '-'}

E-MAIL CORPORATIVO
Email: ${item.email}
Senha: ${item.senhaEmail || '-'}

SISTEMA PROTHEUS
Usuário: ${item.userProtheus || '-'}
Senha: ${item.senhaProtheus || '-'}

SISTEMA ORPEN
Usuário: ${item.userOrpen || '-'}
Senha: ${item.senhaOrpen || '-'}

OUTROS
Ramal: ${item.ramal || '-'}
${item.emailTeams ? `Teams: ${item.emailTeams} (Senha: ${item.senhaTeams})` : ''}
------------------------------------------

* Recomendamos a troca das senhas no primeiro acesso.

Atenciosamente,
Departamento de TI

${footerInfo}
    `.trim();

    window.location.href = `mailto:${item.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
};

document.getElementById('searchInput').addEventListener('keyup', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allData.filter(d => 
        d.nome.toLowerCase().includes(term) || 
        (d.empresa || '').toLowerCase().includes(term)
    );
    renderTable(filtered);
});

function showToast(msg) {
    const t = document.getElementById('toast');
    document.getElementById('toastMsg').innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}
