import { createContext, type ReactNode, use, useState } from "react";
import { randomUUID } from "node:crypto";

interface IProduct {
  id: string;
  quantity: number;
  price: number;
  size: {
    name: string;
    price: number;
    onSalePrice?: number;
  };
  sideDishes: string[];
  drinks?: {
    name: string;
    price: string;
    quantity: number;
  }[];
  cutlery?: string;
  extra?: string[];
  comment?: string;
}

type TicketContextType = {
  products: IProduct[];
  subtotal: number;
  addProduct: (product: Omit<IProduct, "id" & "price">) => void;
  updateProduct: (productId: string, payload: Partial<IProduct>) => void;
  removeProduct: (productId: string) => void;
};

const TicketContext = createContext<TicketContextType>({} as TicketContextType);

export function TicketCtxProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);

  function addProduct(product: Omit<IProduct, "id">) {
    setProducts((state) => [
      ...state,
      {
        id: randomUUID(),
        ...product,
      },
    ]);

    const handledProductPrice = product.size.onSalePrice ? product.size.onSalePrice : product.size.price;

    setSubtotal((state) => state + handledProductPrice);
  }

  function removeProduct(productId: string) {
    setProducts((state) => {
      const filteredProducts = state.filter((product) => product.id !== productId);
      const productToBeRemoved = filteredProducts.find((product) => product.id === productId);

      if (productToBeRemoved) {
        setSubtotal((state) => state - productToBeRemoved.price);
      }

      return filteredProducts;
    });
  }

  function updateProduct(productId: string, payload: Partial<IProduct>) {
    setProducts((state) =>
      state.map((product) =>
        product.id === productId
          ? {
              ...product,
              ...payload,
              id: product.id,
            }
          : product
      )
    );
  }

  // TODO: CRUD no localStorage

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
