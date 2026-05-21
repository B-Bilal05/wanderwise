import ChatInterface from "@/app/components/ChatInterface";

export default function ChatbotPage() {
  return (
    <main className="min-h-screen bg-slate-100 py-12">
      <div className="mx-auto w-full max-w-6xl px-4">
        <section className="mb-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-700 p-1 shadow-2xl">
          <div className="rounded-[1.75rem] bg-white p-10 sm:p-12">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.32em] text-sky-600">Chatbot AI</p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                  Pose ta question et laisse l’IA t’aider à choisir ta prochaine destination
                </h1>
                <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
                  Décris ton budget, ta saison préférée ou tes envies de voyage, puis envoie ton message directement dans le chat.
                </p>
              </div>
              <div className="rounded-[1.75rem] bg-slate-50 p-6 shadow-inner shadow-slate-200/40">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Accès rapide</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Tape ton message, puis appuie sur <span className="font-semibold">Entrée</span> ou clique sur <span className="font-semibold">Envoyer</span>.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_25px_80px_-35px_rgba(15,23,42,0.35)]">
          <ChatInterface />
        </div>
      </div>
    </main>
  );
}
