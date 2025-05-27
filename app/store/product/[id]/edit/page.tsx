"use client";

import { AddRemoveCounter } from "@/components/add-remove-counter";
import { useTicketCtx } from "@/context/ticket-context";
import getProduct from "@/mock/get-product.json";
import { Trash2 } from "lucide-react";
import Image from "next/image";

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

export default function ItemPage() {
  const product: Product = getProduct.product;
  const globalAddons: GlobalAddon[] = getProduct.globalAddons;

  const { products, updateProduct, removeProduct, addProduct } = useTicketCtx();
  const ticketProduct = products.find((ticketProduct) => ticketProduct.productId === product.id);

  console.log({ ticketProduct, products });

  return (
    <div>
      <Image priority width={390} height={195} src={product.image} alt={`Imagem de ${product.name}`} />
      <div className="divide-y-4 divide-neutral-100 text-neutral-500">
        <div className="p-4">
          <h2 className="text-xl font-bold text-neutral-700">{product.name}</h2>
          <p className="font-extrabold text-purple-500 text-lg">
            <small className="text-neutral-500 text-sm">a partir de</small> R$ {product.basePrice.toFixed(2)}
          </p>

          <small className="text-sm font-semibold">{product.description}</small>

          <div className="flex justify-between mt-6">
            <div className="text-neutral-700">
              <p className="font-bold">quantos?</p>
              {ticketProduct?.price ? (
                <p className="text-sm text-neutral-500">
                  <small className="">total</small> {`R$ ${ticketProduct.price.toFixed(2)}`}
                </p>
              ) : null}
            </div>

            <div>
              {!ticketProduct ? (
                <button
                  className="bg-neutral-500 text-white px-6 py-3 rounded-lg text-sm font-bold"
                  type="button"
                  onClick={() =>
                    addProduct({
                      quantity: 1,
                      productId: product.id,
                      addons: [],
                    })
                  }
                >
                  adicionar
                </button>
              ) : (
                <AddRemoveCounter
                  count={ticketProduct.quantity}
                  onUpdate={(count) => {
                    if (count === 0) {
                      removeProduct(ticketProduct.id);
                    } else {
                      updateProduct(ticketProduct.id, {
                        quantity: count,
                      });
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="p-4">
          <h4 className="font-bold text-neutral-900">qual o tamanho?</h4>
          <small className="font-bold text-xs">escolha 1</small>
        </div>
        <div className="p-4">
          <h4 className="font-bold text-neutral-900">acompanhamentos</h4>
          <small className="font-bold text-xs">escolha até 2</small>
        </div>
        <div className="p-4">
          <h4 className="font-bold text-neutral-900">vai querer bebida?</h4>
          <small className="font-bold text-xs">escolha quantos quiser</small>
        </div>
        <div className="p-4">
          <h4 className="font-bold text-neutral-900">precisa de talher?</h4>
          <small className="font-bold text-xs">escolha até 1</small>
        </div>
        <div className="p-4">
          <h4 className="font-bold text-neutral-900">mais alguma coisa?</h4>
          <small className="font-bold text-xs">escolha até 2</small>
        </div>

        <div className="p-4">
          <textarea
            className="w-full rounded-[4px] border border-neutral-200 p-3 text-sm font-semibold text-neutral-500"
            placeholder="alguma observação do item? • opcional
ex: tirar algum ingrediente, ponto do prato"
          />
        </div>
      </div>
    </div>
  );
}
