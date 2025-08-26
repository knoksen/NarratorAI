import { NarratorClientPage } from "@/components/narrator-ai/narrator-client-page";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100svh-56px)] flex-col items-center py-10 md:py-16">
      <div className="z-10 w-full max-w-3xl items-center justify-between text-center mb-8" id="steps">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
          NarratorAI
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-muted-foreground">
          Transform your documents into engaging audio narratives in three easy steps.
        </p>
      </div>
      <NarratorClientPage />
    </main>
  );
}
