// Formatação automática de CPF
document.getElementById('cpf').addEventListener('input', function (e) {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length <= 11) {
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = valor;
    }
});

// Formatação automática de telefone
document.getElementById('telefone').addEventListener('input', function (e) {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length <= 11) {
        if (valor.length <= 10) {
            valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
            valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
        } else {
            valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
            valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
        }
        e.target.value = valor;
    }
});

// VALIDAÇÃO 1: CPF
function validarCPF(cpf) {
    const cpfLimpo = cpf.replace(/\D/g, '');

    if (cpfLimpo.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;

    return true;
}

// VALIDAÇÃO 2: Data de Nascimento
function validarDataNascimento(data) {
    if (!data) return false;

    const dataNascimento = new Date(data);
    const dataAtual = new Date();

    if (isNaN(dataNascimento.getTime())) return false;
    if (dataNascimento > dataAtual) return false;

    let idade = dataAtual.getFullYear() - dataNascimento.getFullYear();
    const mes = dataAtual.getMonth() - dataNascimento.getMonth();

    if (mes < 0 || (mes === 0 && dataAtual.getDate() < dataNascimento.getDate())) {
        idade--;
    }

    if (idade < 18 || idade > 120) return false;

    return true;
}

// VALIDAÇÃO 3: Telefone
function validarTelefone(telefone) {
    const telefoneLimpo = telefone.replace(/\D/g, '');

    if (telefoneLimpo.length !== 10 && telefoneLimpo.length !== 11) return false;

    const ddd = parseInt(telefoneLimpo.substring(0, 2));
    if (ddd < 11 || ddd > 99) return false;

    if (/^(\d)\1+$/.test(telefoneLimpo)) return false;

    if (telefoneLimpo.length === 11 && telefoneLimpo.charAt(2) !== '9') return false;

    return true;
}

// Validação de e-mail
function validarEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
}

// Validação em tempo real do CPF
document.getElementById('cpf').addEventListener('blur', function () {
    const cpf = this.value;
    const erroCPF = document.getElementById('erro-cpf');
    const sucessoCPF = document.getElementById('sucesso-cpf');

    if (validarCPF(cpf)) {
        this.classList.remove('erro');
        this.classList.add('sucesso');
        erroCPF.classList.remove('mostrar');
        sucessoCPF.classList.add('mostrar');
    } else {
        this.classList.remove('sucesso');
        this.classList.add('erro');
        erroCPF.classList.add('mostrar');
        sucessoCPF.classList.remove('mostrar');
    }
});

// Validação em tempo real da data
document.getElementById('dataNascimento').addEventListener('blur', function () {
    const data = this.value;
    const erroData = document.getElementById('erro-data');
    const sucessoData = document.getElementById('sucesso-data');

    if (validarDataNascimento(data)) {
        this.classList.remove('erro');
        this.classList.add('sucesso');
        erroData.classList.remove('mostrar');
        sucessoData.classList.add('mostrar');
    } else {
        this.classList.remove('sucesso');
        this.classList.add('erro');
        erroData.classList.add('mostrar');
        sucessoData.classList.remove('mostrar');
    }
});

// Validação em tempo real do telefone
document.getElementById('telefone').addEventListener('blur', function () {
    const telefone = this.value;
    const erroTelefone = document.getElementById('erro-telefone');
    const sucessoTelefone = document.getElementById('sucesso-telefone');

    if (validarTelefone(telefone)) {
        this.classList.remove('erro');
        this.classList.add('sucesso');
        erroTelefone.classList.remove('mostrar');
        sucessoTelefone.classList.add('mostrar');
    } else {
        this.classList.remove('sucesso');
        this.classList.add('erro');
        erroTelefone.classList.add('mostrar');
        sucessoTelefone.classList.remove('mostrar');
    }
});

// Validação em tempo real do e-mail
document.getElementById('email').addEventListener('blur', function () {
    const email = this.value;
    const erroEmail = document.getElementById('erro-email');
    const sucessoEmail = document.getElementById('sucesso-email');

    if (validarEmail(email)) {
        this.classList.remove('erro');
        this.classList.add('sucesso');
        erroEmail.classList.remove('mostrar');
        sucessoEmail.classList.add('mostrar');
    } else {
        this.classList.remove('sucesso');
        this.classList.add('erro');
        erroEmail.classList.add('mostrar');
        sucessoEmail.classList.remove('mostrar');
    }
});

// Validação geral do formulário
document.getElementById('formAberturaConta').addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;

    let formularioValido = true;

    if (nome.trim().length < 3) {
        document.getElementById('nome').classList.add('erro');
        document.getElementById('erro-nome').classList.add('mostrar');
        formularioValido = false;
    } else {
        document.getElementById('nome').classList.remove('erro');
        document.getElementById('erro-nome').classList.remove('mostrar');
    }

    if (!validarCPF(cpf)) {
        document.getElementById('cpf').classList.add('erro');
        document.getElementById('erro-cpf').classList.add('mostrar');
        formularioValido = false;
    }

    if (!validarDataNascimento(dataNascimento)) {
        document.getElementById('dataNascimento').classList.add('erro');
        document.getElementById('erro-data').classList.add('mostrar');
        formularioValido = false;
    }

    if (!validarTelefone(telefone)) {
        document.getElementById('telefone').classList.add('erro');
        document.getElementById('erro-telefone').classList.add('mostrar');
        formularioValido = false;
    }

    if (!validarEmail(email)) {
        document.getElementById('email').classList.add('erro');
        document.getElementById('erro-email').classList.add('mostrar');
        formularioValido = false;
    }

    if (formularioValido) {
        document.getElementById('alertaSucesso').classList.add('mostrar');

        console.log('Dados do formulário:');
        console.log('Nome:', nome);
        console.log('CPF:', cpf);
        console.log('Data de Nascimento:', dataNascimento);
        console.log('Telefone:', telefone);
        console.log('E-mail:', email);

        
window.location.href = "ExtratoCompras.html";
        setTimeout(function () {
            
            document.getElementById('formAberturaConta').reset();
            document.querySelectorAll('.sucesso').forEach(el => el.classList.remove('sucesso'));
            document.querySelectorAll('.mensagem-sucesso').forEach(el => el.classList.remove('mostrar'));
        }, 6000);

    } else {
        alert('Por favor, corrija os erros no formulário antes de continuar.');
    }
});
