import { Button } from "@/components/Button";
import { CheckCircle2, Image as ImageIcon, Trash2 } from "lucide-react";
import { useMemo } from "react";
import clsx from "clsx";

export interface FileItemProps {
  name: string;
  size: number;
  type: string;
  state?: "progress" | "complete" | "error";
  handleDeleteFile: () => void;
}

export function FileItem({
  state = "progress",
  name,
  size,
  type,
  handleDeleteFile,
}: FileItemProps) {
  const uploadProgress = state === "complete" ? "100%" : "25%";

  const fileSize = useMemo(() => {
    const fileSizeInKB = size / 1024;
    return fileSizeInKB > 1024
      ? (fileSizeInKB / 1024).toFixed(1) + " MB"
      : fileSizeInKB.toFixed(1) + " KB";
  }, [size]);

  return (
    <div
      className={clsx(
        "group flex items-start gap-4 rounded-lg border p-4",
        {
          "border-zinc-200 dark:border-zinc-700": state === "progress",
          "border-violet-500 dark:border-violet-300/20": state === "complete",
          "bg-red-50 border-red-300 dark:bg-red-500/5 dark:border-red-500/30":
            state === "error",
        }
      )}
    >
      <span
        className={clsx(
          "relative rounded-full border-4 p-2",
          {
            "border-violet-100 bg-violet-200 text-violet-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500":
              state !== "error",
            "border-red-50 bg-red-100 text-red-600 dark:bg-red-500/5 dark:border-red-500/30 dark:text-red-400":
              state === "error",
          }
        )}
      >
        <ImageIcon className="h-4 w-4" />
      </span>

      {state === "error" ? (
        <div className="flex flex-1 flex-col items-start gap-1">
          <div className="flex flex-col leading-relaxed">
            <span className="text-sm font-medium text-red-700 dark:text-red-400">
              Upload failed, please try again
            </span>
            <span className="text-sm text-red-600 dark:text-red-500">
              {name}
            </span>
          </div>

          <button
            type="button"
            className="text-sm font-semibold text-red-700 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-start gap-1">
          <div className="flex flex-col leading-relaxed">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-100">
              {name}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {fileSize}
            </span>
          </div>

          <div className="flex w-full items-center gap-3">
            <div className="h-2 flex-1 rounded-full bg-zinc-100 dark:bg-zinc-600">
              <div
                className="h-2 rounded-full bg-violet-600 dark:bg-violet-400"
                style={{ width: uploadProgress }}
              />
            </div>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {uploadProgress}
            </span>
          </div>
        </div>
      )}

      {state === "complete" ? (
        <CheckCircle2 className="h-5 w-5 fill-violet-600 text-white dark:fill-violet-300 dark:text-zinc-900" />
      ) : (
        <Button
          type="button"
          variant="ghost"
          className={clsx(
            "text-zinc-500 hover:text-violet-500",
            {
              "text-red-700 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300":
                state === "error",
            }
          )}
          onClick={handleDeleteFile}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
