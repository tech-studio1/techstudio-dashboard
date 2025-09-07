import {
  IconApps,
  IconChecklist,
  IconLayoutDashboard,
  IconUserShield,
  IconUsers,
} from "@tabler/icons-react";
import {
  BadgeCheck,
  Boxes,
  CreditCard,
  Layers,
  Package,
  Store,
  TicketCheck,
} from "lucide-react";

export interface NavLink {
  key?: string;
  title: string;
  label?: string;
  href: string;
  icon: JSX.Element;
}

export interface SideLink extends NavLink {
  sub?: NavLink[];
}

export const sidelinks: SideLink[] = [
  {
    title: "Dashboard",
    label: "",
    href: "/",
    key: "DASHBOARD",
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: "Orders",
    label: "",
    href: "/orders",
    key: "ORDER",
    icon: <IconChecklist size={18} />,
  },
  {
    title: "In-Store Orders",
    label: "",
    href: "/in-store-orders",
    key: "IN_STORE_ORDER",
    icon: <Store size={18} />,
  },

  {
    title: "Transactions",
    label: "",
    href: "/transactions",
    key: "TRANSACTION",
    icon: <CreditCard size={18} />,
  },
  {
    title: "Products",
    label: "",
    href: "/products",
    key: "PRODUCT",
    icon: <Package size={18} />,
  },
  {
    title: "Inventory",
    label: "",
    href: "/inventory",
    key: "INVENTORY",
    icon: <Boxes size={18} />,
  },

  {
    title: "Categories",
    label: "",
    href: "/categories",
    key: "CATEGORY",
    icon: <Layers size={18} />,
  },
  {
    title: "Brands",
    label: "",
    href: "/brands",
    key: "BRAND",
    icon: <BadgeCheck size={18} />,
  },

  {
    title: "Discounts",
    label: "",
    href: "/discounts",
    key: "DISCOUNT",
    icon: <TicketCheck size={18} />,
  },

  {
    title: "Page Builder",
    label: "",
    href: "/page-builder",
    key: "BUILDER",
    icon: <IconApps size={18} />,
  },

  {
    title: "Customers",
    label: "",
    href: "/customers",
    key: "CUSTOMER",
    icon: <IconUsers size={18} />,
  },
  {
    title: "Staffs",
    label: "",
    href: "/staffs",
    key: "STAFF",
    icon: <IconUserShield size={18} />,
  },
];
