'use client';

import { useState, useEffect, useRef } from 'react';
import { FeedbackForm } from '@/components/FeedbackForm';
import { AudioSettings } from '@/components/AudioSettings';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [audioMode, setAudioMode] = useState(false);
  const [voice, setVoice] = useState('alloy');
  const [model, setModel] = useState('tts-1');
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Genereer een nieuwe sessie bij het laden van de pagina
    fetch('/api/chat')
      .then(res => res.json())
      .then(data => setSessionId(data.sessionId))
      .catch(console.error);
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          sessionId
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      // Если включен аудио режим, генерируем аудио
      if (audioMode) {
        setIsGeneratingAudio(true);
        try {
          const audioResponse = await fetch('/api/tts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: data.response,
              voice,
              model
            }),
          });

          if (audioResponse.ok) {
            const audioBlob = await audioResponse.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            assistantMessage.audioUrl = audioUrl;
            
            // Автоматически воспроизводим аудио
            const audio = new Audio(audioUrl);
            audio.play().catch(console.error);
          }
        } catch (error) {
          console.error('Error generating audio:', error);
        } finally {
          setIsGeneratingAudio(false);
        }
      }

      setMessages(prev => [...prev, assistantMessage]);
      setSessionId(data.sessionId);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, er is iets misgegaan. Probeer het opnieuw.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndChat = () => {
    setShowFeedback(true);
  };

  const handleFeedbackSubmitted = () => {
    setShowFeedback(false);
    setMessages([]);
    setSessionId(null);
    // Genereer een nieuwe sessie
    fetch('/api/chat')
      .then(res => res.json())
      .then(data => setSessionId(data.sessionId))
      .catch(console.error);
  };

  if (showFeedback) {
    return (
      <FeedbackForm 
        sessionId={sessionId} 
        onSubmitted={handleFeedbackSubmitted}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-4xl h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Roz</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Je vriendelijke gesprekspartner
              </p>
            </div>
            <div className="flex items-center space-x-2">
               {/* Audio Mode Toggle */}
               <button
                 onClick={() => setAudioMode(!audioMode)}
                 className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                   audioMode
                     ? 'bg-green-600 text-white hover:bg-green-700'
                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                 }`}
               >
                 🔊 Audio {audioMode ? 'AAN' : 'UIT'}
               </button>
               
               {/* Audio Settings */}
               {audioMode && (
                 <button
                   onClick={() => setShowAudioSettings(true)}
                   className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 text-sm transition-colors"
                 >
                   ⚙️ Instellingen
                 </button>
               )}
               
               {/* Logout Button */}
               <button
                 onClick={() => {
                   document.cookie = 'chat_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                   window.location.href = '/login';
                 }}
                 className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 text-sm transition-colors"
                 title="Uitloggen"
               >
                 🚪 Uitloggen
               </button>
               
               {messages.length > 0 && (
                 <button
                   onClick={handleEndChat}
                   className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                 >
                   Gesprek beëindigen
                 </button>
               )}
             </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm max-w-md mx-auto">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  Hallo! Ik ben Roz 👋
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Ik ben hier om naar je te luisteren en je te helpen. 
                  Vertel me wat er op je hart ligt.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                   className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                     message.role === 'user'
                       ? 'bg-indigo-600 text-white'
                       : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm'
                   }`}
                 >
                   <p className="whitespace-pre-wrap">{message.content}</p>
                   
                   {/* Audio Player voor assistant berichten */}
                   {message.role === 'assistant' && message.audioUrl && (
                     <div className="mt-2">
                       <audio 
                         controls 
                         className="w-full h-8"
                         style={{ maxWidth: '100%' }}
                       >
                         <source src={message.audioUrl} type="audio/mpeg" />
                         Je browser ondersteunt geen audio.
                       </audio>
                     </div>
                   )}
                   
                   <p
                     className={`text-xs mt-1 ${
                       message.role === 'user'
                         ? 'text-indigo-200'
                         : 'text-gray-500 dark:text-gray-400'
                     }`}
                   >
                     {message.timestamp.toLocaleTimeString('nl-NL', {
                       hour: '2-digit',
                       minute: '2-digit'
                     })}
                   </p>
                 </div>
              </div>
            ))
          )}
          {(isLoading || isGeneratingAudio) && (
             <div className="flex justify-start">
               <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-sm">
                 <div className="flex items-center space-x-2">
                   <div className="flex space-x-1">
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                   </div>
                   {isGeneratingAudio && (
                     <span className="text-xs text-gray-500 dark:text-gray-400">
                       🔊 Audio genereren...
                     </span>
                   )}
                 </div>
               </div>
             </div>
           )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={sendMessage} className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Typ je bericht..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Verstuur
            </button>
          </form>
        </div>
         
         {/* Audio Settings Modal */}
         <AudioSettings
           voice={voice}
           model={model}
           onVoiceChange={setVoice}
           onModelChange={setModel}
           isOpen={showAudioSettings}
           onClose={() => setShowAudioSettings(false)}
         />
       </div>
     </div>
   );
 }
