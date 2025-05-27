"use client";

import { createContext, type ReactNode, use, useEffect, useState } from "react";
import { isValid } from "@/utils/isValid";
import { randomID } from "@/utils/randomID";

export type subProduct = {
  name: string;
  basePrice: number;
  price?: number;
  quantity?: number;
};

export interface ITicketStore {
  id: string;
  logo: string;
  name: string;
  ticketProducts: string[];
}

export interface ITicketProduct {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  addons: subProduct[];

  variant?: subProduct;
  comment?: string;
  cutlery?: subProduct;
  drinks?: subProduct[];
  extra?: subProduct[];
}

type TicketContextType = {
  products: ITicketProduct[];
  subtotal: number;
  stores: ITicketStore[];
  addProduct: (
    product: Omit<ITicketProduct, "id" | "price">,
    store: Omit<ITicketStore, "ticketProducts">
  ) => ITicketProduct;
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
  const [stores, setStores] = useState<ITicketStore[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);

  function addProduct(product: Omit<ITicketProduct, "id" | "price">, store: Omit<ITicketStore, "ticketProducts">) {
    const handledProductPrice = _getProductPrice(product);

    const newProduct = {
      ...product,
      id: `ticket-product-${randomID(3)}`,
      price: handledProductPrice,
    };

    setProducts((state) => {
      const newProducts = [...state, newProduct];

      const newSubtotal = _getSubtotal(newProducts);

      setSubtotal(newSubtotal);

      const hasStore = !!stores.find((stateStore) => stateStore.id === store.id);
      let newStores: ITicketStore[];

      if (hasStore) {
        newStores = stores.map((stateStore) => ({
          ...stateStore,
          ticketProducts:
            store.id === stateStore.id ? [...stateStore.ticketProducts, newProduct.id] : stateStore.ticketProducts,
        }));
      } else {
        newStores = [
          ...stores,
          {
            ...store,
            ticketProducts: [newProduct.id],
          },
        ];
      }

      setStores(newStores);

      // sync with storage
      _setInStorage({ products: newProducts, subtotal: newSubtotal, stores: newStores });

      return newProducts;
    });

    return newProduct;
  }

  function removeProduct(productId: string) {
    setProducts((stateProducts) => {
      const filteredProducts = stateProducts.filter((product) => product.id !== productId);

      const newSubtotal = _getSubtotal(filteredProducts);

      setSubtotal(newSubtotal);

      const chosenStore = stores.find((store) => store.ticketProducts.includes(productId));
      let updatedStores: ITicketStore[];

      if (chosenStore && chosenStore.ticketProducts.length === 1) {
        // remove do stores
        updatedStores = stores.filter((store) => store.id !== chosenStore.id);
      } else {
        updatedStores = stores.map((store) => ({
          ...store,
          ticketProducts: store.ticketProducts.filter((ticketProduct) => ticketProduct !== productId),
        }));
      }

      setStores(updatedStores);

      // sync with storage
      _setInStorage({ products: filteredProducts, subtotal: newSubtotal, stores: updatedStores });

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
      _setInStorage({ products: updatedProducts, subtotal: updatedSubtotal, stores });

      return updatedProducts;
    });
  }

  function _getProductPrice({
    quantity: multiplier,
    variant,
    addons,
    cutlery,
    drinks,
    extra,
  }: Omit<ITicketProduct, "id" | "price">) {
    const addonsPrice = addons.reduce((prev, addon) => prev + addon.basePrice, 0);

    let variantPrice = 0;
    let cutleryPrice = 0;
    let drinksPrice = 0;
    let extraPrice = 0;

    if (isValid(variant)) {
      variantPrice = variant.price ? variant.price : variant.basePrice;
    }

    if (isValid(cutlery)) {
      cutleryPrice = cutlery.basePrice;
    }

    if (isValid(drinks)) {
      drinksPrice = drinks.reduce((prev, drink) => prev + drink.basePrice * (drink.quantity ?? 1), 0);
    }
    if (isValid(extra)) {
      extraPrice = extra.reduce((prev, extra) => prev + extra.basePrice, 0);
    }

    return multiplier * variantPrice + addonsPrice + cutleryPrice + drinksPrice + extraPrice;
  }

  function _getSubtotal(products: ITicketProduct[]) {
    return products.reduce((prev, product) => prev + product.price, 0);
  }

  function _setInStorage(payload: { products: ITicketProduct[]; subtotal: number; stores: ITicketStore[] }) {
    localStorage.setItem("aiqfome-ticket", JSON.stringify(payload));
  }

  useEffect(() => {
    const storageTicket = localStorage.getItem("aiqfome-ticket");

    if (storageTicket) {
      const { products, subtotal, stores }: { products: ITicketProduct[]; subtotal: number; stores: ITicketStore[] } =
        JSON.parse(storageTicket);

      setProducts(products);
      setSubtotal(subtotal);
      setStores(stores);
    }
  }, []);

  return (
    <TicketContext value={{ products, addProduct, removeProduct, updateProduct, subtotal, stores }}>
      {children}
    </TicketContext>
  );
}

export function useTicketCtx() {
  const ctx = use(TicketContext);

  if (!ctx) {
    throw new Error("Must be used inside a TicketCtxProvider.");
  }

  return ctx;
}
