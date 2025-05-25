import Image from "next/image";

import { Search } from "lucide-react";

export default function Home() {
  return (
    <div>
      <div className="bg-purple-500 px-4 pb-4">
        <div className="flex items-center bg-white px-3 py-2 rounded-lg border border-neutral-200 text-neutral-500">
          <Search className="text-neutral-400 flex-none size-4" />
          <input
            className="w-full ml-2 placeholder:text-neutral-500 font-semibold text-sm"
            type="text"
            placeholder="busque pela loja ou culinária"
          />
        </div>
      </div>

      <div>
        <Image
          className="mt-px"
          src="/discount-banner.png"
          alt="Banner de promoção"
          width={390}
          height={130}
          priority
        />

        <div className="p-4">
          <h5>Abertos</h5>

          <div></div>
        </div>
      </div>
    </div>
  );
}
