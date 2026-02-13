"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { investorService, Investor } from "@/services/investor.service"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Plus, Search, Loader2, UserX } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function ClientsPage() {
  const { role } = useAuth()
  const [clients, setClients] = useState<Investor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Estado para novo cliente
  const [newClientName, setNewClientName] = useState("")
  const [newClientEmail, setNewClientEmail] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Busca dados reais ao carregar a página
  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const data = await investorService.getAll()
      setClients(data)
    } catch (error) {
      console.error("Erro ao buscar investidores:", error)
      // Aqui você poderia adicionar um Toast de erro
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClient = async () => {
    try {
      setIsCreating(true)
      await investorService.create({ name: newClientName, email: newClientEmail })
      await fetchClients() // Recarrega a lista
      setIsDialogOpen(false) // Fecha o modal
      setNewClientName("")
      setNewClientEmail("")
    } catch (error) {
      console.error("Erro ao criar investidor:", error)
    } finally {
      setIsCreating(false)
    }
  }

  // Filtro de busca local
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 transition-colors">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 dark:border-slate-800 px-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-slate-300 dark:bg-slate-800" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Investors</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </header>

      <div className="flex-1 p-6 space-y-6 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Investors</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your clients and their access.</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> New Client
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                  <DialogTitle>Add New Investor</DialogTitle>
                  <DialogDescription>Create a new client profile to manage their portfolio.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      value={newClientName} 
                      onChange={(e) => setNewClientName(e.target.value)} 
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={newClientEmail} 
                      onChange={(e) => setNewClientEmail(e.target.value)} 
                      className="col-span-3" 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateClient} disabled={isCreating} className="bg-emerald-600 text-white">
                    {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Investor"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </div>

        <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input 
                  type="search" 
                  placeholder="Search by name or email..." 
                  className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-emerald-500" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex-1 overflow-auto shadow-sm">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p>Loading investors...</p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <UserX className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">No investors found</p>
                <p className="text-sm">Try adding a new client to get started.</p>
              </div>
            ) : (
              <Table>
                  <TableHeader>
                      <TableRow className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900">
                          <TableHead className="text-slate-500 dark:text-slate-400">Client</TableHead>
                          <TableHead className="text-slate-500 dark:text-slate-400">Status</TableHead>
                          <TableHead className="text-slate-500 dark:text-slate-400">Total Patrimony</TableHead>
                          <TableHead className="text-slate-500 dark:text-slate-400">Since</TableHead>
                          <TableHead className="text-right text-slate-500 dark:text-slate-400">Actions</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {filteredClients.map((client) => (
                          <TableRow key={client.id} className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                              <TableCell className="font-medium text-slate-900 dark:text-white">
                                  <div className="flex items-center gap-3">
                                      <Avatar className="h-9 w-9 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${client.name}`} />
                                          <AvatarFallback className="text-slate-500 dark:text-slate-400">
                                            {client.name.substring(0, 2).toUpperCase()}
                                          </AvatarFallback>
                                      </Avatar>
                                      <div className="flex flex-col">
                                          <span>{client.name}</span>
                                          <span className="text-xs text-slate-500">{client.email}</span>
                                      </div>
                                  </div>
                              </TableCell>
                              <TableCell>
                                  <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10">Active</Badge>
                              </TableCell>
                              <TableCell className="text-slate-900 dark:text-white font-mono">
                                {/* Exibe valor mockado ou real se tiver */}
                                {client.patrimony ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(client.patrimony) : '$0.00'}
                              </TableCell>
                              <TableCell className="text-slate-500 dark:text-slate-300">
                                  <span className="text-xs text-slate-400 dark:text-slate-500">
                                    {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : '-'}
                                  </span>
                              </TableCell>
                              <TableCell className="text-right">
                                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800">
                                      <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
            )}
        </div>
      </div>
    </div>
  )
}