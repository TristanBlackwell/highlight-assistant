import type { Popover as BasePopover } from "@base-ui-components/react/popover";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
} from "./ui/popover";

export interface AssistantPopoverProps {
  anchor: BasePopover.Positioner.Props["anchor"];
}

export default function AssistantPopover({
  anchor,
}: Readonly<AssistantPopoverProps>) {
  return (
    <Popover open={!!anchor}>
      <PopoverContent anchor={anchor} className="max-w-sm w-[200px]">
        <PopoverHeader>
          <PopoverTitle>Assistant</PopoverTitle>
        </PopoverHeader>
        <div className="mt-2 flex w-full gap-2">
          <button
            type="button"
            title="Highlight mode"
            className="p-2 rounded-md outline outline-gray-200 hover:outline-gray-300 shadow-sm shadow-gray-200 hover:shadow-gray-300 text-gray-500 hover:text-gray-600 transition-all"
          >
            Save
          </button>
          <button
            type="button"
            title="Highlight mode"
            className="p-2 rounded-md outline outline-gray-200 hover:outline-gray-300 shadow-sm shadow-gray-200 hover:shadow-gray-300 text-gray-500 hover:text-gray-600 transition-all"
          >
            Ask
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
