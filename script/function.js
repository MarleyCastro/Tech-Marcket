document.addEventListener('DOMContentLoaded', () => {

    const dadosExtratos = {
        saldo: 4820.90,
        transacoes: [
            { tipo: 'venda', descricao: 'Venda - Fone', valor: 249.90, dia: 90 },
            { tipo: 'venda', descricao: 'Venda - Teclado Mecânico', valor: 399.90, dia: 90 },
            { tipo: 'compra', descricao: 'Compra - Estoque de Fones', valor: 1500.00, dia: 60 },
            { tipo: 'serviço', descricao: 'Serviço - Desenvolvimento de Site', valor: 2500.00, dia: 15 },
            { tipo: 'assinatura', descricao: 'Assinatura - GitHub Pro', valor: 48.00, dia: 30 },
            { tipo: 'despesa', descricao: 'Despesa - Energia Elétrica', valor: 520.75, dia: 30 },
            { tipo: 'entrada', descricao: 'Entrada - Investimento de Sócio', valor: 5000.00, dia: 7 },
            { tipo: 'compra', descricao: 'Compra - Estoque de Fones', valor: 1500.00, dia: 60 },
            { tipo: 'compra', descricao: 'Compra - Equipamentos de Escritório', valor: 780.50, dia: 60 },
            { tipo: 'compra', descricao: 'Compra - Embalagens', valor: 230.40 },
            { tipo: 'compra', descricao: 'Compra - Materiais de Limpeza', valor: 150.00, dia: 60 },

            { tipo: 'serviço', descricao: 'Serviço - Manutenção de Computadores', valor: 350.00, dia: 15 },
            { tipo: 'serviço', descricao: 'Serviço - Desenvolvimento de Site', valor: 2500.00, dia: 15 },
            { tipo: 'serviço', descricao: 'Serviço - Suporte Técnico Mensal', valor: 500.00, dia: 15 },

            { tipo: 'assinatura', descricao: 'Assinatura - Spotify Premium', valor: 34.90, dia: 15 },
            { tipo: 'assinatura', descricao: 'Assinatura - Adobe Creative Cloud', valor: 179.90, dia: 15 },
            { tipo: 'assinatura', descricao: 'Assinatura - GitHub Pro', valor: 48.00, dia: 30 },

            { tipo: 'despesa', descricao: 'Despesa - Energia Elétrica', valor: 520.75, dia: 30 },
            { tipo: 'despesa', descricao: 'Despesa - Internet', valor: 189.90, dia: 30 },
            { tipo: 'despesa', descricao: 'Despesa - Água', valor: 140.25, dia: 7 },
            { tipo: 'despesa', descricao: 'Despesa - Transporte', valor: 320.00, dia: 7 },

            { tipo: 'entrada', descricao: 'Entrada - Investimento de Sócio', valor: -5000.00, dia: 7 },
            { tipo: 'entrada', descricao: 'Entrada - Pagamento de Cliente', valor: -1250.00, dia: 7 },
            { tipo: 'entrada', descricao: 'Entrada - Retorno Financeiro', valor: -875.50, dia: 7 }
        ]
    };

    const periodoSelect = document.getElementById('periodo');
    const saldoElemento = document.getElementById('saldo-valor');
    const listaTransacoes = document.getElementById('lista-transacoes');

    // Mostra saldo formatado
    saldoElemento.textContent = dadosExtratos.saldo.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    // Função para renderizar a lista conforme o filtro
    function renderizarTransacoes(filtroDias) {
        listaTransacoes.innerHTML = ''; // limpa a lista

        const filtradas = dadosExtratos.transacoes.filter(t => t.dia <= filtroDias);

        filtradas.forEach(transacao => {
            const li = document.createElement('li');
            li.classList.add('transacao');

            if (Math.abs(transacao.valor) >= 5000) li.classList.add('transacao-alta');

            if (Math.abs(transacao.valor) < 0) li.classList.add('valor-negativo');

            if (Math.abs(transacao.valor) >= 0) li.classList.add('valor-positivo');
    
            const valorFormatado = transacao.valor.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            li.innerHTML = `
        <div class="transacao-info">
          <span>${transacao.descricao}</span>
          <span class="transacao-valor">${valorFormatado}</span>
        </div>
      `;
            listaTransacoes.appendChild(li);
        });
    }

    // Atualiza a lista ao mudar o filtro
    periodoSelect.addEventListener('change', e => {
        const valor = parseInt(e.target.value);
        console.log('Filtro alterado para:', valor, 'dias');
        renderizarTransacoes(valor);
    });

    // Mostra inicialmente as últimas 30 dias (default)
    renderizarTransacoes(parseInt(periodoSelect.value));
});