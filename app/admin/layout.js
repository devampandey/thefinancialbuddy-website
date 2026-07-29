export const metadata = {
  title: {
    default: "Staff",
    template: "%s | Staff — The Financial Buddy",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return children;
}
