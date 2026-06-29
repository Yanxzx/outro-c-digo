// Elementos do DOM
const passwordDisplay = document.getElementById('passwordDisplay');
const copyBtn = document.getElementById('copyBtn');
const copiedTooltip = document.getElementById('copiedTooltip');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const includeNumbers = document.getElementById('includeNumbers');
const includeSpecial = document.getElementById('includeSpecial');
const includeUppercase = document.getElementById('includeUppercase');
const generateBtn = document.getElementById('generateBtn');
const meterFill = document.getElementById('meterFill');
const strengthValue = document.getElementById('strengthValue');

// Criar Fluxos de Dados no Fundo
function criarFluxosDeDados() {
    const container = document.getElementById('dataStreams');
    const caracteres = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';
    
    for (let i = 0; i < 20; i++) {
        const fluxo = document.createElement('div');
        fluxo.className = 'stream';
        fluxo.style.left = (Math.random() * 100) + '%';
        fluxo.style.animationDuration = (Math.random() * 10 + 10) + 's';
        fluxo.style.animationDelay = (Math.random() * 10) + 's';
        
        let texto = '';
        for (let j = 0; j < 30; j++) {
            texto += caracteres[Math.floor(Math.random() * caracteres.length)] + '<br>';
        }
        fluxo.innerHTML = texto;
        container.appendChild(fluxo);
    }
}

// Atualizar Exibição do Comprimento
function atualizarComprimento(valor) {
    lengthValue.textContent = valor;
    gerarSenha();
}

// Calcular Força da Senha
function calcularForca(senha) {
    let forca = 0;
    const comprimento = senha.length;
    
    // Força baseada no comprimento
    if (comprimento >= 8) forca += 1;
    if (comprimento >= 12) forca += 1;
    if (comprimento >= 16) forca += 1;
    if (comprimento >= 20) forca += 1;
    
    // Força baseada na variedade de caracteres
    if (/[0-9]/.test(senha)) forca += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) forca += 1;
    if (/[A-Z]/.test(senha)) forca += 1;
    if (/[a-z]/.test(senha)) forca += 1;
    
    const niveisForca = ['Muito Fraca', 'Fraca', 'Regular', 'Boa', 'Forte', 'Muito Forte'];
    const indice = Math.min(Math.floor(forca / 1.5), niveisForca.length - 1);
    
    return {
        nivel: niveisForca[indice],
        porcentagem: ((indice + 1) / niveisForca.length) * 100,
        cor: obterCorForca(indice)
    };
}

// Obter Cor da Força
function obterCorForca(indice) {
    const cores = ['#FF4444', '#FF6644', '#FFAA00', '#FFFF00', '#00FF88', '#00F0FF'];
    return cores[indice] || cores[cores.length - 1];
}

// Atualizar Interface do Medidor de Força
function atualizarMedidorForca(senha) {
    const forca = calcularForca(senha);
    
    meterFill.style.width = forca.porcentagem + '%';
    meterFill.style.backgroundColor = forca.cor;
    meterFill.style.boxShadow = `0 0 15px ${forca.cor}`;
    strengthValue.textContent = forca.nivel;
    strengthValue.style.color = forca.cor;
}

// Gerar Senha
function gerarSenha() {
    const comprimento = parseInt(lengthSlider.value);
    const usarNumeros = includeNumbers.checked;
    const usarEspeciais = includeSpecial.checked;
    const usarMaiusculas = includeUppercase.checked;
    
    // Construir conjunto de caracteres
    let caracteres = 'abcdefghijklmnopqrstuvwxyz';
    if (usarNumeros) caracteres += '0123456789';
    if (usarEspeciais) caracteres += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (usarMaiusculas) caracteres += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    // Gerar senha criptograficamente segura
    let senha = '';
    const array = new Uint32Array(comprimento);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < comprimento; i++) {
        senha += caracteres[array[i] % caracteres.length];
    }
    
    // Atualizar exibição
    passwordDisplay.textContent = senha;
    atualizarMedidorForca(senha);
    
    // Adicionar efeito de brilho temporário
    passwordDisplay.style.textShadow = '0 0 20px rgba(0, 240, 255, 0.8)';
    setTimeout(() => {
        passwordDisplay.style.textShadow = '0 0 15px rgba(0, 240, 255, 0.5)';
    }, 200);
}

// Copiar Senha para Área de Transferência
function copiarSenha() {
    const senha = passwordDisplay.textContent;
    
    // Gerar uma senha se não existir nenhuma
    if (senha === 'Clique em Gerar') {
        gerarSenha();
    }
    
    const senhaAtual = passwordDisplay.textContent;
    
    navigator.clipboard.writeText(senhaAtual).then(() => {
        // Mostrar tooltip de sucesso
        copiedTooltip.classList.add('show');
        setTimeout(() => {
            copiedTooltip.classList.remove('show');
        }, 1500);
    }).catch(erro => {
        console.error('Erro ao copiar senha:', erro);
        alert('Não foi possível copiar a senha. Tente novamente.');
    });
}

// Ouvintes de Eventos
lengthSlider.addEventListener('input', (e) => atualizarComprimento(e.target.value));
includeNumbers.addEventListener('change', gerarSenha);
includeSpecial.addEventListener('change', gerarSenha);
includeUppercase.addEventListener('change', gerarSenha);
generateBtn.addEventListener('click', gerarSenha);
copyBtn.addEventListener('click', copiarSenha);

// Inicializar
function inicializar() {
    criarFluxosDeDados();
    gerarSenha();
}

// Executar quando a página carregar
document.addEventListener('DOMContentLoaded', inicializar);