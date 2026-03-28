import { useState } from 'react';
import './styles/main.scss';

function App() {
  // Estado para controlar qual tela estamos vendo
  const [view, setView] = useState('client'); // 'client' ou 'agent'
  
  // Memória da nossa aplicação (Lista de Tickets)
  const [tickets, setTickets] = useState([]);
  
  // Estados do formulário
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Normalizador para as classes BEM (ex: "CRÍTICA" -> "critica")
  const getBemModifier = (urgency) => {
    if (!urgency) return 'baixa';
    return urgency.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const handleTriage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error('Erro na API');

      const data = await response.json();
      
      // Adicionamos o novo ticket processado pela IA na nossa lista
      const newTicket = {
        id: Date.now(),
        originalMessage: message,
        ...data
      };

      setTickets([newTicket, ...tickets]);
      setMessage('');
      alert("Ticket enviado e triado com sucesso!");
      
    } catch (err) {
      alert("Erro ao conectar com o Agente IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="o-layout">
      {/* SIDEBAR - Navegação */}
      <aside className="o-layout__sidebar">
        <h2 style={{ marginBottom: '2rem' }}>🤖 AI Copilot</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            className="c-button" 
            style={{ backgroundColor: view === 'client' ? '#4318ff' : '#a3aed1' }}
            onClick={() => setView('client')}
          >
            Portal do Cliente
          </button>
          <button 
            className="c-button" 
            style={{ backgroundColor: view === 'agent' ? '#4318ff' : '#a3aed1' }}
            onClick={() => setView('agent')}
          >
            Painel do Atendente ({tickets.length})
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="o-layout__main">
        
        {/* VIEW 1: Portal do Cliente */}
        {view === 'client' && (
          <div>
            <h1 style={{ marginBottom: '1rem' }}>Abertura de Chamado</h1>
            <form className="c-form" onSubmit={handleTriage}>
              <p style={{ marginBottom: '1rem', color: '#a3aed1' }}>
                Descreva o seu problema detalhadamente. Nossa IA fará a triagem automática.
              </p>
              <textarea 
                className="c-form__input"
                rows="6" 
                placeholder="Ex: Não consigo acessar a área financeira, o botão sumiu..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <button className="c-button" type="submit" disabled={loading}>
                {loading ? 'Processando com Gemini...' : 'Enviar Chamado'}
              </button>
            </form>
          </div>
        )}

        {/* VIEW 2: Painel do Atendente (Dashboard) */}
        {view === 'agent' && (
          <div>
            <h1 style={{ marginBottom: '2rem' }}>Fila de Atendimento</h1>
            
            {tickets.length === 0 ? (
              <p>Nenhum ticket na fila. A IA está descansando! ☕</p>
            ) : (
              tickets.map((ticket) => {
                const modifier = getBemModifier(ticket.urgencia);
                return (
                  <article key={ticket.id} className={`c-ticket c-ticket--${modifier}`}>
                    <div className="c-ticket__header">
                      <span className={`c-ticket__badge c-ticket__badge--${modifier}`}>
                        {ticket.urgencia}
                      </span>
                      <span><strong>Categoria:</strong> {ticket.categoria}</span>
                    </div>
                    
                    <h3 style={{ marginBottom: '0.5rem' }}>{ticket.resumo_problema}</h3>
                    <p style={{ color: '#a3aed1', fontSize: '0.9rem' }}>
                      <strong>Mensagem Original:</strong> "{ticket.originalMessage}"
                    </p>

                    <div className="c-ticket__suggestion">
                      <strong>💡 Sugestão da IA para resposta:</strong>
                      <p style={{ marginTop: '0.5rem' }}>{ticket.resposta_sugerida}</p>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        )}

      </main>
    </div>
  );
}

export default App;