import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemInstruction = `
Você é um Agente DevSecOps Sênior. Sua função é analisar trechos de código e impedir o vazamento de segredos.
Regra de Negócio: Escaneie o texto em busca de padrões de chaves de API (ex: strings longas começando com "AIza", "sk-", etc.) que estejam "hardcoded" (chumbadas diretamente no código).
Regra de Saída Obrigatória: Responda ÚNICA e EXCLUSIVAMENTE com um JSON válido. 
Use as chaves: "vazamento_detectado" (true/false), "linha_suspeita" (trecho do código ou null), "recomendacao_correcao".
`;

async function scanCode() {
    try {
        console.log("🕵️ Iniciando varredura de segurança...");
        
        const fileContent = fs.readFileSync('./server.js', 'utf8');

        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview", 
            systemInstruction: systemInstruction,
            generationConfig: {
                temperature: 0.0,
                responseMimeType: "application/json",
            }
        });

        const result = await model.generateContent(`Analise este código:\n\n${fileContent}`);
        const relatorio = JSON.parse(result.response.text());

        if (relatorio.vazamento_detectado) {
            console.error("🚨 ALERTA CRÍTICO: Possível vazamento detectado!");
            console.error(`Trecho suspeito: ${relatorio.linha_suspeita}`);
            console.error(`Recomendação: ${relatorio.recomendacao_correcao}`);
        } else {
            console.log("✅ Código limpo! Nenhum segredo exposto encontrado.");
        }

    } catch (error) {
        console.error("Erro ao executar o agente de segurança:", error);
    }
}

scanCode();