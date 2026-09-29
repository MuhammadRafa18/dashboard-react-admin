import { useNavigate } from "react-router";
import { UseFecth } from "../hooks/UseFecth";
import { ButtonCreate } from "../Component/ButtonCreate";
import { Table } from "../Component/Table";
import { ButtonUpdate } from "../Component/ButtonUpdate";
import { ButtonDelete } from "../Component/ButtonDelete";
import { UseAction } from "../hooks/UseAction";
import { PagesContext } from "../Store/PagesProvider";
import { useContext, useState } from "react";
import { Modal } from "../Component/Modal";
import { FormType } from "../Form/FormType";
import { UsePageMeta } from "../hooks/UsePageMeta";

export const Type = () => {
  UsePageMeta("Type", "Kelola tipe kulit yang digunakan pada informasi produk dan rekomendasi.");
  const [page, setPage] = useState(1);
  const { Data, refetch } = UseFecth(`/skin-types?page=${page}`);
  const { isOpen, setIsOpen, selectedData, setSelectedData, currentPage } = useContext(PagesContext);
    useContext(PagesContext);
  const { HandleUpdate, HandleDelete } = UseAction();
  const colums = [
    {
      key: "Nomor",
      label: "No",
      render: (_, index) => (Data?.meta?.from || 1) + index,
    },
    { key: "type", label: "Type" },
    {
      key: "image",
      label: "Image",
      render: (item) => {
        if (!item.image) {
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
              src={`${import.meta.env.VITE_STORAGE_URL}/${item.image}`}
              alt={item.title || "Product"}
              className="w-10 h-10 rounded-lg object-cover border border-gray-200"
            />
          </div>
        );
      },
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
            onClick={() => HandleDelete(`admin/skin-types`, item.id, refetch)}
          />
        </div>
      ),
    },
  ];
  return (
    <div className="flex flex-col items-end space-y-4 md:space-y-6 lg:space-y-8 py-8 relative overflow-x-auto ">
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900">{currentPage.title}</h1>
          {currentPage.description && (
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{currentPage.description}</p>
          )}
        </div>
        <ButtonCreate
          text={"Create Type"}
          onClick={() => {
            setSelectedData(null);
            setIsOpen(true);
          }}
        />
      </div>
      <Table colums={colums} Data={Data} page={page} setPage={setPage} />
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={selectedData ? "Edit Type" : "Create Type"}
      >
        <FormType
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
