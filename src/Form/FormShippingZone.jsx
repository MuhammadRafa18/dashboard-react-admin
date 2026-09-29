import { useState } from "react";
import { InputNominal } from "../Component/InputNominal";
import { InputText } from "../Component/InputText";
import { UseAction } from "../hooks/UseAction";

export const FormShippingZone = ({ data, onSuccess, onClose }) => {
  const { handleSubmit, loading } = UseAction();
  const [shippingZone, setShippingZone] = useState({
    name: data?.name ?? "",
    price: data?.price ?? "",
  });
  const handleSubmitForm = async (event) => {
    event.preventDefault();
    await handleSubmit({
      endpoint: "/admin/shippingZone",
      data: shippingZone,
      id: data?.id ?? null,
      onSuccess: () => {
        onSuccess?.();
        onClose?.();
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmitForm}
      className="space-y-4 max-h-[75vh] overflow-y-auto py-3 px-1.5 hide-scrollbar"
    >
      <InputText
        label="Nama Zone"
        value={shippingZone.name}
        onChange={(name) => setShippingZone((prev) => ({ ...prev, name }))}
        required
      />
      <InputNominal
        label="Harga Ongkir"
        value={shippingZone.price}
        onChange={(price) => setShippingZone((prev) => ({ ...prev, price }))}
        Rp="Rp"
        required
      />
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-black text-white py-2 rounded-full text-sm cursor-pointer"
        >
          {data ? "Update" : "Simpan"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 border border-black py-2 rounded-full text-sm cursor-pointer"
        >
          Batal
        </button>
      </div>
    </form>
  );
};
