import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Store/AuthContext";
import axios from "axios";

import { CategoryCart } from "../Component/CategoryCart";
import { Card } from "../Component/Card";
import { UsePageMeta } from "../hooks/UsePageMeta";
import { PagesContext } from "../Store/PagesProvider";


export const Home = () => {
  UsePageMeta("Dashboard", "Ringkasan performa toko, pesanan terbaru, dan statistik pengguna.");

  const api = import.meta.env.VITE_API;
  const { currentPage } = useContext(PagesContext);
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orders, users] = await Promise.all([
          axios.get(`${api}/admin/order`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${api}/admin/DataUser`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const pending = orders?.data?.data.filter(
          (o) => o.status === "Pending"
        ).length;
        const preparing = orders?.data?.data.filter(
          (o) => o.status === "Dipersiapkan"
        ).length;
        const shipping = orders?.data?.data.filter(
          (o) => o.status === "Dalam Pengiriman"
        ).length;

        setStats({
          totalOrders: orders?.data?.data.length,
          totalUsers: users?.data?.data.length,
          pendingOrders: pending,
          preparingOrders: preparing,
          shippingOrders: shipping,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col p-6 gap-4 min-h-screen">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold text-gray-900">{currentPage.title}</h1>
        {currentPage.description && (
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{currentPage.description}</p>
        )}
      </div>
      <div className="flex items-start space-x-6">
        <Card
          icon={
            <svg
              className=""
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                className="fill-black group-hover:fill-white"
                d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1m-9-1a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1M18 6H4.27l2.55 6H15c.33 0 .62-.16.8-.4l3-4c.13-.17.2-.38.2-.6a1 1 0 0 0-1-1m-3 7H6.87l-.77 1.56L6 15a1 1 0 0 0 1 1h11v1H7a2 2 0 0 1-2-2a2 2 0 0 1 .25-.97l.72-1.47L2.34 4H1V3h2l.85 2H18a2 2 0 0 1 2 2c0 .5-.17.92-.45 1.26l-2.91 3.89c-.36.51-.96.85-1.64.85"
              />
            </svg>
          }
          title="Total Order"
          value={stats.totalOrders}
          persentase={`+3.34%`}
          colour="green"
          view="Last week"
        />
        <Card
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
            >
              <path
                className="fill-black group-hover:fill-white"
                d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 2a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m0 7c2.67 0 8 1.33 8 4v3H4v-3c0-2.67 5.33-4 8-4m0 1.9c-2.97 0-6.1 1.46-6.1 2.1v1.1h12.2V17c0-.64-3.13-2.1-6.1-2.1"
              />
            </svg>
          }
          title="Total User"
          value={stats.totalUsers}
          colour="red"
          persentase={`-2.12%`}
          view="Last Week"
        />
        <Card
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g
                className="fill-none stroke-black group-hover:stroke-white"
                strokeWidth="1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M6 10h4"
                />
                <path
                  strokeWidth="1.5"
                  d="M20.833 11h-2.602C16.446 11 15 12.343 15 14s1.447 3 3.23 3h2.603c.084 0 .125 0 .16-.002c.54-.033.97-.432 1.005-.933c.002-.032.002-.071.002-.148v-3.834c0-.077 0-.116-.002-.148c-.036-.501-.465-.9-1.005-.933c-.035-.002-.076-.002-.16-.002Z"
                />
                <path
                  strokeWidth="1.5"
                  d="M20.965 11c-.078-1.872-.328-3.02-1.137-3.828C18.657 6 16.771 6 13 6h-3C6.229 6 4.343 6 3.172 7.172S2 10.229 2 14s0 5.657 1.172 6.828S6.229 22 10 22h3c3.771 0 5.657 0 6.828-1.172c.809-.808 1.06-1.956 1.137-3.828"
                />
                <path
                  strokeLinecap="round"
                  strokeWidth="1.5"
                  d="m6 6l3.735-2.477a3.24 3.24 0 0 1 3.53 0L17 6"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.991 14h.01"
                />
              </g>
            </svg>
          }
          title="Transaksi"
          value={0}
          colour="green"
          persentase={`+3.34%`}
          view="Last Week"
        />
        <CategoryCart />
      </div>
    </div>
  );
};
