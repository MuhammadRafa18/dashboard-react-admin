import { useContext, useState } from "react";
import { ButtonCreate } from "../Component/ButtonCreate";
import { ButtonDelete } from "../Component/ButtonDelete";
import { ButtonUpdate } from "../Component/ButtonUpdate";
import { Modal } from "../Component/Modal";
import { Table } from "../Component/Table";
import { FormShipping } from "../Form/FormShipping";
import { UseAction } from "../hooks/UseAction";
import { UseFecth } from "../hooks/UseFecth";
import { PagesContext } from "../Store/PagesProvider";
import { UsePageMeta } from "../hooks/UsePageMeta";

export const Shipping = () => {
  UsePageMeta("Shipping", "Kelola pilihan dan informasi layanan pengiriman.");
  const [page, setPage] = useState(1);
  const { Data, refetch } = UseFecth(`/shippingZone?page=${page}`);
  const { HandleDelete } = UseAction();
  const { isOpen, setIsOpen, selectedData, setSelectedData, currentPage } = useContext(PagesContext);

  const colums = [
    { key: "number", label: "No", render: (_, index) => (Data?.meta?.from || 1) + index },
    { key: "shipping_zone", label: "Shipping Zone", render: (item) => item.shipping_zone?.name ?? "-" },
    { key: "region", label: "Region" },
    { key: "estimasi_min_day", label: "Min. Estimasi", render: (item) => `${item.estimasi_min_day} hari` },
    { key: "estimasi_max_day", label: "Maks. Estimasi", render: (item) => `${item.estimasi_max_day} hari` },
    {
      key: "actions",
      label: "Action",
      render: (item) => (
        <div className="flex items-center justify-center space-x-2">
          <ButtonUpdate onClick={() => { setSelectedData(item); setIsOpen(true); }} />
          <ButtonDelete onClick={() => HandleDelete("/admin/shippingZone", item.id, refetch)} />
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
        <ButtonCreate text="Create Shipping" onClick={() => { setSelectedData(null); setIsOpen(true); }} />
      </div>
      <Table colums={colums} Data={Data} page={page} setPage={setPage} />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={selectedData ? "Edit Shipping" : "Create Shipping"}>
        <FormShipping data={selectedData} onClose={() => setIsOpen(false)} onSuccess={() => { setIsOpen(false); refetch(); }} />
      </Modal>
    </div>
  );
};
