import { useState } from "react";
import { ChatBot } from "embidly";
import myBusinessContext from "../data/embidlyContext";

/**
 * EmbidlyChat - WhatsApp-style floating AI assistant
 * Just drop this component into your page (e.g. App.tsx or layout.tsx)
 */
export default function EmbidlyChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ChatBot
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      context={myBusinessContext}
      title="Support AI"
      subtitle="Online & ready to help"
      position="bottom-right"
      suggestions={[
        "What services do you offer?",
        "How can I contact support?",
        "Tell me more about your company",
      ]}
    />
  );
}
