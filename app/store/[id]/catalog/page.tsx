import Image from "next/image";

import { Share2, Heart, ChevronRight, Star } from "lucide-react";

import getStore from "@/mock/get-store.json";
import Link from "next/link";
import { CategoryDisclosure, type Item } from "@/components/category-disclosure";

interface IProps {
  params: Promise<{ id: string }>;
}

type Category = {
  id: string;
  name: string;
  description: string;
  type: string; // "main" | "addons"
  items: string[];
};

type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  basePrice: number;
  price?: number;
  isVegetarian: boolean;
  isSpicy: boolean;
  variants: {
    name: string;
    basePrice: number;
    price?: number;
  }[];
  addons?: { name: string; basePrice: number }[];
};

type GlobalAddon = {
  id: string;
  name: string;
  basePrice: number;
  price?: number;
};

type Store = {
  id: string;
  name: string;
  logo: string;
  closesAt: string;
  deliveryOptions: {
    deliveryFee: number;
    minimumOrder: number;
    estimatedDeliveryTime: string;
    distance: string;
  };
  rating: number;
  categories: Category[];
  products: Product[];
  globalAddons: GlobalAddon[];
};

export default async function StoreCatalog(props: IProps) {
  const { id } = await props.params;

  const store: Store = getStore.store;

  return (
    <div>
      <div className="flex flex-col p-4 space-y-2">
        <div className="flex items-center font-extrabold text-xl gap-2">
          <Image
            className="rounded-[4px] border border-neutral-100"
            width={36}
            height={36}
            src={store.logo}
            alt="logo da loja"
          />

          <h2 className="">{store.name}</h2>
        </div>

        <div className="flex items-center justify-between text-purple-700">
          <div className="flex gap-4">
            <Share2 className="transform rotate-180 size-4" />
            <Heart className="size-4" />
          </div>

          <Link className="flex items-center gap-1 text-teal-400" href="#todo">
            <p className="text-xs font-bold">mais info</p>
            <ChevronRight className="w-3 flex-none" />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1 items-center text-purple-500">
            <Image width={18} height={18} src="/icons/delivery-icon-purple.svg" alt="ícone delivery" />
            <p className="text-sm font-bold leading-none">{`R$ ${store.deliveryOptions.deliveryFee}`}</p>
            <ChevronRight className="w-3 flex-none" />
          </div>

          <span className="size-1 rounded-full bg-neutral-400" />

          <small className="text-xs font-bold text-neutral-500">{`hoje, ${store.deliveryOptions.estimatedDeliveryTime}`}</small>

          <span className="size-1 rounded-full bg-neutral-400" />

          <small className="text-xs font-bold text-neutral-500">{store.deliveryOptions.distance}</small>
        </div>

        <div className="text-teal-600 mr-auto text-xs font-bold bg-teal-50 rounded-[4px] px-2 py-1.5">
          entrega grátis acima de R$ 35,00
        </div>

        <div className="flex items-center gap-2 text-neutral-500">
          <Star className="text-yellow-500 fill-yellow-500 w-[12px]" />

          <small className="text-xs font-bold">{`${store.rating} de 5`}</small>

          <ChevronRight className="w-3 flex-none" />

          <span className="size-1 rounded-full bg-neutral-400" />

          <small className="text-xs font-bold text-green-500">{`fecha às ${store.closesAt}`}</small>
        </div>

        <p className="text-xs font-bold text-neutral-500">{`pedido mínimo: R$ ${store.deliveryOptions.minimumOrder.toFixed(
          2
        )}`}</p>
      </div>

      <div className="divide-y-4 divide-neutral-100">
        {store.categories.map((category) => (
          <CategoryDisclosure
            key={category.id}
            title={category.name}
            description={category.description}
            items={category.items.reduce<Item[]>((items, itemId) => {
              const fieldKey = category.type === "main" ? "products" : "globalAddons";

              const itemContent = store[fieldKey].find((field) => field.id === itemId);
              if (itemContent) {
                items.push({
                  ...itemContent,
                  price: itemContent.price ?? 0,
                });
              }

              return items;
            }, [])}
          />
        ))}
      </div>
    </div>
  );
}
