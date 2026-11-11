import React from 'react';
import { AdminSidebar } from '../../components/AdminSidebar';

export const metadata = {
  title: 'Admin Console | GiftNao',
  description: 'GiftNao Administration and Store Management',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminSidebar>{children}</AdminSidebar>;
}
