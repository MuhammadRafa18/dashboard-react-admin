import React, { useContext } from "react";
import { UseFecth } from "../hooks/UseFecth";

import { ButtonCreate } from "../Component/ButtonCreate";
import { Table } from "../Component/Table";
import { ButtonUpdate } from "../Component/ButtonUpdate";
import { ButtonDelete } from "../Component/ButtonDelete";
import { UseAction } from "../hooks/UseAction";
import { PagesContext } from "../Store/PagesProvider";
import { Modal } from "../Component/Modal";
import { FormDetailFaq } from "../Form/FormDetailFaq";
import { UsePageMeta } from "../hooks/UsePageMeta";

export const DetailFaq = () => {
  UsePageMeta("Detail FAQ", "Kelola pertanyaan dan jawaban di setiap kategori FAQ.");
  const { isOpen, setIsOpen, selectedData, setSelectedData, currentPage } =
    useContext(PagesContext);
  const { Data, refetch } = UseFecth(`/DetailFaq`);
  const stripHtml = (html) => html?.replace(/<[^>]*>/g, "") ?? "-";
  const { HandleDelete, HandleUpdate } = UseAction();
  const colums = [
    
    {
      key: "faq_category",
      label: "category ",
      render: (item) => item.faq_category?.category ?? null,
    },
    {
      key: "quest",
      label: "quest ",
    },
    {
      key: "answer",
      label: "Answer",
      render: (item) => (
        <span className=" truncate block ">
          {stripHtml(item.answer)}
        </span>
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
            onClick={() => HandleDelete(`admin/DetailFaq`, item.id, refetch)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-end space-y-4 md:space-y-6 lg:space-y-8 py-8 relative overflow-x-auto">
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
       <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900">{currentPage.title}</h1>
          {currentPage.description && (
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{currentPage.description}</p>
          )}
        </div>
      <ButtonCreate
        text={"Create Detail Faq"}
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
        title={selectedData ? "Edit Detail Faq" : "Create Detail Faq"}
      >
        <FormDetailFaq
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
