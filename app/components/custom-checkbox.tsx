"use client";

import { Checkbox } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import { Check } from "lucide-react";

interface IProps {
  value: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  label: string;
  basePrice?: number;
}

export function CustomCheckbox({ value, onChange, className, basePrice, label }: IProps) {
  return (
    <Checkbox checked={value} onChange={onChange} className={className}>
      {({ checked }) => (
        <div className="flex items-center">
          <div
            className={twMerge(
              "flex items-center justify-center transition-all size-4 border-2 border-neutral-400 rounded-[4px]",
              checked && "border-neutral-500 bg-neutral-500 text-white"
            )}
          >
            <Check className={twMerge("hidden size-4", checked && "block")} />
          </div>

          <span className="flex items-center justify-between text-sm w-full ml-3">
            <p className="text-sm text-neutral-500">{label}</p>

            {basePrice && <p className="font-bold text-purple-500">+R$ {basePrice.toFixed(2)}</p>}
          </span>
        </div>
      )}
    </Checkbox>
  );
}
