"use client";

import { useState } from "react";
import { ChatBot } from "embidly";
import "embidly/style.css";
import myBusinessContext from "../data/embidlyContext";

/**
 * EmbidlyChat - WhatsApp-style floating AI assistant
 * Just drop this component into your page (e.g. App.tsx, page.tsx, or layout.tsx)
 */
export default function EmbidlyChat() {
  const [isOpen, setIsOpen] = useState(false);

  const apiKey =
    (typeof process !== "undefined"
      ? process.env?.NEXT_PUBLIC_MISTRAL_API_KEY ||
        process.env?.NEXT_PUBLIC_GEMINI_API_KEY ||
        process.env?.NEXT_PUBLIC_OPENAI_API_KEY
      : undefined) ||
    import.meta.env.VITE_MISTRAL_API_KEY ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.VITE_OPENAI_API_KEY ||
    "";

  return (
    <ChatBot
      apiKey={apiKey}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      context={myBusinessContext}

      // Branding & Customization:
      // logo="/logo.png" // Pass your company logo URL/path (shown in both float button & header)
      title="Support AI"
      subtitle="Online & ready to help"
      greeting="Hello! Welcome to our website. How can I assist you today?"
      placeholder="Ask anything..."
      position="bottom-right"
      suggestions={[
        "What services do you offer?",
        "How can I contact support?",
        "Tell me more about your company",
      ]}
    />
  );
}
