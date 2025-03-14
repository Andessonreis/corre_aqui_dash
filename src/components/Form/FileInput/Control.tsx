"use client";

import { ChangeEvent, ComponentProps, forwardRef } from "react";
import { useFileInput } from "./Root";

export type ControlProps = Omit<ComponentProps<"input">, "multiple">;

export const Control = forwardRef<HTMLInputElement, ControlProps>(
  ({ onChange, ...props }, ref) => {
    const { id, onFilesSelected, multiple } = useFileInput();

    function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
      const files = event.target.files;
      if (!files?.length) return;

      onFilesSelected(Array.from(files));
    }

    return (
      <input
        ref={ref}
        type="file"
        id={id}
        multiple={multiple}
        className="sr-only"
        onChange={handleFilesSelected}
        {...props}
      />
    );
  }
);

Control.displayName = "Control";
