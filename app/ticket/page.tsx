"use client";

import { AddRemoveCounter } from "@/components/add-remove-counter";
import { ITicketProduct, useTicketCtx } from "@/context/ticket-context";
import { Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Ticket() {
  const { products, stores, updateProduct, removeProduct } = useTicketCtx();

  return (
    <div className="divide-y-4 divide-neutral-100">
      {stores.map((store) => {
        const ticketProducts = products.filter((product) => store.ticketProducts.includes(product.id));

        return (
          <div key={store.id}>
            <div className="flex items-center gap-2 p-4">
              <Image
                className="rounded-[4px] border border-neutral-100"
                width={36}
                height={36}
                src={store.logo}
                alt="logo da loja"
              />

              <div>
                <small className="text-neutral-500 font-bold text-sm">seus itens em</small>
                <p className="font-bold text-neutral-900">{store.name}</p>
              </div>
            </div>

            <div className="divide-y-4 divide-neutral-100">
              {ticketProducts.map((ticketProduct) => (
                <div className="p-4 space-y-4" key={ticketProduct.id}>
                  <div className="flex items-center justify-between text-sm font-bold">
                    <p className="text-neutral-900">{ticketProduct.productName}</p>

                    <p className="text-purple-500">R$ {ticketProduct.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items center justify-end gap-6">
                    <Link
                      href={`/store/product/${ticketProduct.productId}/edit`}
                      className="flex items-center text-teal-400 gap-1"
                    >
                      <Pencil className="size-4" />
                      <small className="text-sm font-bold">editar</small>
                    </Link>

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
                  </div>

                  <ul className="list-disc ml-4 space-y-2">
                    <li className="list-item text-xs font-semibold text-neutral-500">
                      <p className="font-bold">tamanho</p>
                      <p>{ticketProduct.variant?.name}</p>
                    </li>
                    <li className="list-item text-xs font-semibold text-neutral-500">
                      <p className="font-bold">acompanhamentos</p>
                      {ticketProduct.addons.map((addon) => (
                        <p key={addon.name}>{addon.name}</p>
                      ))}
                    </li>
                    <li className="list-item text-xs font-semibold text-neutral-500">
                      <p className="font-bold">vai querer bebida?</p>
                      {ticketProduct.drinks?.map((drink) => (
                        <div className="flex gap-2" key={drink.name}>
                          {drink.name}{" "}
                          <p className="font-bold text-teal-400">
                            R$ {(drink.basePrice * (drink?.quantity ?? 1)).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </li>
                    <li className="list-item text-xs font-semibold text-neutral-500">
                      <p className="font-bold">precisa de talher?</p>
                      <p>{ticketProduct.cutlery?.name}</p>
                    </li>
                    <li className="list-item text-xs font-semibold text-neutral-500">
                      <p className="font-bold">mais alguma coisa?</p>
                      {ticketProduct.extra?.map((extraItem) => (
                        <div className="flex gap-2" key={extraItem.name}>
                          {extraItem.name}{" "}
                          <p className="font-bold text-teal-400">R$ {extraItem.basePrice.toFixed(2)}</p>
                        </div>
                      ))}
                    </li>
                  </ul>

                  {ticketProduct.comment && (
                    <div className="text-xs text-neutral-600 font-semibold bg-neutral-50 rounded-[4px] p-1.5 w-full">
                      <strong className="font-bol">observação:</strong> {ticketProduct.comment}
                    </div>
                  )}
                </div>
              ))}

              <div />
            </div>
          </div>
        );
      })}
    </div>
  );
}
