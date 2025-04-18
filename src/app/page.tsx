import { Header } from "@/components/header";
import { Chat } from "../components/Chat";

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <Header />
        <Chat />
      </div>
    </main>
  );
}
