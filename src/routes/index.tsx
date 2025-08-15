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
  id: string;
  start: number;
  end: number;
  text: string;
}

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [highlightMode, setHighlightMode] = useState(false);
  const [highlight, setHighlight] = useState<Highlight | null>(null);
  const [highlightAnchor, setHighlightAnchor] = useState<{
    getBoundingClientRect: () => DOMRect;
  } | null>(null);
  const [assistantCardOpen, setAssistantCardOpen] = useState(false);

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

  const mergeHighlights = useCallback(
    (
      previousHighlight: Highlight | null,
      newHighlight: Highlight | null
    ): Highlight | null => {
      if (!newHighlight) {
        return previousHighlight;
      }
      if (!previousHighlight) {
        return newHighlight;
      }

      const sorted = [previousHighlight, newHighlight].sort(
        (a, b) => a.start - b.start
      );

      if (sorted[1].start <= sorted[0].end) {
        // Merge overlaps or touching ranges
        const mergedStart = sorted[0].start;
        const mergedEnd = Math.max(sorted[0].end, sorted[1].end);
        return {
          id: crypto.randomUUID(),
          start: mergedStart,
          end: mergedEnd,
          text: EXCERPT.slice(mergedStart, mergedEnd),
        };
      } else {
        // Independent, return the new one
        return newHighlight;
      }
    },
    []
  );

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
        const newHighlight: Highlight = {
          id: crypto.randomUUID(),
          start: Math.min(start, end),
          end: Math.max(start, end),
          text: EXCERPT.slice(Math.min(start, end), Math.max(start, end)),
        };

        setHighlight((prev) => mergeHighlights(prev, newHighlight));
      }

      requestAnimationFrame(() => {
        setHighlightAnchor({
          getBoundingClientRect: () => rect,
        });
      });
    };

    document.addEventListener("mouseup", handleHighlightSelection);

    return () => {
      document.removeEventListener("mouseup", handleHighlightSelection);
    };
  }, [getCharOffset, highlightMode, mergeHighlights]);

  function renderWithHighlights(text: string) {
    if (!highlight) return text;

    const parts: ReactElement[] = [];
    let lastIndex = 0;

    parts.push(
      <span key={`t-${highlight.id}-before`}>
        {text.slice(lastIndex, highlight.start)}
      </span>
    );
    parts.push(
      <span
        key={`t-${highlight.id}-hl`}
        className="bg-emerald-300 text-emerald-900"
      >
        {text.slice(highlight.start, highlight.end)}
      </span>
    );
    lastIndex = highlight.end;
    parts.push(<span key="t-end">{text.slice(lastIndex)}</span>);

    return parts;
  }

  return (
    <div className="min-h-screen relative">
      <div id="highlight-button" className="fixed bottom-6 left-6 z-50">
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
        highlight={highlight?.text ?? ""}
        open={assistantCardOpen}
        handleOpenChange={(open) => {
          setAssistantCardOpen(open);
        }}
      />
      <div className="max-w-2xl mx-auto p-4 flex flex-col gap-8">
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
            {renderWithHighlights(EXCERPT)}
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
