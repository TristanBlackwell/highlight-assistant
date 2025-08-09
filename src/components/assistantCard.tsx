import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { InputWithSubmit } from "./ui/input";

interface AssistantCardProps {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
}

export default function AssistantCard({
  open,
  handleOpenChange,
}: Readonly<AssistantCardProps>) {
  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          key="assistant-card"
          id="assistant-card"
          className="absolute top-6 right-6 origin-[var(--transform-origin)] rounded-lg bg-[canvas] px-6 py-4 text-gray-900 shadow-lg shadow-gray-200 outline outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300"
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
          <div className="mt-3">
            <InputWithSubmit
              placeholder="What is..."
              className="h-8 p-1"
              onButtonSubmit={(input) => console.log("Input: ", input)}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
