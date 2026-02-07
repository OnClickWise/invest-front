import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AuthProvider } from "@/contexts/auth-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // O AuthProvider AQUI garante que Sidebar e Page compartilhem o mesmo estado
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-slate-950 overflow-hidden flex flex-col">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  )
}