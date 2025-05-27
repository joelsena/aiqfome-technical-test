import { Trash2, CirclePlus, CircleMinus } from "lucide-react";

interface IProps {
  count: number;
  onUpdate: (count: number) => void;
}

export function AddRemoveCounter({ count, onUpdate }: IProps) {
  return (
    <div className="flex items-center gap-4 text-teal-400">
      {count === 1 ? (
        <Trash2 strokeWidth={1.5} className="size-6" onClick={() => onUpdate(count - 1)} />
      ) : (
        <CircleMinus
          strokeWidth={1.5}
          className="size-6 fill-neutral-100 text-neutral-400"
          onClick={() => onUpdate(count - 1)}
        />
      )}
      <small className="font-bold text-neutral-700">{count}</small>
      <CirclePlus strokeWidth={1.5} className="size-6" onClick={() => onUpdate(count + 1)} />
    </div>
  );
}
