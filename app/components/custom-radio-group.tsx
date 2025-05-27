"use client";

import { Radio, RadioGroup } from "@headlessui/react";

import { Circle, CircleDollarSign } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

type Item = {
  basePrice: number;
  price?: number;
  name: string;
};

interface IProps {
  value?: Item;
  onChange: (item: Item) => void;
  items: Item[];
  className?: string;
}

export function CustomRadioGroup({ value, onChange, items, className }: IProps) {
  const [selected, setSelected] = useState({} as Item);

  function handleOnChange(item: Item) {
    if (!value) {
      setSelected(item);
    }

    onChange(item);
  }

  return (
    <div>
      <RadioGroup
        by="name"
        arial-label="variants"
        value={value ? value : selected}
        onChange={handleOnChange}
        className={twMerge("space-y-4", className)}
      >
        {items.map((item) => (
          <Radio key={item.name} value={item} className="flex items-center gap-2">
            {({ checked }) => (
              <>
                <Circle
                  className={twMerge(
                    "size-4 text-neutral-400 fill-white transition flex-none",
                    checked && "text-neutral-500 fill-neutral-500"
                  )}
                />

                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    {item.price && <CircleDollarSign strokeWidth={1.5} className="size-4 text-green-500 mr-1" />}
                    <p className="text-sm text-neutral-500">{item.name}</p>
                  </div>

                  <div className="flex text-sm font-bold text-purple-500">
                    {item.price ? (
                      <p className="text-green-500">
                        <small className="text-neutral-500">de R$ {item.basePrice.toFixed(2)} por</small> R${" "}
                        {item.price.toFixed(2)}
                      </p>
                    ) : (
                      item.basePrice > 0 && <p>R$ {item.basePrice.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
}
