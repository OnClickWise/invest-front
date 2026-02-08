export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full h-screen grid lg:grid-cols-2">
      {/* Coluna Esquerda: Marca e Visual */}
      <div className="hidden lg:flex flex-col bg-slate-950 text-white p-10 justify-between relative overflow-hidden">
        <div className="z-10 flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          OnClickInvest
        </div>
        
        <div className="z-10 relative">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "A plataforma transformou a maneira como gerencio meus clientes. As projeções financeiras são o diferencial que eu precisava."
            </p>
            <footer className="text-sm text-slate-400">João Silva - Gestor de Patrimônio</footer>
          </blockquote>
        </div>

        {/* Efeito de Fundo */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-slate-950 z-0" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      {/* Coluna Direita: O Formulário (Login/Cadastro) */}
      <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-8">
        {children}
      </div>
    </div>
  )
}