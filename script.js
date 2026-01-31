document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('submitBtn');
    
    // Toggle Elements
    const toggleBtn = document.getElementById('toggleBtn');
    const toggleText = document.getElementById('toggleText');
    const toggleBtnText = document.getElementById('toggleBtnText');
    const cardTitle = document.getElementById('cardTitle');
    const headerIcon = document.getElementById('headerIcon');
    
    // Fields to show/hide
    const registerFields = document.getElementById('register-fields');
    const confirmPasswordField = document.getElementById('confirm-password-field');

    const registerDepositLink = document.getElementById('register-deposit-link');
    if (registerDepositLink) {
        registerDepositLink.addEventListener('click', () => {
            localStorage.setItem('reg_deposit_link_opened_v2', 'true');
        });
    }

    let isLoginMode = true;

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            isLoginMode = !isLoginMode;
            updateFormMode();
        });
    }

    function updateFormMode() {
        if (isLoginMode) {
            // Switch to Login
            cardTitle.textContent = 'Entrar na Conta';
            submitBtn.textContent = 'ENTRAR AGORA';
            toggleText.textContent = 'Ainda não tem conta?';
            toggleBtnText.textContent = 'REGISTRAR E DEPOSITAR';
            
            registerFields.classList.add('hidden');
            confirmPasswordField.classList.add('hidden');
            
            // Icon logic (need to re-render lucide if changing icon name, but easier to just keep log-in or change class)
            // For simplicity, we keep the icon or toggle class if needed
        } else {
            // Switch to Register
            cardTitle.textContent = 'Criar Nova Conta';
            submitBtn.textContent = 'CRIAR CONTA GRÁTIS';
            toggleText.textContent = 'Já tem uma conta?';
            toggleBtnText.textContent = 'ACESSAR MINHA CONTA';
            
            registerFields.classList.remove('hidden');
            confirmPasswordField.classList.remove('hidden');
        }
    }

    async function hashPassword(pw) {
        const enc = new TextEncoder();
        const buf = await crypto.subtle.digest('SHA-256', enc.encode(pw));
        return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
    }

    (async ()=>{
        const adminEmail='felibarata03@gmail.com';
        const storedHash=localStorage.getItem('admin_pass:'+adminEmail);
        try {
            const list=JSON.parse(localStorage.getItem('admin_list')||'[]');
            if(!list.includes(adminEmail)){ list.push(adminEmail); localStorage.setItem('admin_list', JSON.stringify(list)); }
        } catch {
            localStorage.setItem('admin_list', JSON.stringify([adminEmail]));
        }
        localStorage.setItem('admin:'+adminEmail,'true');
        if (!storedHash) {
            localStorage.setItem('admin_pass:'+adminEmail, '60576a999dfd449ce7ec474fac510bcced3ae049b7e15424406f6b7488573641');
        }
    })();

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const originalBtnText = submitBtn.textContent;
            const hasRegistered = localStorage.getItem('reg_deposit_link_opened_v2') === 'true';
            const email = (emailInput && emailInput.value ? emailInput.value.trim() : '');
            const isActivated = email && localStorage.getItem('activation:'+email) === 'true';
            const isAdmin = email && (localStorage.getItem('admin:'+email)==='true' || (function(){try{return JSON.parse(localStorage.getItem('admin_list')||'[]').includes(email);}catch{return false;}})());
            const passInput = document.getElementById('password');
            const passVal = passInput ? passInput.value : '';
            if (isAdmin) {
                const storedHash = localStorage.getItem('admin_pass:'+email) || '';
                const currentHash = await hashPassword(passVal);
                if (!storedHash || storedHash !== currentHash) {
                    alert('Senha do admin inválida.');
                    return;
                }
            }
            if (!hasRegistered) {
                if (!isAdmin) {
                    alert('Acesso restrito: Você precisa se cadastrar primeiro! Clique no botão de cadastro para continuar.');
                    return;
                }
            }
            if (!isActivated) { /* validação de login não depende de ativação de jogo */ }
            // Simular loading
            submitBtn.textContent = isLoginMode ? 'Autenticando...' : 'Criando Conta...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'wait';

            // Simular delay de rede
            setTimeout(() => {
                // Salvar email para exibir no dashboard
                localStorage.setItem('userEmail', emailInput.value);
                
                // Redirecionar para o dashboard
                window.location.href = 'dashboard.html';
            }, 1500);
        });
    }
});
