'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperPlaneIcon, ChatBubbleIcon, Cross2Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { askAssistant } from '@/ai/flows/assistant-flow';
import { askAssistantVoice } from '@/ai/flows/voice-assistant-flow';
import type { VoiceChatMessage } from '@/lib/types';
import { Mic, MicOff } from 'lucide-react';


interface ChatWidgetProps {
  productContext: any;
  planContext: any;
}

export default function ChatWidget({ productContext, planContext }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<VoiceChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Voice state
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setHasPermission(true))
      .catch(() => {
        setHasPermission(false);
        console.error("Permission to access microphone was denied.");
      });
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      const scrollViewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }, 100);
  };

  const handleSendText = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: VoiceChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    scrollToBottom();

    try {
      const assistantResponse = await askAssistant(newMessages);
      const modelMessage: VoiceChatMessage = { role: 'model', content: assistantResponse };
      setMessages([...newMessages, modelMessage]);
    } catch (error) {
      const errorMessage: VoiceChatMessage = {
        role: 'model',
        content: 'Lo siento, he tenido un problema para responder. Por favor, inténtalo de nuevo.',
      };
      setMessages([...newMessages, errorMessage]);
      console.error('Error calling assistant flow:', error);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const startRecording = async () => {
    if (!hasPermission) {
        console.error("Cannot record without microphone permission.");
        return;
    }
    
    setIsRecording(true);
    audioChunksRef.current = [];

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        
        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            handleSendAudio(audioBlob);
            // Stop all media tracks to turn off the microphone indicator
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
    } catch (error) {
        console.error("Error starting recording:", error);
        setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const handleToggleRecording = () => {
      if (isRecording) {
          stopRecording();
      } else {
          startRecording();
      }
  }

  const blobToDataUri = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject('Failed to convert blob to Data URI');
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
  }
  
  const handleSendAudio = async (audioBlob: Blob) => {
    setIsLoading(true);
    // Optimistically add a placeholder for the user's spoken message
    const userMessagePlaceholder: VoiceChatMessage = { role: 'user', content: "..." };
    setMessages(prev => [...prev, userMessagePlaceholder]);
    scrollToBottom();

    try {
      const audioDataUri = await blobToDataUri(audioBlob);
      const { text, audio } = await askAssistantVoice(audioDataUri);
      
      // Replace placeholder with actual transcribed text and add model response
      const updatedUserMessage: VoiceChatMessage = { role: 'user', content: text.userInput };
      const modelMessage: VoiceChatMessage = { role: 'model', content: text.modelResponse, audio: audio };
      
      setMessages(prev => [...prev.slice(0, -1), updatedUserMessage, modelMessage]);

      if (audio) {
        const audioPlayer = new Audio(audio);
        audioPlayer.play();
      }

    } catch (error) {
      const errorMessage: VoiceChatMessage = {
        role: 'model',
        content: 'Lo siento, he tenido un problema para procesar tu audio. Por favor, inténtalo de nuevo.',
      };
      // Replace placeholder with an error message
      setMessages(prev => [...prev.slice(0, -1), errorMessage]); 
      console.error('Error calling voice assistant flow:', error);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  }


  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 1.5,
          }}
        >
          <Button
            size="icon"
            className="w-16 h-16 rounded-full shadow-2xl bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <Cross2Icon className="w-8 h-8" /> : <ChatBubbleIcon className="w-8 h-8" />}
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-28 right-6 z-50"
          >
            <Card className="w-[380px] h-[500px] flex flex-col shadow-2xl">
              <CardHeader>
                <CardTitle>Asistente de Ayuda</CardTitle>
                <CardDescription>¿Tienes dudas? Pregúntame sobre los productos o planes.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col p-0">
                <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary text-primary-foreground">IA</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p>{msg.content}</p>
                           {msg.role === 'model' && msg.audio && (
                               <audio controls src={msg.audio} className="w-full mt-2 h-8" />
                           )}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                       <div className="flex items-start gap-3">
                         <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary text-primary-foreground">IA</AvatarFallback>
                          </Avatar>
                         <div className="bg-muted px-4 py-3 rounded-xl">
                            <div className="flex items-center gap-1">
                                <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse" style={{animationDelay: '0ms'}}></span>
                                <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse" style={{animationDelay: '200ms'}}></span>
                                <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse" style={{animationDelay: '400ms'}}></span>
                            </div>
                         </div>
                       </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t flex items-center gap-2">
                  <Textarea
                    placeholder="Escribe tu pregunta aquí..."
                    className="flex-grow resize-none"
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendText();
                      }
                    }}
                    disabled={isRecording || isLoading}
                  />
                  <Button size="icon" onClick={handleSendText} disabled={isLoading || isRecording || !input.trim()}>
                    <PaperPlaneIcon className="w-5 h-5" />
                  </Button>
                  <Button 
                    size="icon" 
                    onClick={handleToggleRecording} 
                    disabled={isLoading || !hasPermission}
                    variant={isRecording ? 'destructive' : 'outline'}
                    className={isRecording ? 'animate-pulse' : ''}
                  >
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
