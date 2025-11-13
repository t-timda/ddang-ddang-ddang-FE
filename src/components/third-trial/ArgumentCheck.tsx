import type { ChangeEvent } from "react";
import clsx from "clsx";
import ThumbUpIcon from "@/assets/svgs/thumbs-up.svg?react";
import CheckIcon from "@/assets/icons/CheckIcon";
import type { ArgumentData } from "@/components/common/ArgumentCard";

type ArgumentCheckProps = {
  argument: ArgumentData;
  checked?: boolean;
  disabled?: boolean;
  onToggle?: (argumentId: number, nextChecked: boolean) => void;
  checkClassName?: string;
  className?: string;
};

export default function ArgumentCheck({
  argument,
  checked = false,
  disabled = false,
  onToggle,
  checkClassName = "bg-main-bright",
  className,
}: ArgumentCheckProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onToggle?.(argument.id, event.target.checked);
  };

  return (
    <label
      className={clsx(
        "flex w-full flex-col items-center gap-8 border-b border-main-medium p-[30px] transition-colors",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        checked && checkClassName,
        className
      )}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />

      <div className="flex w-full items-start gap-[39px] rounded-[16px] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-main">
        <div
          className={clsx(
            "flex h-[31px] w-[31px] items-center justify-center rounded-[5px] border-2 border-main transition-colors",
            checked && "border-main bg-main"
          )}
        >
          <CheckIcon
            className={clsx(
              "h-[15px] w-[20px] text-main transition-opacity",
              checked ? "opacity-100 text-white" : "opacity-0"
            )}
          />
        </div>

        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full items-center justify-between gap-8">
            <div className="flex items-center gap-[25px]">
              <span className="flex h-[27px] items-center justify-center rounded-full bg-main-medium px-5 py-[5px] text-[14px] font-normal leading-[17px] text-white">
                {argument.userDgree}
              </span>
              <span className="text-[16px] font-bold leading-[19px] text-main">
                {argument.userNickname}
              </span>
            </div>

            <div className="flex items-center gap-[15px] text-main">
              <ThumbUpIcon className="h-[23px] w-[23px]" />
              <span className="text-[16px] font-normal leading-[24px]">
                {argument.likes}명이 이 의견에 찬성합니다
              </span>
            </div>
          </div>

          <p className="w-full text-[16px] font-normal leading-[24px] text-main whitespace-pre-line">
            {argument.content}
          </p>
        </div>
      </div>
    </label>
  );
}
