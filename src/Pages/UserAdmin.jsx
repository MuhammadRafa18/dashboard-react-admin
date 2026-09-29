import React, { useContext } from "react";
import { UseFecth } from "../hooks/UseFecth";
import { ButtonCreate } from "../Component/ButtonCreate";
import { Table } from "../Component/Table";
import { ButtonUpdate } from "../Component/ButtonUpdate";
import { ButtonDelete } from "../Component/ButtonDelete";
import { UseAction } from "../hooks/UseAction";
import { PagesContext } from "../Store/PagesProvider";
import { Modal } from "../Component/Modal";
import { FormUserAdmin } from "../Form/FormUserAdmin";
import { UsePageMeta } from "../hooks/UsePageMeta";

export const UserAdmin = () => {
  UsePageMeta("User Admin", "Kelola akun admin yang memiliki akses ke dashboard.");
  const { Data, refetch } = UseFecth(`/admin/UserAdmin`);
  const { HandleDelete, HandleUpdate } = UseAction();
  const { isOpen, setIsOpen, selectedData, setSelectedData, currentPage } = useContext(PagesContext);
  const colums = [
    { key: "Nomor", label: "No", render: (_, index) => index + 1 },
    { key: "email", label: "email" },
    { key: "name", label: "name" },
    { key: "role", label: "role" },
    // {
    //   key: "profile_image",
    //   label: "profile image",
    //   render: (item) => (
    //     <img
    //       src={`http://localhost:8000/storage/${item.profile_image}`}
    //       alt=""
    //       className="w-10 mx-auto"
    //     />
    //   ),
    // },
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
            onClick={() => HandleDelete(`/admin/UserAdmin`, item.id, refetch)}
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
          text={"Create User"}
          onClick={() => {
            setSelectedData(null);
            setIsOpen(true);
          }}
        />
      </div>
      <Table colums={colums} Data={Data} />
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={selectedData ? "Edit Produk" : "Create Produk"}
      >
        <FormUserAdmin
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
