import React, { useState } from "react";
import { UseAction } from "../hooks/UseAction";
import { InputImage } from "../Component/InputImage";
import { InputText } from "../Component/InputText";

export const FormType = ({ data, onSuccess, onClose }) => {
  const [skintype, setSkintype] = useState({
    type: data?.type ?? "",
  });
  const [files, setFiles] = useState({
    image: null,
  });
  const [imageError, setImageError] = useState({
    image: false,
  });
  const { handleSubmit, loading } = UseAction();
  const set = (key) => (e) =>
    setSkintype({ ...skintype, [key]: e.target?.value ?? e });

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
      endpoint: "/admin/skin-types",
      data: skintype,
      files: files,
      id: data?.id ?? null,
      onSuccess: () => {
        onSuccess?.();
        onClose?.();
      },
    });
  };

  return (
    <form
      onSubmit={HandleForm}
      className="space-y-4 max-h-[75vh] overflow-y-auto py-3 px-1.5 hide-scrollbar"
    >
      <InputText
        label="SkinType"
        value={skintype.type}
        onChange={set("type")}
        required
      />
      <InputImage
        label="Image"
        id="image"
        required={!data}
        hasError={imageError.image}
        onChange={(file) => {
          setFiles({ ...files, image: file });
          setImageError({ ...imageError, image: false });
        }}
      />
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
  );
};
