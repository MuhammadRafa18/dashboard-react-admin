import React, { useContext } from "react";
import { PagesContext } from "../Store/PagesProvider";
import { UseFecth } from "../hooks/UseFecth";
import { ButtonCreate } from "../Component/ButtonCreate";
import { UseAction } from "../hooks/UseAction";
import { ButtonUpdate } from "../Component/ButtonUpdate";
import { ButtonDelete } from "../Component/ButtonDelete";
import { Table } from "../Component/Table";
import { Modal } from "../Component/Modal";
import { FormFaq } from "../Form/FormFaq";
import { UsePageMeta } from "../hooks/UsePageMeta";

export const Faq = () => {
  UsePageMeta("FAQ", "Kelola kategori pertanyaan yang sering diajukan pelanggan.");
  const { isOpen, setIsOpen, selectedData, setSelectedData, currentPage } =
    useContext(PagesContext);
  const { Data, refetch } = UseFecth(`/Faq_category`);
  const { HandleDelete, HandleUpdate } = UseAction();
  const colums = [
    {
      key: "category",
      label: "category Faq",
    },
    {
      key: "Actions",
      label: "Action",
      render: (item) => (
        <div className="flex items-center justify-center space-x-2">
          <ButtonUpdate onClick={() => {setSelectedData(item); setIsOpen(true)}} />
          <ButtonDelete
            onClick={() => HandleDelete(`admin/Faq_category`,item.id , refetch)}
          />
        </div>
      ),
    },
  ];
  return (
    <div className="flex flex-col items-end space-y-4 md:space-y-6 lg:space-y-8 py-8 relative overflow-x-auto">
      <div className="flex flex-col items-end space-y-4 md:space-y-6 lg:space-y-8 py-8 relative overflow-x-auto">
       <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900">{currentPage.title}</h1>
          {currentPage.description && (
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{currentPage.description}</p>
          )}
        </div>
      <ButtonCreate
        text={"Create Faq Category"}
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
        title={selectedData ? "Edit Category Faq" : "Create Category Faq"}
      >
        <FormFaq
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
