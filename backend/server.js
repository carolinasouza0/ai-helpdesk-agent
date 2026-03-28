import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Inicializa o SDK do Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System Prompt validado
const systemInstruction = `
Você é um Agente Autônomo de Triagem B2B Nível 1. Sua função exclusiva é analisar mensagens de suporte, categorizá-las e preparar a base para o atendimento humano.
Preciso, analítico, corporativo e estritamente focado em suporte técnico.
Regras de Negócio:
1. Analise o sentimento e o impacto no negócio para definir a "urgencia" ("BAIXA", "MEDIA", "ALTA", "CRITICA").
2. Classifique a "categoria" (escolha apenas entre: "Financeiro", "Dúvida Comercial", "Bug/Falha", "Acesso", "Outros").
3. Gere um "resumo_problema" em no máximo 15 palavras.
4. Escreva uma "resposta_sugerida" cordial, confirmando o recebimento e o nível de prioridade.
Regra de Saída Obrigatória: Responda ÚNICA e EXCLUSIVAMENTE com um objeto JSON válido. Use as chaves: "urgencia", "categoria", "resumo_problema", "resposta_sugerida".
`;

app.post('/api/triage', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "A mensagem do cliente é obrigatória." });
        }

        // Configuração do modelo focada em JSON e baixa temperatura
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            systemInstruction: systemInstruction,
            generationConfig: {
                temperature: 0.1,
                responseMimeType: "application/json",
            }
        });

        const result = await model.generateContent(message);
        const responseText = result.response.text();
        
        // Retorna o JSON gerado pela IA para o frontend
        res.json(JSON.parse(responseText));

    } catch (error) {
        console.error("Erro no Agente de Triagem:", error);
        res.status(500).json({ error: "Erro interno ao processar a mensagem." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor do Agente IA rodando na porta ${PORT}`);
});