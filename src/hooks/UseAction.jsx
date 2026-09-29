import { useNavigate } from "react-router";
import axiosInstance from "../services/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

export const UseAction = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const getErrorMessage = (errObj) => {
    if (!errObj) return null;

    if (typeof errObj === "string") return errObj;

    if (Array.isArray(errObj)) {
      return getErrorMessage(errObj[0]);
    }

    if (typeof errObj === "object") {
      return getErrorMessage(Object.values(errObj)[0]);
    }
    return null;
  };
  const handleSubmit = async ({
    endpoint,
    data = {},
    files = {},
    variants = [],
    powers = [],
    skin_types = [],
    id = null,
    onSuccess,
  }) => {
    if (loading) return;
    setLoading(true);
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value ?? "");
      });

      Object.entries(skin_types).forEach(([key, arr]) => {
        arr.forEach((item) => {
          formData.append(
            `${key}[]`,
            typeof item === "object" ? item.id : item,
          );
        });
      });

      if (Array.isArray(variants) && variants.length > 0) {
        variants.forEach((variant, index) => {
          if (variant.id) formData.append(`variants[${index}][id]`, variant.id);
          formData.append(`variants[${index}][size]`, variant.size ?? "");
          formData.append(`variants[${index}][color]`, variant.color ?? "");
        });
      }
      if (Array.isArray(powers) && powers.length > 0) {
        powers.forEach((power, index) => {
          if (power.id) formData.append(`powers[${index}][id]`, power.id);
          formData.append(`powers[${index}][label]`, power.label ?? "");
          if (power.icon instanceof File) {
            formData.append(`powers[${index}][icon]`, power.icon);
          }
        });
      }

      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      if (id) formData.append("_method", "PUT");

      const url = id ? `${endpoint}/${id}` : endpoint;

      await axiosInstance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(
        id ? "Data Successfully to update" : "Data Successfully to save",
      );
      onSuccess?.();
    } catch (err) {
      const res = err.response;

      if (!res) {
        toast.error("Server tidak merespon");
        return;
      }

      if (res.data?.errors) {
        const message = getErrorMessage(res.data.errors);
        toast.error(message || "Terjadi kesalahan");
        return;
      }

      const message =
        getErrorMessage(res.data) ||
        res.data?.message ||
        res.data?.error ||
        "Terjadi kesalahan";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const HandleUpdate = (path, id) => {
    navigate(`/${path}/${id}`);
  };

  const HandleDelete = async (endpoint, id, refetch) => {
    if (loading) return;
    if (confirm("Hapus Data?")) {
      setLoading(true);
      try {
        await axiosInstance.delete(`${endpoint}/${id}`);
        toast.success("Successfully Delete!");
        refetch();
      } catch (err) {
        toast.error("Failed to Delete");
        alert(err.message);
        refetch();
      } finally {
        setLoading(false);
      }
    }
  };
  const HandleToggle = async (endpoint, id, currentStatus, refetch) => {
    if (loading) return;
    setLoading(true);

    try {
      await axiosInstance.patch(`${endpoint}/${id}`, {
        is_active: !currentStatus,
      });
      toast.success("Successfully Update Status!");
      refetch();
    } catch (err) {
      toast.error("Failed to Update Status");
      refetch();
    } finally {
      setLoading(false);
    }
  };
  const HandleStatus = async (endpoint, id, data, refetch) => {
    if (loading) return;
    setLoading(true);

    try {
      await axiosInstance.patch(`${endpoint}/${id}`, data);
      toast.success("Successfully Update Status!");
      refetch?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to Update Status");
    } finally {
      setLoading(false);
    }
  };
  return { HandleUpdate, HandleDelete, HandleToggle, HandleStatus, handleSubmit };
};
