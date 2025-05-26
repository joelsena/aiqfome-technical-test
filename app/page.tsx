import Image from "next/image";
import Link from "next/link";

import { Search, Star } from "lucide-react";

import getAllStoresMock from "@/mock/get-all-stores.json";
import { twMerge } from "tailwind-merge";

type Store = {
  id: number;
  logo_url: string;
  name: string;
  rating: number;
  shipping_cost: string;
  open: boolean;
};

export default function Home() {
  const stores: Store[] = getAllStoresMock;

  const openedStores = stores.filter((store) => store.open);
  const closedStores = stores.filter((store) => !store.open);

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
          className="mt-px sm:hidden"
          src="/discount-banner.png"
          alt="Banner de promoção"
          width={390}
          height={130}
          priority
        />

        <div className="p-4 space-y-4">
          <h5 className="text-purple-500 font-extrabold">Abertos</h5>
          {openedStores.map((store) => (
            <Link
              href={`/store-catalog/${store.id}`}
              className={twMerge("flex bg-neutral-50 rounded-lg overflow-hidden", !store.open && "opacity-50")}
              key={store.id}
            >
              <Image className="object-contain" width={72} height={72} src={store.logo_url} alt="Logo da lanchonete" />

              <div className="p-3">
                <p className="font-bold text-neutral-700">{store.name}</p>
                <div className="flex items-center gap-2">
                  {store.shipping_cost === "R$0,00" ? (
                    <span className="flex items-center gap-1 text-teal-600">
                      <Image width={18} height={13} src="/icons/delivery-icon.svg" alt="ícone de delivery" />
                      <p className="text-sm font-bold leading-none">grátis</p>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-purple-500">
                      <Image width={18} height={18} src="/icons/aiqentrega-icon.svg" alt="ícone de delivery" />
                      <p className="text-sm font-bold leading-none">{store.shipping_cost}</p>
                    </span>
                  )}

                  <span className="size-1 rounded-full bg-neutral-400" />

                  <span className="flex items-center">
                    <Star className="text-yellow-500 fill-yellow-500 w-[18px]" />
                    <p className="text-sm leading-none font-bold text-neutral-500 ml-1">{store.rating}</p>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="p-4 space-y-4">
          <h5 className="text-purple-500 font-extrabold">Fechados</h5>
          {closedStores.map((store) => (
            <Link
              href="/store-catalog"
              className={twMerge(
                "flex bg-neutral-50 rounded-lg overflow-hidden",
                !store.open && "opacity-50 pointer-events-none"
              )}
              key={store.id}
            >
              <Image className="object-contain" width={72} height={72} src={store.logo_url} alt="Logo da lanchonete" />

              <div className="p-3">
                <p className="font-bold text-neutral-700">{store.name}</p>
                <div className="flex items-center gap-2">
                  {store.shipping_cost === "R$0,00" ? (
                    <span className="flex items-center gap-1 text-teal-600">
                      <Image width={18} height={18} src="/icons/delivery-icon.svg" alt="ícone de delivery" />
                      <p className="text-sm font-bold leading-none">grátis</p>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-purple-500">
                      <Image width={18} height={18} src="/icons/aiqentrega-icon.svg" alt="ícone de delivery" />
                      <p className="text-sm font-bold leading-none">{store.shipping_cost}</p>
                    </span>
                  )}

                  <span className="size-1 rounded-full bg-neutral-400" />

                  <span className="flex items-center">
                    <Star className="text-yellow-500 fill-yellow-500 w-[18px]" />
                    <p className="text-sm leading-none font-bold text-neutral-500 ml-1">{store.rating}</p>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
