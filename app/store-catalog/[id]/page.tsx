import getStore from "@/mock/get-store.json";

interface IProps {
  params: Promise<{ id: string }>;
}

export default async function StoreCatalog(props: IProps) {
  const { id } = await props.params;

  const store = getStore.store;

  console.log({ store });

  return (
    <>
      {store.name} {id}
    </>
  );
}
