import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/static/main.js';
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  return (
    <>
      <div id="login-screen">
        <div className="login-card">
          <h2>Acesso Restrito TI</h2>
          <div style={{ margin: '1rem 0', textAlign: 'left' }}>
            <label>E-mail</label> <input type="email" id="loginEmail" placeholder="admin@empresa.com" />
          </div>
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <label>Senha</label> <input type="password" id="loginPass" placeholder="••••••••" />
          </div>
          <button id="btnLogin" className="btn btn-primary">Entrar</button>
          <p id="loginError" style={{ color: 'var(--danger)', marginTop: '1rem', display: 'none' }}>Erro no login.</p>
        </div>
      </div>

      <div id="app-screen">
        <header>
          <div className="header-title">
            <h1>Gestão de Credenciais</h1>
            <p style={{ color: 'var(--text-sec)' }}>Registro de acessos e envio de credenciais</p>
          </div>
          <button id="btnLogout" className="btn-logout"><span className="material-icons-round">logout</span> Sair</button>
        </header>

        <div className="form-card">
          <div className="form-header">
            <h3 id="formTitle">Novo Colaborador</h3>
            <button type="button" id="btnCancelEdit" className="btn btn-cancel" style={{ display: 'none', padding: '0.5rem 1rem' }}>Cancelar Edição</button>
          </div>
          <form id="tiForm">
            <input type="hidden" id="docId" />

            <div className="form-grid">
              <div className="section-title">Dados do Colaborador</div>
              <div className="input-group">
                <label>Empresa</label>
                <select id="empresa" required>
                  <option value="">Selecione...</option>
                  <option value="Chiaperini">Chiaperini</option>
                  <option value="Mercadão Lojista">Mercadão Lojista</option>
                </select>
              </div>
              <div className="input-group">
                <label>Nome Completo</label>
                <input type="text" id="nome" required />
              </div>
              <div className="input-group">
                <label>Cargo</label>
                <input type="text" id="cargo" required />
              </div>
              <div className="input-group">
                <label>E-mail Corporativo</label>
                <input type="email" id="email" required />
              </div>
              <div className="input-group">
                <label>Ramal</label>
                <input type="number" id="ramal" />
              </div>

              <div className="section-title">Rede & Windows</div>
              <div className="input-group">
                <label>Usuário PC (AD)</label>
                <input type="text" id="usuarioPc" />
              </div>
              <div className="input-group">
                <label>Senha PC</label>
                <input type="text" id="senhaPc" />
              </div>
              <div className="input-group">
                <label>Senha E-mail</label>
                <input type="text" id="senhaEmail" />
              </div>
              <div className="input-group">
                <label>IP (IPv4)</label>
                <input type="text" id="ip" />
              </div>

              <div className="section-title">Sistemas (Protheus / Orpen)</div>
              <div className="input-group">
                <label>Usuário Protheus</label>
                <input type="text" id="userProtheus" />
              </div>
              <div className="input-group">
                <label>Senha Protheus</label>
                <input type="text" id="senhaProtheus" />
              </div>
              <div className="input-group">
                <label>Usuário Orpen</label>
                <input type="text" id="userOrpen" />
              </div>
              <div className="input-group">
                <label>Senha Orpen</label>
                <input type="text" id="senhaOrpen" />
              </div>

              <div className="section-title">Microsoft Teams</div>
              <div className="input-group">
                <label>E-mail Teams</label>
                <input type="email" id="emailTeams" />
              </div>
              <div className="input-group">
                <label>Senha Teams</label>
                <input type="text" id="senhaTeams" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" id="btnSubmit">
              <span className="material-icons-round">save</span> Salvar Registro
            </button>
          </form>
        </div>

        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
          <input type="text" id="searchInput" placeholder="Buscar por nome, empresa..." style={{ width: '100%', maxWidth: '400px', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)' }} />
        </div>

        <div className="table-wrapper">
          <table id="dataTable">
            <thead>
              <tr>
                <th width="20%">Colaborador</th>
                <th width="15%">Acessos Rede</th>
                <th width="15%">Sistemas</th>
                <th width="15%">Outros</th>
                <th width="12%">Ações</th>
              </tr>
            </thead>
            <tbody id="tbody"></tbody>
          </table>
          <div id="loading" style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</div>
        </div>
      </div>

      <div id="signature-clipboard-container"></div>

      <div id="toast">
        <span className="material-icons-round">check_circle</span>
        <span id="toastMsg">Copiado para área de transferência!</span>
      </div>
    </>
  );
}
