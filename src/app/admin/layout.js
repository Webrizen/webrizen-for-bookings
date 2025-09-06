'use client';

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen items-stretch">
      <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
        <div className="h-full">
          <Sidebar />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <main className="p-6 h-full overflow-auto">{children}</main>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
