import React from 'react'
import { Send, User, Bot } from 'lucide-react'
import axios from 'axios'
import { useChatStore } from '@/store/useChatStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export const ChatInterface: React.FC = () => {
    const { messages, isLoading, addMessage, setLoading } = useChatStore()
    const [input, setInput] = React.useState('')
    const scrollRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isLoading])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput('')
        addMessage({ role: 'user', content: userMessage })
        setLoading(true)

        try {
            const response = await axios.post('http://localhost:8000/api/v1/chat/chat', { message: userMessage })
            addMessage({
                role: 'assistant',
                content: response.data.answer,
                sources: response.data.sources
            })
        } catch (err: any) {
            addMessage({
                role: 'assistant',
                content: 'Sorry, I encountered an error processing your request.'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="flex flex-col h-[600px] bg-slate-50">
            <div className="p-4 border-b bg-white rounded-t-lg">
                <h3 className="font-semibold">Chat with Document</h3>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <Bot className="w-12 h-12 mb-2" />
                        <p>Ready for your questions!</p>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex gap-3 max-w-[80%]",
                            msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}
                    >
                        <div className={cn(
                            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                            msg.role === 'user' ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                        )}>
                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={cn(
                            "p-3 rounded-lg text-sm",
                            msg.role === 'user' ? "bg-blue-600 text-white" : "bg-white border text-slate-900"
                        )}>
                            {msg.content}
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-2 pt-2 border-t text-[10px] opacity-70">
                                    Sources: {msg.sources.join(', ')}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-slate-600" />
                        </div>
                        <div className="p-3 rounded-lg bg-white border">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-white border-t rounded-b-lg">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-2"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </Card>
    )
}
