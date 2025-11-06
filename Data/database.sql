-- Criação das tabelas necessárias
CREATE TABLE IF NOT EXISTS contas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero_conta VARCHAR(20) UNIQUE NOT NULL,
    titular VARCHAR(100) NOT NULL,
    saldo DECIMAL(15,2) DEFAULT 0.00,
    data_abertura DATETIME DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS transacoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo_transacao VARCHAR(36) UNIQUE NOT NULL,
    conta_id INT NOT NULL,
    tipo_transacao ENUM('DEBITO', 'CREDITO', 'TRANSFERENCIA') NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    descricao VARCHAR(255),
    data_transacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    saldo_anterior DECIMAL(15,2),
    saldo_posterior DECIMAL(15,2),
    FOREIGN KEY (conta_id) REFERENCES contas(id),
    INDEX idx_conta_data (conta_id, data_transacao),
    INDEX idx_data (data_transacao)
) ENGINE=InnoDB;

-- Inserção de dados de exemplo
INSERT INTO contas (numero_conta, titular, saldo) VALUES
('12345-6', 'João Silva', 15000.00),
('67890-1', 'Maria Santos', 8500.00);

INSERT INTO transacoes (codigo_transacao, conta_id, tipo_transacao, valor, descricao, data_transacao, saldo_anterior, saldo_posterior) VALUES
(UUID(), 1, 'CREDITO', 5000.00, 'Depósito em dinheiro', '2025-10-25 10:30:00', 10000.00, 15000.00),
(UUID(), 1, 'DEBITO', 1500.00, 'Compra Online - TechMarket', '2025-10-26 14:20:00', 15000.00, 13500.00),
(UUID(), 1, 'DEBITO', 890.00, 'Transferência PIX', '2025-10-27 09:15:00', 13500.00, 12610.00),
(UUID(), 1, 'CREDITO', 2390.00, 'Estorno de compra', '2025-10-28 16:45:00', 12610.00, 15000.00),
(UUID(), 1, 'DEBITO', 5499.00, 'Compra Notebook Dell', '2025-10-28 14:32:00', 15000.00, 9501.00),
(UUID(), 1, 'DEBITO', 549.90, 'Mouse Logitech', '2025-10-29 11:10:00', 9501.00, 8951.10),
(UUID(), 1, 'CREDITO', 3000.00, 'Transferência recebida', '2025-10-30 08:00:00', 8951.10, 11951.10),
(UUID(), 1, 'DEBITO', 899.00, 'Teclado Mecânico', '2025-10-31 15:30:00', 11951.10, 11052.10),
(UUID(), 1, 'DEBITO', 1799.00, 'Fone Sony WH-1000XM4', '2025-11-01 19:45:00', 11052.10, 9253.10),
(UUID(), 1, 'CREDITO', 5746.90, 'Salário', '2025-11-02 07:00:00', 9253.10, 15000.00),
(UUID(), 1, 'DEBITO', 489.90, 'Webcam Logitech C920', '2025-11-02 13:22:00', 15000.00, 14510.10),
(UUID(), 1, 'DEBITO', 679.00, 'SSD Kingston 1TB', '2025-11-03 10:05:00', 14510.10, 13831.10);

-- STORED PROCEDURE PRINCIPAL
DELIMITER //

CREATE PROCEDURE sp_extrato_conta(
    IN p_numero_conta VARCHAR(20),
    IN p_data_inicio DATE,
    IN p_data_fim DATE
)
BEGIN
    -- Declaração de variáveis
    DECLARE v_conta_id INT;
    DECLARE v_saldo_atual DECIMAL(15,2);
    DECLARE v_total_creditos DECIMAL(15,2);
    DECLARE v_total_debitos DECIMAL(15,2);
    
    -- Tratamento de erros
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Erro ao processar extrato' AS mensagem_erro;
    END;
    
    -- Validação: verificar se a conta existe
    SELECT id, saldo INTO v_conta_id, v_saldo_atual
    FROM contas
    WHERE numero_conta = p_numero_conta AND ativo = TRUE;
    
    IF v_conta_id IS NULL THEN
        SELECT 'Conta não encontrada ou inativa' AS erro;
    ELSE
        -- Cálculo do saldo no período especificado
        SELECT 
            COALESCE(SUM(CASE WHEN tipo_transacao = 'CREDITO' THEN valor ELSE 0 END), 0) AS total_creditos,
            COALESCE(SUM(CASE WHEN tipo_transacao = 'DEBITO' THEN valor ELSE 0 END), 0) AS total_debitos
        INTO v_total_creditos, v_total_debitos
        FROM transacoes
        WHERE conta_id = v_conta_id
          AND DATE(data_transacao) BETWEEN p_data_inicio AND p_data_fim;
        
        -- Resultado 1: Informações gerais da conta
        SELECT 
            c.numero_conta AS 'Número da Conta',
            c.titular AS 'Titular',
            v_saldo_atual AS 'Saldo Atual',
            v_total_creditos AS 'Total de Créditos no Período',
            v_total_debitos AS 'Total de Débitos no Período',
            (v_total_creditos - v_total_debitos) AS 'Saldo do Período',
            p_data_inicio AS 'Data Início',
            p_data_fim AS 'Data Fim'
        FROM contas c
        WHERE c.id = v_conta_id;
        
        -- Resultado 2: Últimas 10 transações no período
        SELECT 
            t.codigo_transacao AS 'Código',
            t.tipo_transacao AS 'Tipo',
            t.descricao AS 'Descrição',
            CONCAT('R$ ', FORMAT(t.valor, 2, 'pt_BR')) AS 'Valor',
            DATE_FORMAT(t.data_transacao, '%d/%m/%Y %H:%i:%s') AS 'Data/Hora',
            CONCAT('R$ ', FORMAT(t.saldo_anterior, 2, 'pt_BR')) AS 'Saldo Anterior',
            CONCAT('R$ ', FORMAT(t.saldo_posterior, 2, 'pt_BR')) AS 'Saldo Posterior'
        FROM transacoes t
        WHERE t.conta_id = v_conta_id
          AND DATE(t.data_transacao) BETWEEN p_data_inicio AND p_data_fim
        ORDER BY t.data_transacao DESC
        LIMIT 10;
        
    END IF;
    
END //

DELIMITER ;

-- Exemplo de uso da procedure
CALL sp_extrato_conta('12345-6', '2025-10-01', '2025-11-03');