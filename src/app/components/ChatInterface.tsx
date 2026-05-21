"use client"; // Nécessaire car on utilise des hooks et des événements

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import ReactMarkdown from "react-markdown"; // Pour afficher le markdown des réponses

export default function ChatInterface() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas à chaque nouveau message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Ajouter le message de l'utilisateur à l'état local
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      setError("");
      // Envoyer l'historique complet au serveur
      const response = await fetch("/api/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: {}, // Pour des fonctionnalités futures
          history: [...messages, userMessage], // On envoie tout l'historique
        }),
      });

      const data = await response.json().catch(() => ({} as { reply?: string; error?: string; message?: string }));

      if (response.ok) {
        const assistantMessage = { role: "assistant", content: data.reply || "Je n'ai pas pu générer de réponse." };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorText = data.error || data.message || "Une erreur est survenue. Veuillez réessayer.";
        console.error("Recommendation API response error:", errorText);
        setError(errorText);
        const errorMessage = {
          role: "assistant",
          content: `❌ ${errorText}`,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Network error:", error);
      const messageText = "Impossible de contacter le serveur. Vérifie ta connexion.";
      setError(messageText);
      const errorMessage = {
        role: "assistant",
        content: `❌ ${messageText}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-[720px] min-h-[680px] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 shadow-xl">
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-violet-600 p-6 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-sky-100">Assistant de Voyage</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Discute avec l’IA et obtiens une destination sur-mesure
            </h2>
          </div>
          <div className="rounded-3xl bg-white/10 px-4 py-3 text-sm text-white/90">
            Enter = envoyer • Shift+Enter = nouvelle ligne
          </div>
        </div>
      </div>

      {/* Zone des messages */}
      {error && (
        <div className="mx-5 mb-4 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm sm:mx-6">
          <strong className="font-semibold">Erreur :</strong> {error}
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-5 bg-white">
        {messages.length === 0 && (
          <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-600 shadow-sm">
            <p className="text-3xl">👋</p>
            <p className="text-lg font-semibold text-slate-900">Bonjour ! Je suis ton assistant WanderWise.</p>
            <p className="max-w-sm text-sm leading-6">
              Parle-moi de ton voyage idéal, de ton budget ou de tes envies, et je te proposerai une destination adaptée.
            </p>
            <p className="text-xs text-slate-400">Utilise le champ ci-dessous pour poser ta première question.</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {/* Rendu Markdown pour les messages de l'assistant */}
              {msg.role === "assistant" ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <span>🤔 L'assistant réfléchit...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <div className="border-t border-slate-200 bg-slate-50 p-5">
        <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
          <label htmlFor="chat-input" className="text-sm font-medium text-slate-700">
            Pose ta question
          </label>
          <textarea
            id="chat-input"
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ex : Je veux un voyage en Europe en octobre avec un budget de 1500 €..."
            className="min-h-[96px] w-full resize-none rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            disabled={isLoading}
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">Tu peux utiliser Shift+Entrée pour aller à la ligne.</p>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="inline-flex h-12 items-center justify-center rounded-3xl bg-sky-600 px-6 text-sm font-semibold text-white shadow-lg transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Envoi..." : "Envoyer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}