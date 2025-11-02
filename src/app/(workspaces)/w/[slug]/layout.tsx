import SideBarWrapper from "@/components/side-bar-wrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SideBarWrapper>{children}</SideBarWrapper>;
}
