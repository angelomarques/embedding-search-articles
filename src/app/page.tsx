import { Chat } from "../components/Chat";

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Article Knowledge Base Chat
      </h1>
      <Chat />
    </main>
  );
}
