// Importação de dependências
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(express.json());

// Simulação de banco de dados em memória
let contas = {
    '12345': { saldo: 10000.00, titular: 'João Silva' },
    '67890': { saldo: 5000.00, titular: 'Maria Santos' }
};

let transacoes = [];

// Endpoint de transferência financeira
app.post('/api/transferencias', async (req, res) => {
    try {
        // Extração dos dados da requisição
        const { conta_origem, conta_destino, valor } = req.body;

        // VALIDAÇÃO 1: Verificar se todos os campos foram enviados
        if (!conta_origem || !conta_destino || !valor) {
            return res.status(400).json({
                mensagem: 'Campos obrigatórios: conta_origem, conta_destino, valor'
            });
        }

        // VALIDAÇÃO 2: Verificar se o valor é válido
        if (valor <= 0) {
            return res.status(400).json({
                mensagem: 'O valor da transferência deve ser maior que zero'
            });
        }

        // VALIDAÇÃO 3: Verificar se as contas existem
        if (!contas[conta_origem] || !contas[conta_destino]) {
            return res.status(404).json({
                mensagem: 'Conta de origem ou destino não encontrada'
            });
        }

        // VALIDAÇÃO 4: Verificar saldo suficiente
        if (contas[conta_origem].saldo < valor) {
            return res.status(400).json({
                mensagem: 'Saldo insuficiente para realizar a transferência',
                saldo_disponivel: contas[conta_origem].saldo
            });
        }

        // VALIDAÇÃO 5: Evitar transferência para a mesma conta
        if (conta_origem === conta_destino) {
            return res.status(400).json({
                mensagem: 'Não é possível transferir para a mesma conta'
            });
        }

        // Geração de código único para a transação
        const codigo_transacao = uuidv4();
        const data_transacao = new Date().toISOString();

        // Realização da transferência (operação atômica)
        contas[conta_origem].saldo -= valor;
        contas[conta_destino].saldo += valor;

        // Registro da transação
        const transacao = {
            codigo: codigo_transacao,
            tipo: 'TRANSFERENCIA',
            conta_origem: conta_origem,
            conta_destino: conta_destino,
            valor: valor,
            data: data_transacao,
            status: 'CONCLUIDA'
        };

        transacoes.push(transacao);

        // Resposta de sucesso
        return res.status(201).json({
            mensagem: 'Transferência realizada com sucesso',
            dados: {
                codigo_transacao: codigo_transacao,
                valor_transferido: valor,
                conta_origem: conta_origem,
                conta_destino: conta_destino,
                novo_saldo_origem: contas[conta_origem].saldo,
                data_hora: data_transacao
            }
        });

    } catch (erro) {
        // Tratamento de erros inesperados
        console.error('Erro na transferência:', erro);
        return res.status(500).json({
            mensagem: 'Erro interno do servidor ao processar a transferência'
        });
    }
});

// Endpoint auxiliar para consultar saldo
app.get('/api/contas/:numero/saldo', (req, res) => {
    const numero = req.params.numero;

    if (!contas[numero]) {
        return res.status(404).json({
            mensagem: 'Conta não encontrada'
        });
    }

    return res.status(200).json({
        numero_conta: numero,
        titular: contas[numero].titular,
        saldo: contas[numero].saldo
    });
});

// Inicialização do servidor
const PORT = 3000;
app.listen(PORT, () => {
        console.log(`Servidor rodando na porta http://localhost:${PORT}`);
    });