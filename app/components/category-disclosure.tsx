"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";

import { CircleDollarSign } from "lucide-react";
import Link from "next/link";

export type Item = {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  price: number;
  isVegetarian?: boolean;
  isSpicy?: boolean;
};

interface IProps {
  title: string;
  description?: string;
  items: Item[];

  defaultOpen?: boolean;
  className?: string;
}

export function CategoryDisclosure({ className, defaultOpen = false, title, description, items }: IProps) {
  return (
    <Disclosure as="div" className={twMerge("p-4", className)} defaultOpen={defaultOpen}>
      {({ open }) => (
        <>
          <DisclosureButton className="flex w-full items-center justify-between text-neutral-500">
            <div className="flex flex-col items-start">
              <p className="text-neutral-900 font-bold">{title}</p>

              {description && <small className="mt-2 text-xs font-semibold text-start">{description}</small>}
            </div>
            <ChevronDown className={twMerge("flex-none size-5 transition-all", open && "rotate-180")} />
          </DisclosureButton>
          <DisclosurePanel
            transition
            className="origin-top transition duration-200 ease-out data-closed:-translate-y-6 data-closed:opacity-0 pl-1 space-y-4 mt-4"
          >
            {items.map((item) => (
              <Link href={`/store/product/${item.id}/edit`} key={item.id} className="flex justify-between">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{item.name}</p>
                  <small className="text-xs text-neutral-500">
                    {item.description && item.description.length > 100
                      ? `${item.description?.substring(0, 100)} ...`
                      : item.description}
                  </small>
                </div>

                {item.price ? (
                  <div className="flex flex-col items-end flex-none">
                    <small className="text-xs font-bold text-neutral-500 line-through">
                      R$ {item.basePrice.toFixed(2)}
                    </small>
                    <span className="flex items-center gap-1 text-sm font-bold text-green-500">
                      <CircleDollarSign className="size-[14px]" strokeWidth={1.5} />
                      <p>R$ {item.price.toFixed(2)}</p>
                    </span>
                  </div>
                ) : (
                  <p className="flex-none text-sm font-bold text-purple-500">R$ {item.basePrice.toFixed(2)}</p>
                )}
              </Link>
            ))}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
