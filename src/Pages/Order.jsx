import { useContext, useState } from "react";
import { UseFecth } from "../hooks/UseFecth";
import { UseAction } from "../hooks/UseAction";
import { Table } from "../Component/Table";
import { Modal } from "../Component/Modal";
import toast from "react-hot-toast";
import { UsePageMeta } from "../hooks/UsePageMeta";
import { PagesContext } from "../Store/PagesProvider";

const rupiah = (value) => `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;

export const Order = () => {
  UsePageMeta("Order", "Kelola pesanan, proses pembayaran, dan pengiriman.");
  const [page, setPage] = useState(1);
  const { currentPage } = useContext(PagesContext);
  const { Data, refetch } = UseFecth(`/admin/orders?page=${page}`);
  const { HandleStatus, loading } = UseAction();
  const [trackingNumbers, setTrackingNumbers] = useState({});
  const [detailOrder, setDetailOrder] = useState(null);
  const updateStatus = (order, status) => {
    const trackingNumber = trackingNumbers[order.id]?.trim();
    if (status === "Dikirim" && !trackingNumber) {
      toast.error(`Nomor resi wajib diisi untuk pesanan ${order.invoice_number}.`);
      return;
    }
    const payload = { status };
    if (status === "Dikirim") payload.tracking_number = trackingNumber;
    HandleStatus("/admin/orders", order.id, payload, () => {
      refetch();
      if (status === "Dikirim") setTrackingNumbers((prev) => ({ ...prev, [order.id]: "" }));
    });
  };

  const columns = [
    {
      key: "invoice_number", label: "Invoice", className: "min-w-48 text-center",
      render: (order) => <span className="font-semibold text-center text-gray-800">{order.invoice_number || "-"}</span>,
    },
    {
      key: "order_item", label: "Barang", className: "min-w-52 text-center",
      render: (order) => {
        const items = order.order_item ?? [];
        return items.length ? (
          <ul className="space-y-1 text-center">
            {items.map((item) => (
              <li key={item.id} className="whitespace-normal break-words">
                <span className="font-medium text-gray-800">{item.product_title || "Produk"}</span>
              </li>
            ))}
          </ul>
        ) : "-";
      },
    },
    {
      key: "status", label: "Status", className: "min-w-28",
      render: (order) => (
        <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${order.status === "Pending" ? "bg-amber-100 text-amber-800" :
          order.status === "Diproses" ? "bg-blue-100 text-blue-800" :
            order.status === "Dikirim" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-700"
          }`}>
          {order.status || "-"}
        </span>
      ),
    },
    {
      key: "total", label: "Total", className: "min-w-32 whitespace-nowrap",
      render: (order) => <span className="font-semibold text-gray-900">{rupiah(order.total)}</span>,
    },
    {
      key: "action", label: "Aksi", className: "min-w-48",
      render: (order) => (
        <div className="flex min-w-40 flex-col gap-2" onClick={(event) => event.stopPropagation()}>
          <button type="button" onClick={() => setDetailOrder(order)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50">
            Detail
          </button>
          {order.status === "Paid" && (
            <button type="button" disabled={loading} onClick={() => updateStatus(order, "Diproses")}
              className="w-full rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? "Menyimpan..." : "Update"}
            </button>
          )}
          {order.status === "Diproses" && (
            <>
              <input type="text" value={trackingNumbers[order.id] ?? ""}
                onChange={(event) => setTrackingNumbers((prev) => ({ ...prev, [order.id]: event.target.value }))}
                placeholder="Nomor resi" aria-label={`Nomor resi ${order.invoice_number}`}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-gray-500" />
              <button type="button" disabled={loading} onClick={() => updateStatus(order, "Dikirim")}
                className="w-full rounded-lg bg-emerald-700 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50">
                {loading ? "Menyimpan..." : "Update"}
              </button>
            </>
          )}
          {order.status === "Dikirim" && (
            <p className="break-all text-xs text-gray-600">Resi: {order.trackingNumber || order.tracking_number || "-"}</p>
          )}
          {!(["Paid", "Diproses", "Dikirim"].includes(order.status)) && <span>-</span>}
        </div>
      ),
    },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl space-y-4 p-4 md:p-6">
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900">{currentPage.title}</h1>
          {currentPage.description && (
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{currentPage.description}</p>
          )}
        </div>
      </div>
      <Table colums={columns} Data={Data} page={page} setPage={setPage} />
      <Modal isOpen={(detailOrder)}

        onClose={() => setDetailOrder(null)} title={`Detail Order ${detailOrder?.invoice_number || ""}`}>
        {detailOrder && (
          <div className="space-y-4 text-sm">
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div><dt className="text-xs text-gray-500">Tanggal</dt><dd className="mt-1 font-medium text-gray-800">{detailOrder.created_at ? new Date(detailOrder.created_at).toLocaleString("id-ID") : "-"}</dd></div>
              <div><dt className="text-xs text-gray-500">Nama penerima</dt><dd className="mt-1 font-medium text-gray-800">{detailOrder.shipping_name || "-"}</dd></div>
              <div><dt className="text-xs text-gray-500">Nomor telepon</dt><dd className="mt-1 font-medium text-gray-800">{detailOrder.shipping_phone || "-"}</dd></div>
              <div><dt className="text-xs text-gray-500">Kota</dt><dd className="mt-1 font-medium text-gray-800">{detailOrder.shipping_city || "-"}</dd></div>
              <div><dt className="text-xs text-gray-500">Provinsi</dt><dd className="mt-1 font-medium text-gray-800">{detailOrder.shipping_province || "-"}</dd></div>
            </dl>
            <div>
              <h3 className="mb-2 text-xs font-medium text-gray-500">Jumlah barang</h3>
              <ul className="space-y-2">
                {(detailOrder.order_item || []).map((item) => (
                  <li key={item.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                    <span className="font-medium text-gray-800">{item.product_title || "Produk"}</span>
                    <span className="text-gray-600">× {item.qty}</span>
                  </li>
                ))}
                {!detailOrder.order_item?.length && <li className="text-gray-500">-</li>}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};
