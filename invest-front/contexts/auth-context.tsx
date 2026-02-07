"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'INVESTOR'

interface AuthContextType {
  role: UserRole
  setRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Estado inicial padrão
  const [role, setRoleState] = useState<UserRole>('SUPER_ADMIN')

  // Ao carregar, lê do navegador
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('investpro-role') as UserRole
      if (savedRole) {
        setRoleState(savedRole)
      }
    }
  }, [])

  // Ao mudar, salva no navegador
  const setRole = (newRole: UserRole) => {
    setRoleState(newRole)
    if (typeof window !== 'undefined') {
      localStorage.setItem('investpro-role', newRole)
    }
  }

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}