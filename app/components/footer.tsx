"use client";

import { useTicketCtx } from "@/context/ticket-context";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./button";

export function Footer() {
  const { products, subtotal } = useTicketCtx();
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/ticket") {
    return (
      <footer
        className="fixed bottom-0 right-0 left-0 w-full flex justify-between gap-6 px-8 py-4 rounded-t-lg"
        style={{
          boxShadow: "0px 0px 15px 0px #00000026",
        }}
      >
        <div className="flex-none">
          <p className="text-sm font-bold text-neutral-900">subtotal</p>
          <h2 className="text-xl font-extrabold text-purple-500">R$ {subtotal.toFixed(2)}</h2>
        </div>

        <Button className="w-full">ir para pagamento</Button>
      </footer>
    );
  }

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
