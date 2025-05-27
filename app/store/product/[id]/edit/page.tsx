"use client";
import type { ChangeEventHandler } from "react";
import Image from "next/image";

import { type ITicketProduct, type subProduct, useTicketCtx } from "@/context/ticket-context";
import { AddRemoveCounter } from "@/components/add-remove-counter";
import { CustomRadioGroup } from "@/components/custom-radio-group";
import { CustomCheckbox } from "@/components/custom-checkbox";
import getProduct from "@/mock/get-product.json";

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

type Item = {
  basePrice: number;
  price?: number;
  name: string;
};

type Category = {
  id: string;
  name: string;
  description: string;
  type: string;
  items: string[];
  limit?: number;
};

export default function ItemPage() {
  const product: Product = getProduct.product;
  const globalAddons: GlobalAddon[] = getProduct.globalAddons;
  const categories: Category[] = getProduct.categories;
  const storeInfo = getProduct.store;

  const { products, updateProduct, removeProduct, addProduct } = useTicketCtx();
  const ticketProduct = products.find((ticketProduct) => ticketProduct.productId === product.id);

  const drinksCategory = categories.find((category) => category.name === "bebidas");
  const extraCategory = categories.find((category) => category.name === "extra");
  const cutleryCategory = categories.find((category) => category.name === "talheres");

  const cutleryItems = globalAddons.filter((gAddon) => cutleryCategory?.items.includes(gAddon.id));
  const drinksItems = globalAddons.filter((gAddon) => drinksCategory?.items.includes(gAddon.id));
  const extraItems = globalAddons.filter((gAddon) => extraCategory?.items.includes(gAddon.id));

  function handleChangeRadio(field: string, payload: Item) {
    if (!ticketProduct) {
      handleAddProduct({
        [field]: payload,
      });
    } else {
      updateProduct(ticketProduct.id, {
        [field]: payload,
      });
    }
  }

  function handleAddProduct(payload?: Partial<ITicketProduct>) {
    return addProduct(
      {
        quantity: 1,
        productId: product.id,
        productName: product.name,
        addons: [],
        ...payload,
      },
      storeInfo
    );
  }

  function handleToggleCheckbox(item: subProduct, input: boolean, field: "addons" | "extra") {
    if (!ticketProduct) {
      handleAddProduct({
        [field]: [item],
      });
    } else {
      const ticketField = ticketProduct[field];

      if (!ticketField) {
        updateProduct(ticketProduct.id, {
          [field]: [item],
        });
      } else {
        updateProduct(ticketProduct.id, {
          [field]:
            input && ticketField.length < 2
              ? [...ticketField, item]
              : ticketField.filter((fieldItem) => fieldItem.name !== item.name),
        });
      }
    }
  }

  function handleDrinkUpdate(drink: subProduct) {
    if (!ticketProduct) {
      handleAddProduct({
        drinks: [drink],
      });
    } else {
      const ticketDrinks = ticketProduct.drinks ? ticketProduct.drinks : [];
      const hasDrink = ticketDrinks.find((ticketDrink) => ticketDrink.name === drink.name);

      if (hasDrink) {
        updateProduct(ticketProduct.id, {
          drinks:
            drink.quantity && drink.quantity <= 0
              ? ticketDrinks.filter((ticketDrink) => ticketDrink.name !== drink.name)
              : ticketDrinks.map((ticketDrink) => ({
                  ...ticketDrink,
                  quantity: ticketDrink.name === drink.name ? drink.quantity : ticketDrink.quantity,
                })),
        });
      } else {
        updateProduct(ticketProduct.id, {
          drinks: [...ticketDrinks, drink],
        });
      }
    }
  }

  const handleOnChangeTextarea: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    const value = event.target.value;

    if (!ticketProduct) {
      handleAddProduct({
        comment: value,
      });
    } else {
      updateProduct(ticketProduct.id, {
        comment: value,
      });
    }
  };

  return (
    <div>
      <Image
        className="block sm:hidden"
        priority
        width={390}
        height={195}
        src={product.image}
        alt={`Imagem de ${product.name}`}
      />
      <div className="divide-y-4 divide-neutral-100 text-neutral-500">
        <div className="p-4">
          <h2 className="text-xl font-bold text-neutral-700">{product.name}</h2>
          <p className="font-extrabold text-purple-500 text-lg">
            <small className="text-neutral-500 text-sm">a partir de</small> R${" "}
            {product.price ? product.price.toFixed(2) : product.basePrice.toFixed(2)}
          </p>

          <small className="text-sm font-semibold">{product.description}</small>

          <div className="flex items-center justify-between mt-6">
            <div className="text-neutral-700">
              <p className="font-bold">quantos?</p>
              {ticketProduct?.price ? (
                <p className="text-sm font-bold">
                  <small className="font-semibold text-neutral-500">total</small>{" "}
                  {`R$ ${ticketProduct.price.toFixed(2)}`}
                </p>
              ) : null}
            </div>

            <div>
              {!ticketProduct ? (
                <button
                  className="bg-neutral-500 text-white px-6 py-3 rounded-lg text-sm font-bold"
                  type="button"
                  onClick={() => handleAddProduct()}
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

        <div className="p-4 relative">
          <h4 className="font-bold text-neutral-900">qual o tamanho?</h4>
          <small className="font-bold text-xs">escolha 1</small>

          <CustomRadioGroup
            className="mt-4"
            items={product.variants}
            value={ticketProduct?.variant}
            onChange={(variant) => handleChangeRadio("variant", variant)}
          />

          <span className="absolute top-4 right-4 bg-neutral-700 text-white p-1.5 rounded-[4px] text-xs font-bold">
            obrigatório
          </span>
        </div>

        <div className="p-4 relative">
          <h4 className="font-bold text-neutral-900">acompanhamentos</h4>
          <small className="font-bold text-xs">escolha 1 a 2</small>

          <div className="flex flex-col space-y-4 mt-4">
            {product.addons?.map((addon) => (
              <CustomCheckbox
                key={addon.name}
                value={!!ticketProduct?.addons.find((ticketAddon) => ticketAddon.name === addon.name)}
                onChange={(input) => handleToggleCheckbox(addon, input, "addons")}
                label={addon.name}
              />
            ))}
          </div>

          <span className="absolute top-4 right-4 bg-neutral-700 text-white p-1.5 rounded-[4px] text-xs font-bold">
            obrigatório
          </span>
        </div>

        <div className="p-4">
          <h4 className="font-bold text-neutral-900">vai querer bebida?</h4>
          <small className="font-bold text-xs">escolha quantos quiser</small>

          <div className="mt-4 flex flex-col gap-4">
            {drinksItems.map((drink) => (
              <div key={drink.id} className="flex gap-2">
                <AddRemoveCounter
                  count={ticketProduct?.drinks?.find((tDrink) => tDrink.name === drink.name)?.quantity ?? 0}
                  onUpdate={(count) => handleDrinkUpdate({ ...drink, quantity: count })}
                />

                <span className="flex items-center justify-between text-sm w-full">
                  <p className="font-semibold text-neutral-500">{drink.name}</p>

                  <p className="font-bold text-purple-500">+R$ {drink.basePrice.toFixed(2)}</p>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4">
          <h4 className="font-bold text-neutral-900">precisa de talher?</h4>
          <small className="font-bold text-xs">escolha até 1</small>

          {cutleryCategory && (
            <div className="mt-4 space-y-4">
              <CustomRadioGroup
                items={cutleryItems}
                value={ticketProduct?.cutlery}
                onChange={(cutlery) => handleChangeRadio("cutlery", cutlery)}
              />
            </div>
          )}
        </div>
        <div className="p-4">
          <h4 className="font-bold text-neutral-900">mais alguma coisa?</h4>
          <small className="font-bold text-xs">escolha até 2</small>

          <div className="flex flex-col space-y-4 mt-4">
            {extraItems.map((extraItem) => (
              <CustomCheckbox
                key={extraItem.id}
                value={!!ticketProduct?.extra?.find((ticketAddon) => ticketAddon.name === extraItem.name)}
                onChange={(input) => handleToggleCheckbox(extraItem, input, "extra")}
                label={extraItem.name}
                basePrice={extraItem.basePrice}
              />
            ))}
          </div>
        </div>

        <div className="p-4">
          <textarea
            value={ticketProduct?.comment}
            onChange={handleOnChangeTextarea}
            className="w-full rounded-[4px] border border-neutral-200 p-3 text-sm font-semibold text-neutral-500"
            placeholder="alguma observação do item? • opcional ex: tirar algum ingrediente, ponto do prato"
          />
        </div>
      </div>
    </div>
  );
}
