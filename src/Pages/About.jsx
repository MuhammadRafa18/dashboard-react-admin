import { UseFecth } from "../hooks/UseFecth";
import { Table } from "../Component/Table";
import { ButtonCreate } from "../Component/ButtonCreate";
import { ButtonUpdate } from "../Component/ButtonUpdate";
import { ButtonDelete } from "../Component/ButtonDelete";
import { PagesContext } from "../Store/PagesProvider";
import { useContext } from "react";
import { Modal } from "../Component/Modal";
import { FormAbout } from "../Form/FormAbout";
import { UseAction } from "../hooks/UseAction";
import { UsePageMeta } from "../hooks/UsePageMeta";

export const About = () => {
  UsePageMeta("About", "Kelola informasi profil dan konten tentang toko.");
  const { isOpen, setIsOpen, selectedData, setSelectedData, currentPage } =
    useContext(PagesContext);
  const { Data, refetch } = UseFecth(`/admin/about`);
  const { HandleDelete } = UseAction();

  const colums = [
    {
      key: "headline",
      label: "headline",
    },
    {
      key: "title",
      label: "title",
    },
    {
      key: "subtitle",
      label: "subtitle",
    },
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
            onClick={() => HandleDelete(`admin/about`, item.id, refetch)}
          />
        </div>
      ),
    },
  ];
  return (
    <div className="relative flex flex-col space-y-4 overflow-x-auto py-8 md:space-y-6 lg:space-y-8">
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900">{currentPage.title}</h1>
          {currentPage.description && (
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{currentPage.description}</p>
          )}
        </div>
        {Data?.length === 0 && (
          <ButtonCreate
            text="Create About"
            onClick={() => {
              setSelectedData(null);
              setIsOpen(true);
            }}
          />
        )}
      </div>

      <Table colums={colums} Data={Data} />
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={selectedData ? "Edit About" : "Create About"}
      >
        <FormAbout
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
