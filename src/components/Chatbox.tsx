import { useState, useRef, useEffect } from "react"
import { Icon } from "./Shared"

interface Message {
  id: string
  sender: 'user' | 'assistant'
  text: string
}

const STARTER_QUESTIONS = [
  "Kể tôi nghe về công trình này",
  "Công trình này có lịch sử như thế nào?",
  "Kiến trúc có gì đặc biệt?",
  "Sản phẩm này được làm từ gì?",
  "Tìm sản phẩm phù hợp cho tôi"
]

export default function Chatbox() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text }
    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      if (!supabaseUrl) {
        setIsTyping(false);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: "Xin lỗi, trợ lý AI hiện chưa được cấu hình. Vui lòng thử lại sau."
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(anonKey ? { 'Authorization': `Bearer ${anonKey}` } : {})
        },
        body: JSON.stringify({ 
          message: text,
          history: messages 
        })
      });

      if (!response.ok) {
        setIsTyping(false);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: "Xin lỗi, hiện tại trợ lý AI chưa thể phản hồi. Bạn vui lòng thử lại sau."
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      const data = await response.json();
      
      setIsTyping(false);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data?.reply || "Xin lỗi, hiện tại trợ lý AI chưa thể phản hồi. Bạn vui lòng thử lại sau."
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      setIsTyping(false);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: "Xin lỗi, hiện tại trợ lý AI chưa thể phản hồi. Bạn vui lòng thử lại sau."
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(inputValue)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 999,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#8F0019',
          color: '#FFEBD1',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s',
        }}
        aria-label="Mở Trợ lý Kiến Tích Việt"
      >
        <Icon name="sparkle" size={28} />
      </button>

      {isOpen && (
        <div 
          className="chat-panel-container"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            width: 'calc(100vw - 40px)',
            maxWidth: '400px',
            height: '600px',
            maxHeight: 'calc(100vh - 40px)',
            background: '#FFF',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: '"Alegreya Sans", sans-serif',
          }}
        >
          {/* Header */}
          <div style={{
            background: '#8F0019',
            color: '#FFEBD1',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Icon name="sparkle" size={24} />
              <h3 style={{ margin: 0, fontFamily: '"Vollkorn", serif', fontSize: '20px' }}>Trợ lý Kiến Tích Việt</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FFEBD1',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Đóng chat"
            >
              <Icon name="close" size={24} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: '#f9f9f9',
          }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: '40px', color: '#666' }}>
                <div style={{ opacity: 0.3, marginBottom: '20px' }}>
                  <Icon name="sparkle" size={48} />
                </div>
                <p style={{ marginBottom: '20px' }}>Xin chào! Tôi có thể giúp gì cho bạn hôm nay?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {STARTER_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      style={{
                        padding: '10px 16px',
                        background: '#FFEBD1',
                        color: '#8F0019',
                        border: '1px solid rgba(143, 0, 25, 0.1)',
                        borderRadius: '20px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: '"Alegreya Sans", sans-serif',
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((m) => (
                  <div key={m.id} style={{
                    alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    background: m.sender === 'user' ? '#8F0019' : '#fff',
                    color: m.sender === 'user' ? '#FFEBD1' : '#333',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    borderBottomRightRadius: m.sender === 'user' ? '4px' : '12px',
                    borderBottomLeftRadius: m.sender === 'assistant' ? '4px' : '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    {m.text}
                  </div>
                ))}
                {isTyping && (
                  <div style={{
                    alignSelf: 'flex-start',
                    background: '#fff',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    borderBottomLeftRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center'
                  }}>
                    <span style={{ width: '8px', height: '8px', background: '#ccc', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
                    <span style={{ width: '8px', height: '8px', background: '#ccc', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.2s' }} />
                    <span style={{ width: '8px', height: '8px', background: '#ccc', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.4s' }} />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div style={{
            padding: '16px',
            background: '#fff',
            borderTop: '1px solid #eee',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-end',
          }}>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi của bạn..."
              maxLength={1000}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: '24px',
                resize: 'none',
                height: '48px',
                maxHeight: '120px',
                fontFamily: '"Alegreya Sans", sans-serif',
                fontSize: '15px',
                outline: 'none',
                lineHeight: '22px'
              }}
              rows={1}
            />
            <button
              onClick={() => handleSend(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: inputValue.trim() && !isTyping ? '#FFD18D' : '#f0f0f0',
                color: inputValue.trim() && !isTyping ? '#8F0019' : '#ccc',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputValue.trim() && !isTyping ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                flexShrink: 0
              }}
              aria-label="Gửi tin nhắn"
            >
              <Icon name="arrow" size={24} />
            </button>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @media (max-width: 480px) {
          .chat-panel-container {
            bottom: 0 !important;
            right: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100% !important;
            max-height: 100% !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </>
  )
}