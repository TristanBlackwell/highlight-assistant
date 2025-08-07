import type { Popover as BasePopover } from "@base-ui-components/react/popover";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
} from "../components/ui/popover";

export interface AssistantPopoverProps {
  anchor: BasePopover.Positioner.Props["anchor"];
}

export default function AssistantPopover({
  anchor,
}: Readonly<AssistantPopoverProps>) {
  return (
    <Popover open={!!anchor}>
      <PopoverContent
        anchor={anchor}
        className="w-[calc(100vw-4rem)] sm:w-[500px]"
      >
        <PopoverHeader>
          <PopoverTitle>Assistant</PopoverTitle>
          <PopoverDescription>
            Ask the assistant any questions you may have.
          </PopoverDescription>
        </PopoverHeader>
        <div className="mt-2 flex w-full gap-2">Content goes here</div>
      </PopoverContent>
    </Popover>
  );
}
