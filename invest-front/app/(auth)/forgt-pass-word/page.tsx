"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-slate-900 dark:text-white">Recuperar Senha</CardTitle>
        <CardDescription className="text-center text-slate-500 dark:text-slate-400">
          Digite seu e-mail e enviaremos um link de recuperação.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail Cadastrado</Label>
          <Input id="email" type="email" placeholder="nome@exemplo.com" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700" />
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
          Enviar Link
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-slate-100 dark:border-slate-800 pt-4">
        <Link href="/login" className="flex items-center text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Login
        </Link>
      </CardFooter>
    </Card>
  )
}