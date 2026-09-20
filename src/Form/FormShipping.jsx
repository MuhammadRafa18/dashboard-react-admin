import { useState } from "react";
import { InputSelect } from "../Component/InputSelect";
import { InputText } from "../Component/InputText";
import { UseAction } from "../hooks/UseAction";
import { UseFecth } from "../hooks/UseFecth";

export const FormShipping = ({ data, onSuccess, onClose }) => {
  const { Data: zones } = UseFecth("/shippingZone");
  const { handleSubmit, loading } = UseAction();
  const [shipping, setShipping] = useState({
    shipping_zone_id: data?.shipping_zone_id ?? data?.shipping_zone?.id ?? "",
    region: data?.region ?? "",
    estimasi_min_day: data?.estimasi_min_day ?? "",
    estimasi_max_day: data?.estimasi_max_day ?? "",
  });

  const zoneOptions =
    zones?.data?.map((zone) => ({ value: zone.id, label: zone.name })) ?? [];

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    await handleSubmit({
      endpoint: "/admin/shippingZone",
      data: shipping,
      id: data?.id ?? null,
      onSuccess: () => {
        onSuccess?.();
        onClose?.();
      },
    });
  };

  const setValue = (key) => (value) =>
    setShipping((prev) => ({ ...prev, [key]: value }));

  return (
    <form
      onSubmit={handleSubmitForm}
      className="space-y-4 max-h-[75vh] overflow-y-auto py-3 px-1.5 hide-scrollbar"
    >
      <InputSelect
        label="Shipping Zone"
        value={shipping.shipping_zone_id}
        options={zoneOptions}
        placeholder="Pilih shipping zone"
        required
        onChange={(_, selected) =>
          setShipping((prev) => ({
            ...prev,
            shipping_zone_id: selected?.value ?? "",
          }))
        }
      />
      <InputText label="Region" value={shipping.region} onChange={setValue("region")} required />
      <div className="grid grid-cols-2 gap-3">
        <InputText
          label="Estimasi Minimum (hari)"
          value={shipping.estimasi_min_day}
          onChange={setValue("estimasi_min_day")}
          required
        />
        <InputText
          label="Estimasi Maksimum (hari)"
          value={shipping.estimasi_max_day}
          onChange={setValue("estimasi_max_day")}
          required
        />
      </div>
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
