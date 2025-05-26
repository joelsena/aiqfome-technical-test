import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { twMerge } from "tailwind-merge";

interface IButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {}

export function Button({ children, className, ...rest }: IButtonProps) {
  return (
    <button className={twMerge("bg-purple-500 rounded-lg text-white p-4 font-bold", className)} type="button" {...rest}>
      {children}
    </button>
  );
}
