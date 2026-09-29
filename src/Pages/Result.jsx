import React, { useContext } from "react";
import { UseFecth } from "../hooks/UseFecth";
import { useNavigate } from "react-router";
import { PagesContext } from "../Store/PagesProvider";
import { ButtonUpdate } from "../Component/ButtonUpdate";
import { ButtonDelete } from "../Component/ButtonDelete";
import { Table } from "../Component/Table";
import { UseAction } from "../hooks/UseAction";
import { ButtonCreate } from "../Component/ButtonCreate";
import { Modal } from "../Component/Modal";
import { FormResult } from "../Form/FormResult";
import { UsePageMeta } from "../hooks/UsePageMeta";

export const Result = () => {
  UsePageMeta("Result", "Kelola hasil dan konten rekomendasi yang ditampilkan kepada pelanggan.");
  const { isOpen, setIsOpen, selectedData, setSelectedData, currentPage } =
    useContext(PagesContext);
  const { Data, refetch } = UseFecth(`/result`);
  const { HandleDelete, HandleUpdate } = UseAction();
  const colums = [
    {
      key: "Nomor",
      label: "No",
      render: (_, index) => (Data?.meta?.from || 1) + index,
    },
    {
      key: "result",
      label: "result",
      render: (item) => (
        <img
          src={`http://localhost:8000/storage/${item.result}`}
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
            onClick={() => HandleDelete(`admin/result`, item.id, refetch)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-end space-y-4 md:space-y-6 lg:space-y-8 py-8 relative overflow-x-auto  ">
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900">{currentPage.title}</h1>
          {currentPage.description && (
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{currentPage.description}</p>
          )}
        </div>
        <ButtonCreate
          text={"Create result"}
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
        title={selectedData ? "Edit Result" : "Create Result"}
      >
        <FormResult
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
