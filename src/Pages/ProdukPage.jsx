import React, { useContext, useState } from "react";
import { UseFecth } from "../hooks/UseFecth";
import { Table } from "../Component/Table";
import { ButtonUpdate } from "../Component/ButtonUpdate";
import { ButtonDelete } from "../Component/ButtonDelete";
import { UseAction } from "../hooks/UseAction";
import { ButtonToggle } from "../Component/ButtonToggle";
import { Modal } from "../Component/Modal";
import { FormProduk } from "../Form/FormProduk";
import { ButtonCreate } from "../Component/ButtonCreate";
import { PagesContext } from "../Store/PagesProvider";

export const ProdukPage = () => {
  const [page, setPage] = useState(1);
  const { Data, refetch } = UseFecth(`/products?page=${page}`);
  const { HandleDelete, HandleToggle } = UseAction();
  const { isOpen, setIsOpen, selectedData, setSelectedData, showConfirmModal,
    setShowConfirmModal, selectedItem, setSelectedItem, toggleConfig, setToggleConfig } =
    useContext(PagesContext);
  const colums = [
    {
      key: "Nomor",
      label: "No",
      render: (_, index) => (Data?.meta?.from || 1) + index,
    },
    {
      key: "image_banner",
      label: "Image Banner",
      render: (item) => {
        if (!item.image_banner) {
          return (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7a2 2 0 012-2h3l2-2h4l2 2h3a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                  />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
            </div>
          );
        }

        return (
          <div className="flex justify-center">
            <img
              src={`${import.meta.env.VITE_STORAGE_URL}/${item.image_banner}`}
              alt={item.title || "Product"}
              className="w-10 h-10 rounded-lg object-cover border border-gray-200"
            />
          </div>
        );
      },
    },

    {
      key: "title",
      label: "Title",
    },

    {
      key: "price",
      label: "Price",
      render: (item) =>
        item.product_sku?.price ? item.product_sku.price.toLocaleString() : "-",
    },

    {
      key: "size",
      label: "Size",
      render: (item) => item.product_sku?.detail?.size ?? "-",
    },

    {
      key: "stok",
      label: "Stock",
      render: (item) => item.product_sku?.stock ?? "-",
    },
    {
      key: "is_active",
      label: "Status",
      render: (item) => (
        <ButtonToggle
          isActive={item.is_active}
          onClick={() => {
            if (item.is_active) {
              setSelectedItem(item);
              setToggleConfig({
                endpoint: "/admin/products",
                id: item.id,
                isActive: item.is_active,
                refetch: refetch,
              });
              setShowConfirmModal(true);
              return;
            }
            HandleToggle(`/admin/products`, item.id, item.is_active, refetch)
          }
          }
        />
      ),
    },

    {
      key: "Actions",
      label: "Action",
      render: (item) => (
        <div className="flex items-center justify-center space-x-2">
          <ButtonUpdate
            onClick={() => {
              setSelectedData(item);
              setIsOpen(true);
            }}
          />
          <ButtonDelete
            onClick={() => HandleDelete(`/admin/products`, item.id, refetch)}
          />
        </div>
      ),
    },
  ];

  return (

    <div className="flex flex-col items-end space-y-4 md:space-y-6 lg:space-y-8 py-8 relative overflow-x-auto">
      <ButtonCreate
        onClick={() => {
          setSelectedData(null);
          setIsOpen(true);
        }}
        text={"Create Product"}
      />

      <Table
        colums={colums}
        Data={Data}
        filters={["skincare", "fashion"]}
        page={page}
        setPage={setPage}
      />
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={selectedData ? "Edit Produk" : "Create Produk"}
      >
        <FormProduk
          data={selectedData}
          onClose={() => setIsOpen(false)}
          onSuccess={() => {
            setIsOpen(false);
            refetch();
          }}
        />
      </Modal>
    </div>

  );
};
