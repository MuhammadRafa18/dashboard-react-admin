import { useState } from "react";
import { RichTextEditor } from "../Component/RichTextEditor ";
import { UseAction } from "../hooks/UseAction";
import { UseFecth } from "../hooks/UseFecth";
import { InputImage } from "../Component/InputImage";
import { ButtonDelete } from "../Component/ButtonDelete";
import { MultiSelect } from "../Component/MultiSelect";
import { InputText } from "../Component/InputText";
import { InputSelect } from "../Component/InputSelect";
import { InputNominal } from "../Component/InputNominal";

export const FormProduk = ({ data, onSuccess, onClose }) => {
  const { handleSubmit, loading } = UseAction();
  const { Data: category } = UseFecth(`/category`);
  const { Data: skintype } = UseFecth(`/SkinTypes`);
  const detail = data?.product_sku?.detail;
  const isFashion = data?.category?.type === "fashion";
  const [form, setForm] = useState({
    title: data?.title ?? "",
    category_id: data?.category?.id ?? "",
    category_type: data?.category?.type ?? "",
    description: data?.description ?? "",
    price: data?.product_sku?.price ?? "",
    sell_price: data?.product_sku?.sell_price ?? "",
    stock: data?.product_sku?.stock ?? "",
    weight_gram: data?.product_sku?.weight_gram ?? "",
    size: data?.product_sku?.detail?.size ?? "",
    use_produk: data?.product_sku?.detail?.use_produk ?? "",
    ingredient: data?.product_sku?.detail?.ingredient ?? "",
    skin_type_id:
      data?.skin_type?.map((s) => ({ id: s.id, name: s.type })) ?? [],
    variants:
      isFashion && Array.isArray(detail)
        ? detail.map((v) => ({ id: v.id, color: v.color, size: v.size }))
        : [],
  });
  const [imageError, setImageError] = useState({
    image_produk: false,
    image_banner: false,
  });
  const [files, setFiles] = useState({
    image_produk: null,
    image_banner: null,
  });

  const HandleForm = async (e) => {
    e.preventDefault();
    if (!data) {
      const errors = {
        image: !files.image,
      };
      setImageError(errors);

      if (Object.values(errors).some(Boolean)) return;
    }
    await handleSubmit({
      endpoint: "/admin/products",
      data: form,
      files: files,
      skin_types: {
        skin_type_id: form.skin_type_id,
      },
      variants: form.variants,

      id: data?.id ?? null,
      onSuccess: () => {
        onSuccess?.();
        onClose?.();
      },
    });
  };
  const set = (key) => (e) => setForm({ ...form, [key]: e.target?.value ?? e });
  const categoryOptions =
    category?.data?.map((c) => ({
      value: c.id,
      label: c.category,
      type: c.type,
    })) ?? [];
  const SkinTypeOptions =
    skintype?.data?.map((c) => ({
      id: c.id,
      type: c.type,
    })) ?? [];

  return (
    <>
      <form
        onSubmit={HandleForm}
        className="space-y-4 max-h-[75vh] py-3 overflow-y-auto px-1.5 hide-scrollbar"
      >
        <InputImage
          label="Image Product"
          id="image_produk"
          required={!data}
          hasError={imageError.image_produk}
          onChange={(file) => {
            setFiles({ ...files, image_produk: file });
            setImageError({ ...imageError, image_produk: false });
          }}
        />

        <InputImage
          label="Image Banner"
          id="image_banner"
          required={!data}
          hasError={imageError.image_banner}
          onChange={(file) => {
            setFiles({ ...files, image_banner: file });
            setImageError({ ...imageError, image_banner: false });
          }}
        />

        {/* Title & Category */}
        <InputText
          label="Nama Produk"
          value={form.title}
          onChange={set("title")}
          required
        />

        <InputSelect
          label="Category"
          value={form.category_id}
          options={categoryOptions}
          placeholder="Pilih Category"
          required
          onChange={(val, selected) =>
            setForm((prev) => ({
              ...prev,
              category_id: selected?.value ?? "",
              category_type: selected?.type ?? "",
            }))
          }
        />

        {/* SKU */}
        <div className="flex gap-3 ">
          <InputNominal
            Rp="Rp"
            label="Price"
            value={form.price}
            onChange={set("price")}
          />
          <InputNominal
            Rp="Rp"
            label="Sell Price"
            value={form.sell_price}
            onChange={set("sell_price")}
          />
        </div>

        <div className="flex gap-3">
          <InputNominal
            label="Stock"
            value={form.stock}
            onChange={set("stock")}
            required
          />
          <InputNominal
            label="Weight (gram)"
            value={form.weight_gram}
            onChange={set("weight_gram")}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Deskripsi</label>
          <RichTextEditor
            value={form.description || data?.description || ""}
            onChange={(val) => setForm({ ...form, description: val })}
          />
        </div>

        {form?.category_type === "skincare" && (
          <div className="space-y-3">
            <InputText
              label="Size"
              value={form.size}
              onChange={set("size")}
              required
            />
            <MultiSelect
              label="Skintype"
              options={SkinTypeOptions}
              value={form.skin_type_id}
              onChange={(selected) =>
                setForm({ ...form, skin_type_id: selected })
              }
              placeholder="Cari category..."
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium">Use Produk</label>
              <RichTextEditor
                value={
                  form.use_produk || data?.product_sku?.detail?.use_produk || ""
                }
                onChange={(val) => setForm({ ...form, use_produk: val })}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium">Ingredient</label>
              <RichTextEditor
                value={
                  form.ingredient || data?.product_sku?.detail?.ingredient || ""
                }
                onChange={(val) => setForm({ ...form, ingredient: val })}
              />
            </div>
          </div>
        )}

        {form?.category_type === "fashion" && (
          <div className="space-y-3">
            <label className="text-sm font-medium">Variants</label>

            {form?.variants?.map((v, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Color"
                  className="bg-neutral-secondary-medium border border-default-medium text-heading
                  text-sm rounded-xl focus:ring-brand focus:border-brand block w-1/2 px-2 py-2 shadow-xs placeholder:text-body"
                  value={v.color}
                  onChange={(e) => {
                    const newVariants = [...form.variants];
                    newVariants[i].color = e.target.value;
                    setForm({ ...form, variants: newVariants });
                  }}
                />

                <input
                  type="text"
                  placeholder="Size"
                  className="bg-neutral-secondary-medium border border-default-medium text-heading
                  text-sm rounded-xl focus:ring-brand focus:border-brand block w-1/2 px-2 py-2 shadow-xs placeholder:text-body"
                  value={v.size}
                  onChange={(e) => {
                    const newVariants = [...form.variants];
                    newVariants[i].size = e.target.value;
                    setForm({ ...form, variants: newVariants });
                  }}
                />

                <ButtonDelete
                  onClick={() => {
                    const newVariants = form.variants.filter(
                      (_, idx) => idx !== i,
                    );
                    setForm({ ...form, variants: newVariants });
                  }}
                />
              </div>
            ))}

            <button
              type="button"
              className="text-blue-500 text-sm cursor-pointer"
              onClick={() => {
                setForm({
                  ...form,
                  variants: [...form.variants, { color: "", size: "" }],
                });
              }}
            >
              Tambah Variant
            </button>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-2 ">
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
    </>
  );
};
