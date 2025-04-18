"use client";

import { Chat } from "../components/Chat";
import { Button } from "../components/ui/button";

export default function Home() {
  const handleSeed = async () => {
    try {
      const response = await fetch("/api/seed", {
        method: "POST",
      });
      const data = await response.json();
      if (response.ok) {
        alert("Database seeded successfully!");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Seed error:", error);
      alert("Failed to seed database. Please try again.");
    }
  };

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Article Knowledge Base Chat</h1>
          <Button onClick={handleSeed} variant="outline">
            Seed Database
          </Button>
        </div>
        <Chat />
      </div>
    </main>
  );
}
