import Image from "next/image";

import { MapPin, ChevronRight, UserRound } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 flex items-center justify-between gap-6 bg-purple-500 p-4 text-white">
      <Image src="/aiqfome-brand.svg" alt="Aiqfome Logo" width={32} height={32} priority />

      <div className="flex items-center gap-4">
        <MapPin className="w-[13px]" />
        <div className="flex flex-col">
          <small className="text-purple-200 text-sm">entregando em</small>
          <a href="#none" className="flex items-center">
            <p className="font-bold">Rua Mandaguari, 198</p>
            <ChevronRight className="h-4" />
          </a>
        </div>
      </div>

      <UserRound className="w-4" />
    </header>
  );
}
