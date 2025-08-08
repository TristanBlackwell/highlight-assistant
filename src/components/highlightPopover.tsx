import type { Popover as BasePopover } from "@base-ui-components/react/popover";
import { Popover, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";

export interface HighlightPopoverProps {
  anchor: BasePopover.Positioner.Props["anchor"];
  onAskClicked?: () => void;
}

export default function HighlightPopover({
  anchor,
  onAskClicked,
}: Readonly<HighlightPopoverProps>) {
  return (
    <Popover open={!!anchor}>
      <PopoverContent anchor={anchor} className="max-w-sm w-fit px-3 py-2">
        <div className="flex w-full gap-2">
          <Button type="button" className="py-1" onClick={onAskClicked}>
            Ask
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
