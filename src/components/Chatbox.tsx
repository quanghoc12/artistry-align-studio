import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { Icon } from "./Shared"
import { supabase } from "../integrations/supabase/client"

interface Message {
  id: string
  sender: 'user' | 'assistant'
  text: string
}

const STARTER_QUESTIONS = [
  "Sản phẩm này có gì đặc biệt?",
  "Sản phẩm này phù hợp với ai?",
  "Có những sản phẩm nào khác?",
  "Chuyện di sản của sản phẩm này là gì?",
  "Tôi có thể khám phá AR như thế nào?"
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
    if (!text.trim() || isTyping) return

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text }
    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const history = [...messages, userMessage].map(({ sender, text }) => ({ sender, text }))
      const { data, error } = await supabase.functions.invoke("heritage-chat", { body: { messages: history } })
      let reply = data?.reply as string | undefined
      if (!reply) {
        let msg = data?.error as string | undefined
        if (!msg && error && "context" in error) {
          try { msg = (await (error as { context: Response }).context.json()).error } catch { /* ignore */ }
        }
        reply = msg || "Trợ lý tạm thời không phản hồi. Vui lòng thử lại."
      }
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'assistant', text: reply! }])
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'assistant', text: "Không kết nối được trợ lý. Vui lòng thử lại." }])
    } finally {
      setIsTyping(false)
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
                  <div key={m.id} className={m.sender === 'assistant' ? 'markdown-body' : ''} style={{
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
                    whiteSpace: m.sender === 'user' ? 'pre-wrap' : 'normal',
                    overflowWrap: 'break-word',
                  }}>
                    {m.sender === 'assistant' ? (
                      <ReactMarkdown>{m.text}</ReactMarkdown>
                    ) : (
                      m.text
                    )}
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
        .markdown-body {
          font-size: 15px;
        }
        .markdown-body p {
          margin: 0 0 8px 0;
        }
        .markdown-body p:last-child {
          margin-bottom: 0;
        }
        .markdown-body strong {
          font-weight: 600;
          color: #8F0019;
        }
        .markdown-body ul, .markdown-body ol {
          margin: 0 0 8px 0;
          padding-left: 20px;
        }
        .markdown-body ul:last-child, .markdown-body ol:last-child {
          margin-bottom: 0;
        }
        .markdown-body li {
          margin-bottom: 4px;
        }
        .markdown-body a {
          color: #8F0019;
          text-decoration: underline;
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