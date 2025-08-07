import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import AssistantPopover from "@/components/assistant-popover";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [highlightAnchor, setHighlightAnchor] = useState<{
    getBoundingClientRect: () => DOMRect;
    contextElement: HTMLElement;
  } | null>(null);
  const [highlightedText, setHighlightedText] = useState<string>("");

  useEffect(() => {
    const handleHighlightSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        requestAnimationFrame(() => {
          setHighlightedText(text);
          setHighlightAnchor({
            getBoundingClientRect: () => rect,
            contextElement: document.body,
          });
        });
      } else {
        setHighlightAnchor(null);
      }
    };

    document.addEventListener("mouseup", handleHighlightSelection);
    document.addEventListener("keyup", handleHighlightSelection);

    return () => {
      document.removeEventListener("mouseup", handleHighlightSelection);
      document.removeEventListener("keyup", handleHighlightSelection);
    };
  }, []);

  return (
    <div className="h-screen">
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
          <p className="prose">
            Most forms of universality themselves refer to some sort of infinity
            – though they can always be interpreted in terms of something being
            unlimited rather than actually infinite. This is what opponents of
            infinity call a ‘potential infinity’ rather than a ‘realized’ one.
            For instance, the beginning of infinity can be described either as a
            condition where ‘progress in the future will be unbounded’ or as the
            condition where ‘an infinite amount of progress will be made’. But I
            use those concepts interchangeably, because in this context there is
            no substantive difference between them.
            <br />
            There is a philosophy of mathematics called finitism, the doctrine
            that only finite abstract entities exist. So, for instance, there
            are infinitely many natural numbers, but finitists insist that that
            is just a manner of speaking. They say that the literal truth is
            only that there is a finite rule for generating each natural number
            (or, more precisely, each numeral) from the previous one, and
            nothing literally infinite is involved. But this doctrine runs into
            the following problem: is there a largest natural number or not? If
            there is, then that contradicts the statement that there is a rule
            that defines a larger one. If there is not, then there are not
            finitely many natural numbers. Finitists are then obliged to deny a
            principle of logic: the ‘law of the excluded middle’, which is that,
            for every meaningful proposition, either it or its negation is true.
            So finitists say that, although there is no largest number, there is
            not an infinity of numbers either.
            <br />
            Finitism is instrumentalism applied to mathematics: it is a
            principled rejection of explanation. It attempts to see mathematical
            entities purely as procedures that mathematicians follow, rules for
            making marks on paper and so on – useful in some situations, but not
            referring to anything real other than the finite objects of
            experience such as two apples or three oranges. And so finitism is
            inherently anthropocentric – which is not surprising, since it
            regards parochialism as a virtue of a theory rather than a vice. It
            also suffers from another fatal flaw that instrumentalism and
            empiricism have in regard to science, which is that it assumes that
            mathematicians have some sort of privileged access to finite
            entities which they do not have for infinite ones. But that is not
            the case. All observation is theory-laden. All abstract theorizing
            is theory-laden too. All access to abstract entities, finite or
            infinite, is via theory, just as for physical entities.
          </p>
        </div>
      </div>
      <AssistantPopover anchor={highlightAnchor} />
    </div>
  );
}
