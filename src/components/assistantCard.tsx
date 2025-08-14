import { openai } from "@ai-sdk/openai";
import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { InputWithSubmit } from "./ui/input";

const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  role: z.literal(["assistant", "user"]),
  dateCreated: z.date(),
});
type Message = z.infer<typeof messageSchema>;

type LocalMessage = Message & { isPending?: boolean };

const assistantRequestSchema = z.object({
  messages: messageSchema.array(),
  highlight: z.string().min(1),
});

const getAssistantResponse = createServerFn({ method: "POST" })
  .validator(assistantRequestSchema)
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: openai("gpt-5-mini"),
      messages: [
        {
          role: "system",
          content: `
              You are an assistant designed to help a human reader in their comprehension of text's they are reading. 
              You should write simple, clear, and concise answers to their questions.
              
              The user is reading an excerpt from David Deutsch's 'The Beginning of Infinity', specifically chapter 9 'A Window on Infinity'. 
              The 'highlight' below is the section of text they are specifically asking about.
              
              Highlight: ${data.highlight}
            `,
        },
        ...data.messages,
      ],
    });

    return { role: "assistant", content: text, dateCreated: new Date() };
  });

const testMessages = [
  {
    id: crypto.randomUUID(),
    role: "user" as const,
    content: "Explain this",
    dateCreated: new Date(),
  },
  {
    id: crypto.randomUUID(),
    role: "assistant" as const,
    content: `Short version: finitism is the view that only finite mathematical things truly exist. Finitists accept individual finite objects (like the number 7, or the set {1,2,3}) but deny the existence of completed infinite objects (like the set of all natural numbers or the set of all real numbers).

Key points and contrasts
- Actual vs potential infinity: finitists typically allow potential infinity (you can always count one more) but deny actual or completed infinity (there is no completed infinite set N = {0,1,2,...}).  
- Against Platonism: unlike mathematical Platonism (which says infinite sets are real abstract objects), finitism says such infinite wholes do not exist.  
- Variants: ultrafinitism is a stronger form that even doubts the meaningfulness or existence of extremely large finite numbers; Hilbert-style finitism is a milder, proof-theoretic restriction used to justify parts of mathematics.  
- Relation to other philosophies: intuitionism and constructive mathematics share some skepticism about classical infinities, but they are distinct positions with different technical commitments.

Consequences and examples
- A finitist would reject statements that assert existence of infinite sets as completed entities, and would need to reformulate analysis and set theory in purely finitary terms.  
- Many everyday finite mathematical operations are uncontroversial to finitists (addition, finite sets, finite proofs). What’s denied is the metaphysical existence of infinite collections like the continuum or the set of all naturals.

Why people hold it
- Some find it philosophically safer (avoids mysterious actual infinities) or closer to physical reality.  
- Critics argue that standard mathematics and its powerful results rely heavily on infinite concepts that work extremely well, so denying them is costly.

That’s the doctrine in a nutshell.`,
    dateCreated: new Date(),
  },
];

interface AssistantCardProps {
  highlight: string;
  open: boolean;
  handleOpenChange: (open: boolean) => void;
}

export default function AssistantCard({
  highlight,
  open,
  handleOpenChange,
}: Readonly<AssistantCardProps>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const [awaitingResponse, setAwaitingResponse] = useState(false);

  const [chatHistory, setChatHistory] = useState<LocalMessage[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (awaitingResponse) {
      return;
    }

    try {
      setAwaitingResponse(true);
      if (!inputRef.current) {
        throw new Error("Unable to determine input value");
      }
      const chatHistoryWithInput: Message[] = [
        ...chatHistory,
        {
          id: crypto.randomUUID(),
          role: "user",
          content: inputRef.current.value,
          dateCreated: new Date(),
        },
      ];
      setChatHistory(chatHistoryWithInput);
      inputRef.current.value = "";

      const pendingId = crypto.randomUUID();
      const pendingMessage: LocalMessage = {
        id: pendingId,
        role: "assistant",
        content: "",
        dateCreated: new Date(),
        isPending: true,
      };
      setTimeout(() => {
        setChatHistory((prev) => [...prev, pendingMessage]);
      }, 500);

      const assistantResponseRaw = await getAssistantResponse({
        data: { messages: chatHistoryWithInput, highlight },
      });
      const assistantResponse: LocalMessage = {
        ...assistantResponseRaw,
        id: pendingId,
      };

      setChatHistory((prev) =>
        prev.map((msg) => (msg.id === pendingId ? assistantResponse : msg))
      );
    } finally {
      setAwaitingResponse(false);
    }
  };

  useEffect(() => {
    if (messagesRef.current && chatHistory.length) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          key="assistant-card"
          id="assistant-card"
          className="fixed top-6 right-6 origin-[var(--transform-origin)] rounded-lg bg-[canvas] max-w-md h-2/3 px-4 py-4 flex flex-col text-gray-900 shadow-lg shadow-gray-200 outline outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300 overflow-hidden"
          initial={{ opacity: 0, originX: 1, originY: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.3, ease: "easeInOut" },
          }}
        >
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Assistant</h4>
              <Button
                type="button"
                variant="ghost"
                className="px-1 py-0 rounded-sm"
                onClick={() => handleOpenChange(false)}
              >
                X
              </Button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Ask a question about the highlighted text.
            </p>
            <div
              ref={messagesRef}
              className="my-3 flex min-h-0 flex-1 flex-col overflow-y-auto gap-2 text-sm"
            >
              <AnimatePresence initial={false}>
                {chatHistory.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "px-2 py-1 rounded-md whitespace-pre-wrap flex flex-col",
                      msg.role === "user"
                        ? "self-end bg-emerald-500 text-white"
                        : "self-start bg-gray-100 text-black"
                    )}
                  >
                    {msg.isPending ? (
                      <div className="flex flex-row gap-2 p-2">
                        <div className="size-2 rounded-full bg-gray-300 animate-bounce" />
                        <div className="size-2 rounded-full bg-gray-300 animate-bounce [animation-delay:-.3s]" />
                        <div className="size-2 rounded-full bg-gray-300 animate-bounce [animation-delay:-.5s]" />
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                    {!msg.isPending && (
                      <p className="self-end mt-1 text-xs">
                        {msg.dateCreated.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div>
              <InputWithSubmit
                ref={inputRef}
                name="prompt"
                placeholder="What is..."
                className="h-8 p-1"
              />
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
