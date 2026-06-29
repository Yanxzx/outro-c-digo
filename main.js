// =====================================================
// 1. FUNDO ANIMADO (canvas com linhas de dados)
// =====================================================
(function initBackground() {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    const lines = [];
    const LINE_COUNT = 28;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class DataLine {
        constructor() {
            this.reset();
            this.y = Math.random() * height;
        }
        reset() {
            this.x = Math.random() * width;
            this.y = -20;
            this.speed = 0.3 + Math.random() * 0.6;
            this.length = 40 + Math.random() * 100;
            this.opacity = 0.03 + Math.random() * 0.06;
            this.width = 1 + Math.random() * 1.2;
            this.hue = Math.random() > 0.5 ? 170 : 260; // ciano ou roxo
        }
        update() {
            this.y += this.speed;
            if (this.y > height + 30) {
                this.reset();
                this.y = -20 - Math.random() * 40;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + Math.sin(this.y * 0.005) * 6, this.y + this.length);
            ctx.strokeStyle = `hsla(${this.hue}, 80%, 60%, ${this.opacity})`;
            ctx.lineWidth = this.width;
            ctx.shadowColor = `hsla(${this.hue}, 80%, 60%, ${this.opacity * 0.3})`;
            ctx.shadowBlur = 8;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }

    for (let i = 0; i < LINE_COUNT; i++) {
        lines.push(new DataLine());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        lines.forEach(line => {
            line.update();
            line.draw();
        });
        // linhas geométricas adicionais (holográficas)
        ctx.strokeStyle = 'rgba(102, 0, 255, 0.03)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) {
            const x = (i / 6) * width;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + 60, height);
            ctx.stroke();
        }
        requestAnimationFrame(animate);
    }
    animate();
})();

// =====================================================
// 2. GERADOR DE SENHAS
// =====================================================
const passwordDisplay = document.getElementById('passwordDisplay');
const lengthSlider = document.getElementById('lengthSlider');
const lengthLabel = document.getElementById('lengthLabel');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');

// Obter toggles
const toggleItems = document.querySelectorAll('.toggle-item');

// Estado
const state = {
    length: 16,
    numbers: true,
    special: true,
    uppercase: true,
};

// =====================================================
// 3. EVENTOS DOS TOGGLES
// =====================================================
toggleItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const isActive = this.classList.toggle('active');
        const key = this.dataset.key;
        if (key === 'numbers') state.numbers = isActive;
        if (key === 'special') state.special = isActive;
        if (key === 'uppercase') state.uppercase = isActive;
    });
});

// =====================================================
// 4. EVENTO DO SLIDER
// =====================================================
lengthSlider.addEventListener('input', function() {
    state.length = parseInt(this.value, 10);
    lengthLabel.textContent = state.length;
});

// =====================================================
// 5. FUNÇÃO GERAR SENHA
// =====================================================
function generatePassword() {
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (state.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (state.numbers) chars += '0123456789';
    if (state.special) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (chars.length === 0) {
        passwordDisplay.value = 'Selecione ao menos uma opção';
        passwordDisplay.classList.remove('glow-purple');
        return;
    }

    let password = '';
    for (let i = 0; i < state.length; i++) {
        const idx = Math.floor(Math.random() * chars.length);
        password += chars[idx];
    }

    passwordDisplay.value = password;
    // Alterna o brilho entre ciano e roxo aleatoriamente
    if (Math.random() > 0.5) {
        passwordDisplay.classList.add('glow-purple');
    } else {
        passwordDisplay.classList.remove('glow-purple');
    }
}

// =====================================================
// 6. EVENTO DO BOTÃO GERAR
// =====================================================
generateBtn.addEventListener('click', generatePassword);

// =====================================================
// 7. FUNÇÃO COPIAR
// =====================================================
copyBtn.addEventListener('click', function() {
    const text = passwordDisplay.value;
    if (!text || text === 'Selecione ao menos uma opção' || text === '••••••••••••') return;

    navigator.clipboard.writeText(text).then(() => {
        this.classList.add('copied');
        setTimeout(() => this.classList.remove('copied'), 1200);
    }).catch(() => {
        // Fallback para navegadores antigos
        passwordDisplay.select();
        document.execCommand('copy');
        this.classList.add('copied');
        setTimeout(() => this.classList.remove('copied'), 1200);
    });
});

// =====================================================
// 8. GERAR SENHA AO CARREGAR A PÁGINA
// =====================================================
window.addEventListener('DOMContentLoaded', () => {
    generatePassword();
});