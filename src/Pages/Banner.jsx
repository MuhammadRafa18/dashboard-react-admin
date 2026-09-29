import React, { useContext } from "react";
import { PagesContext } from "../Store/PagesProvider";

import { UseFecth } from "../hooks/UseFecth";
import { UseAction } from "../hooks/UseAction";
import { ButtonUpdate } from "../Component/ButtonUpdate";
import { ButtonDelete } from "../Component/ButtonDelete";
import { ButtonCreate } from "../Component/ButtonCreate";
import { Table } from "../Component/Table";
import { Modal } from "../Component/Modal";
import { FormBanner } from "../Form/FormBanner";
import { UsePageMeta } from "../hooks/UsePageMeta";

export const Banner = () => {
  UsePageMeta("Banner", "Kelola banner promosi yang ditampilkan di halaman toko.");
  const { isOpen, setIsOpen, selectedData, setSelectedData, currentPage } =
    useContext(PagesContext);
  const { Data, refetch } = UseFecth(`/banner`);

  const { HandleDelete } = UseAction();
  const colums = [
    {
      key: "Nomor",
      label: "No",
      render: (_, index) => (Data?.meta?.from || 1) + index,
    },
    {
      key: "banner",
      label: "banner",
      render: (item) => (
        <img
          src={`http://localhost:8000/storage/${item.banner}`}
          alt=""
          className="w-10 mx-auto"
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
            onClick={() => HandleDelete(`admin/banner`, item.id, refetch)}
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
        <ButtonCreate
          text="Create Banner"
          onClick={() => {
            setSelectedData(null);
            setIsOpen(true);
          }}
        />
      </div>
      <Table colums={colums} Data={Data}></Table>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={selectedData ? "Edit Banner" : "Create Banner"}
      >
        <FormBanner
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
