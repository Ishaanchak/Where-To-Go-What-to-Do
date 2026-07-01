import { TabBar } from "@/components/TabBar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <TabBar />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
