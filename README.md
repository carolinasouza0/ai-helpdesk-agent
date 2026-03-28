# 🤖 AI Helpdesk Copilot

Um agente autônomo baseado em IA desenvolvido para atuar como o Nível 1 de um Helpdesk B2B. O sistema analisa chamados de clientes, classifica a urgência, categoriza o problema e gera uma resposta inicial sugerida, otimizando o fluxo de trabalho de suporte humano em uma interface Kanban/Dashboard.

## 🚀 Tecnologias e Arquitetura

Este projeto foi construído focando em escalabilidade, padronização e conteinerização:

- **Inteligência Artificial:** Google Gemini API (`gemini-3-flash-preview`) com Engenharia de Prompt determinística (JSON output).
- **Backend:** Node.js com Express (Isolamento de chaves e regras de negócio).
- **Frontend:** React + Vite.
- **Arquitetura CSS:** SCSS estruturado com a metodologia **ITCSS** (Inverted Triangle CSS) e padrão **BEM** (Block, Element, Modifier) para alta escalabilidade de UI.
- **DevOps/Infra:** Docker e Docker Compose (Orquestração Fullstack).

## ⚙️ Engenharia de Prompt (O Cérebro do Agente)

Para garantir que a IA não sofra "alucinações" e sempre retorne dados consumíveis pelo React, o agente foi configurado com Temperatura 0.1 e o seguinte System Prompt:

> Você é um Agente Autônomo de Triagem B2B Nível 1. Sua função exclusiva é analisar mensagens de suporte, categorizá-las e preparar a base para o atendimento humano.
> Preciso, analítico, corporativo e estritamente focado em suporte técnico.
> Regras de Negócio:
> 1. Analise o sentimento e o impacto no negócio para definir a "urgencia" ("BAIXA", "MEDIA", "ALTA", "CRITICA").
> 2. Classifique a "categoria" (escolha apenas entre: "Financeiro", "Dúvida Comercial", "Bug/Falha", "Acesso", "Outros").
> 3. Gere um "resumo_problema" em no máximo 15 palavras.
> 4. Escreva uma "resposta_sugerida" cordial.
> Regra de Saída Obrigatória: Responda ÚNICA e EXCLUSIVAMENTE com um objeto JSON válido. Use as chaves: "urgencia", "categoria", "resumo_problema", "resposta_sugerida".

## 🛠️ Como rodar o projeto localmente

### Pré-requisitos
- [Docker](https://www.docker.com/) instalado e rodando.
- Uma chave de API válida do [Google AI Studio](https://aistudio.google.com/).

### Passo a Passo

1. **Clone o repositório:**
   \`\`\`bash
   git clone https://github.com/carolinasouza0/ai-helpdesk-agent.git
   cd ai-helpdesk-agent
   \`\`\`

2. **Configure suas credenciais:**
   Navegue até a pasta `backend` e crie um arquivo `.env` (este arquivo é ignorado pelo git por segurança):
   \`\`\`env
   GEMINI_API_KEY=sua_chave_do_google_ai_aqui
   PORT=3000
   \`\`\`

3. **Suba a infraestrutura com Docker:**
   Volte para a raiz do projeto e execute:
   \`\`\`bash
   docker-compose up -d --build
   \`\`\`

4. **Acesse a Aplicação:**
   - Frontend (Portal do Cliente e Dashboard): Acesse `http://localhost:5173`
   - Backend (API): Rodando em `http://localhost:3000`

## 🛡️ Segurança (DevSecOps)

O projeto conta com um script isolado `security-agent.js` no backend que utiliza a própria IA do Gemini para escanear o código em busca de chaves de API "hardcoded" antes de commits, garantindo que credenciais sensíveis não vazem no repositório.