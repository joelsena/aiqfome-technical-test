"use client";

import { createContext, type ReactNode, use, useEffect, useState } from "react";
import { randomUUID } from "node:crypto";
import { isValid } from "@/utils/isValid";

export type subProduct = {
  name: string;
  price: number;
  onSalePrice?: number;
  quantity?: number;
};

export interface ITicketProduct {
  id: string;
  quantity: number;
  price: number;
  sideDishes: subProduct[];
  size: subProduct;

  comment?: string;
  cutlery?: subProduct;
  drinks?: subProduct[];
  extra?: subProduct[];
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  sizes: subProduct[];
  sideDishes: string[];
  drinks?: subProduct[];
  cutlery?: subProduct[];
  extra?: subProduct[];
}

type TicketContextType = {
  products: ITicketProduct[];
  subtotal: number;
  addProduct: (product: Omit<ITicketProduct, "id" | "price">) => void;
  updateProduct: (productId: string, payload: Partial<ITicketProduct>) => void;
  removeProduct: (productId: string) => void;
};

const TicketContext = createContext<TicketContextType>({} as TicketContextType);

export function TicketCtxProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [products, setProducts] = useState<ITicketProduct[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);

  function addProduct(product: Omit<ITicketProduct, "id" | "price">) {
    const handledProductPrice = _getProductPrice(product);

    setProducts((state) => {
      const newProducts = [
        ...state,
        {
          ...product,
          id: randomUUID(),
          price: handledProductPrice,
        },
      ];

      const newSubtotal = _getSubtotal(newProducts);

      setSubtotal(newSubtotal);

      // sync with storage
      _setInStorage({ products: newProducts, subtotal: newSubtotal });

      return newProducts;
    });
  }

  function removeProduct(productId: string) {
    setProducts((state) => {
      const filteredProducts = state.filter((product) => product.id !== productId);

      const newSubtotal = _getSubtotal(filteredProducts);

      setSubtotal(newSubtotal);

      // sync with storage
      _setInStorage({ products: filteredProducts, subtotal: newSubtotal });

      return filteredProducts;
    });
  }

  function updateProduct(productId: string, payload: Partial<ITicketProduct>) {
    setProducts((state) => {
      const updatedProducts = state.map((product) => {
        let updatedProduct = product;

        if (product.id === productId) {
          updatedProduct = {
            ...product,
            ...payload,
            id: product.id,
          };

          updatedProduct.price = _getProductPrice(updatedProduct); // recalculate
        }

        return updatedProduct;
      });

      // recalculate subtotal
      const updatedSubtotal = _getSubtotal(updatedProducts);

      // update subtotal state
      setSubtotal(updatedSubtotal);

      // sync with storage
      _setInStorage({ products: updatedProducts, subtotal: updatedSubtotal });

      return updatedProducts;
    });
  }

  function _getProductPrice({
    quantity: multiplier,
    size,
    sideDishes,
    cutlery,
    drinks,
    extra,
  }: Omit<ITicketProduct, "id" | "price">) {
    const sizePrice = size.onSalePrice ? size.onSalePrice : size.price;
    const sideDishesPrice = sideDishes.reduce((prev, dish) => prev + dish.price, 0);

    let cutleryPrice = 0;
    let drinksPrice = 0;
    let extraPrice = 0;

    if (isValid(cutlery)) {
      cutleryPrice = cutlery.price;
    }
    if (isValid(drinks)) {
      drinksPrice = drinks.reduce((prev, drink) => prev + drink.price, 0);
    }
    if (isValid(extra)) {
      extraPrice = extra.reduce((prev, extra) => prev + extra.price, 0);
    }

    return multiplier * (sizePrice + sideDishesPrice + cutleryPrice + drinksPrice + extraPrice);
  }

  function _getSubtotal(products: ITicketProduct[]) {
    return products.reduce((prev, product) => prev + product.price, 0);
  }

  function _setInStorage(payload: { products: ITicketProduct[]; subtotal: number }) {
    localStorage.setItem("aiqfome-ticket", JSON.stringify(payload));
  }

  useEffect(() => {
    const storageTicket = localStorage.getItem("aiqfome-ticket");

    if (storageTicket) {
      const { products, subtotal }: { products: ITicketProduct[]; subtotal: number } = JSON.parse(storageTicket);

      setProducts(products);
      setSubtotal(subtotal);
    }
  }, []);

  return (
    <TicketContext value={{ products, addProduct, removeProduct, updateProduct, subtotal }}>{children}</TicketContext>
  );
}

export function useTicketCtx() {
  const ctx = use(TicketContext);

  if (!ctx) {
    throw new Error("Must be used inside a TicketCtxProvider.");
  }

  return ctx;
}
