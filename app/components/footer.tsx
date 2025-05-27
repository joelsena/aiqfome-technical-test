"use client";

import { useTicketCtx } from "@/context/ticket-context";
import { useRouter } from "next/navigation";
import { Button } from "./button";

export function Footer() {
  const { products } = useTicketCtx();
  const router = useRouter();

  return (
    <footer className="bg-neutral-100 p-6 text-purple-700 flex flex-col items-center space-y-2 font-bold text-center">
      <p>feito com 💜 em maringá-PR</p>

      {products.length > 0 ? (
        <Button className="w-full" onClick={() => router.push("/ticket")}>
          Ver Ticket
        </Button>
      ) : (
        <p>aiqfome.com © 2007-2025 aiqfome LTDA. CNPJ: 09.186.786/0001-58</p>
      )}
    </footer>
  );
}
