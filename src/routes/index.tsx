import { createFileRoute } from "@tanstack/react-router";
import {
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import AssistantCard from "@/components/assistantCard";
import HighlightPopover from "@/components/highlightPopover";
import PencilIcon from "@/components/icons/pencil";
import { Button } from "@/components/ui/button";
import { EXCERPT } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Highlight {
  start: number;
  end: number;
  text: string;
}

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [highlightMode, setHighlightMode] = useState(false);
  const [highlightAnchor, setHighlightAnchor] = useState<{
    getBoundingClientRect: () => DOMRect;
    contextElement: HTMLElement;
  } | null>(null);
  const [assistantCardOpen, setAssistantCardOpen] = useState(false);

  const [highlights, setHighlights] = useState<Highlight[]>([]);

  const textContainerRef = useRef<HTMLParagraphElement>(null);

  // Highlight mode `h` key shortcut listener
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code !== "KeyH") {
        return;
      }

      setHighlightMode(!highlightMode);
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [highlightMode]);

  const getCharOffset = useCallback((root: Node, node, offset: number) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let count = 0;

    while (walker.nextNode()) {
      const current = walker.currentNode;
      if (current === node) {
        return count + offset;
      }
      count += current.textContent?.length ?? 0;
    }
    return count;
  }, []);

  const mergeHighlights = useCallback((ranges) => {
    if (!ranges.length) return [];

    // Sort by start index
    const sorted = [...ranges].sort((a, b) => a.start - b.start);
    const merged = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const last = merged[merged.length - 1];
      const current = sorted[i];

      if (current.start <= last.end) {
        // Merge overlaps or touching ranges
        last.end = Math.max(last.end, current.end);
        last.text = EXCERPT.slice(last.start, last.end);
      } else {
        merged.push(current);
      }
    }

    return merged;
  }, []);

  useEffect(() => {
    const handleHighlightSelection = () => {
      if (!highlightMode) {
        return;
      }

      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setHighlightAnchor(null);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Selection is outside of text container
      if (!textContainerRef.current?.contains(range.commonAncestorContainer)) {
        return;
      }

      const start = getCharOffset(
        textContainerRef.current,
        range.startContainer,
        range.startOffset
      );
      const end = getCharOffset(
        textContainerRef.current,
        range.endContainer,
        range.endOffset
      );

      if (start !== end) {
        const newHighlight = {
          start: Math.min(start, end),
          end: Math.max(start, end),
          text: EXCERPT.slice(Math.min(start, end), Math.max(start, end)),
        };

        setHighlights((prev) => mergeHighlights([...prev, newHighlight]));
      }

      requestAnimationFrame(() => {
        setHighlightAnchor({
          getBoundingClientRect: () => rect,
          contextElement: document.body,
        });
      });
    };

    document.addEventListener("mouseup", handleHighlightSelection);

    return () => {
      document.removeEventListener("mouseup", handleHighlightSelection);
    };
  }, [getCharOffset, highlightMode, mergeHighlights]);

  function renderWithHighlights(text: string, highlights) {
    if (!highlights.length) return text;

    const sorted = [...highlights].sort((a, b) => a.start - b.start);
    const parts: ReactElement[] = [];
    let lastIndex = 0;

    sorted.forEach(({ start, end }, i) => {
      parts.push(
        <span key={`t-${i}-before`}>{text.slice(lastIndex, start)}</span>
      );
      parts.push(
        <span key={`t-${i}-hl`} className="bg-emerald-300 text-emerald-900">
          {text.slice(start, end)}
        </span>
      );
      lastIndex = end;
    });

    parts.push(<span key="t-end">{text.slice(lastIndex)}</span>);
    return parts;
  }

  return (
    <div className="h-screen relative">
      <div id="highlight-button" className="absolute bottom-6 left-6">
        <Button
          type="button"
          title="Highlight mode"
          className={cn("bg-white", highlightMode && "bg-gray-100 scale-95")}
          onClick={() => {
            document.getSelection()?.removeAllRanges();
            setHighlightMode(!highlightMode);
          }}
        >
          <PencilIcon className="size-6" />
        </Button>
      </div>
      <AssistantCard
        open={assistantCardOpen}
        handleOpenChange={(open) => {
          setAssistantCardOpen(open);
        }}
      />
      <div className="max-w-2xl h-full mx-auto p-4 flex flex-col gap-8">
        <nav className="h-min flex gap-2">
          <div className="rounded-full size-6 bg-emerald-700" />
          <div className="flex gap-1 text-gray-400">
            <h3 className="hover:text-gray-500 transition-colors">
              The Beginning of Infinity
            </h3>
            <span>/</span>
            <p className="hover:text-gray-500 transition-colors">
              A Window on Infinity
            </p>
          </div>
        </nav>
        <div>
          <p
            ref={textContainerRef}
            className={cn(
              "prose",
              highlightMode &&
                "selection:bg-emerald-300 selection:text-emerald-900"
            )}
          >
            {renderWithHighlights(EXCERPT, highlights)}
          </p>
        </div>
      </div>
      <HighlightPopover
        anchor={highlightMode ? highlightAnchor : null}
        onAskClicked={() => {
          setHighlightAnchor(null);
          setAssistantCardOpen(true);
        }}
      />
    </div>
  );
}
