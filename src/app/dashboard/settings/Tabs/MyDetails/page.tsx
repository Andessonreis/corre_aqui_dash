import { Mail, Phone } from 'lucide-react'
import * as Input from '@/components/Form/Input'
import * as FileInput from '@/components/Form/FileInput'
import { Button } from '@/components/Button'
import { supabase } from '@/lib/client';

export function MyDetails() {
  return (
    <div className="mt-2 flex flex-col">
      <div className="flex flex-col justify-between gap-2 border-b border-zinc-200 pb-2 dark:border-zinc-800 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-0">
          <h2 className="text-base font-medium text-zinc-900 dark:text-white">
            Dados da Conta
          </h2>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Atualize suas informações pessoais e de acesso ao sistema.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" className="h-8">
            Cancelar
          </Button>
          <Button type="submit" form="settings" variant="primary" className="h-8">
            Salvar
          </Button>
        </div>
      </div>

      <form
        id="settings"
        className="mt-2 flex-1 flex flex-col gap-2 divide-y divide-zinc-200 dark:divide-zinc-800 overflow-auto"
      >
        <div className="grid gap-2 lg:grid-cols-form">
          <label
            htmlFor="firstName"
            className="text-xs font-medium text-zinc-700 dark:text-zinc-100"
          >
            Nome Completo
          </label>
          <div className="grid gap-3 lg:grid-cols-2">
            <Input.Root className="h-8">
              <Input.Control
                name="firstName"
                id="firstName"
                type="text"
                defaultValue=""
                className="text-sm"
                placeholder="Nome"
              />
            </Input.Root>
            <Input.Root className="h-8">
              <Input.Control
                name="lastName"
                type="text"
                defaultValue=""
                className="text-sm"
                placeholder="Sobrenome"
              />
            </Input.Root>
          </div>
        </div>

        <div className="grid gap-2 pt-2 lg:grid-cols-form">
          <label
            htmlFor="email"
            className="text-xs font-medium text-zinc-700 dark:text-zinc-100"
          >
            Email de Acesso
          </label>
          <div className="flex gap-3 w-full">
            <Input.Root className="w-full h-8">
              <Input.Prefix>
                <Mail className="h-4 w-4 text-zinc-500" />
              </Input.Prefix>
              <Input.Control
                id="email"
                type="email"
                name="email"
                defaultValue=""
                className="text-sm"
                placeholder="seuemail@empresa.com"
              />
            </Input.Root>
          </div>
        </div>

        <div className="grid gap-2 pt-2 lg:grid-cols-form">
          <label
            htmlFor="phone"
            className="text-xs font-medium text-zinc-700 dark:text-zinc-100"
          >
            Telefone
          </label>
          <div className="flex gap-3 w-full">
            <Input.Root className="w-full h-8">
              <Input.Prefix>
                <Phone className="h-4 w-4 text-zinc-500" />
              </Input.Prefix>
              <Input.Control
                id="phone"
                type="tel"
                name="phone"
                defaultValue=""
                className="text-sm"
                placeholder="(11) 99999-9999"
              />
            </Input.Root>
          </div>
        </div>

        <div className="grid gap-2 pt-2 lg:grid-cols-form">
          <label
            htmlFor="photo"
            className="flex flex-col text-xs font-medium leading-relaxed text-zinc-700 dark:text-zinc-100"
          >
            Foto de Perfil
            <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
              Essa foto será utilizada no seu painel administrativo.
            </span>
          </label>
          <FileInput.Root
            id="photo"
            className="flex flex-col items-start gap-3 lg:flex-row"
          >
            <FileInput.ImagePreview className="h-16 w-16" />
            <FileInput.Trigger className="h-8 text-sm" />
            <FileInput.Control accept="image/*" />
          </FileInput.Root>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="outline" className="h-8 text-sm">
            Cancelar
          </Button>
          <Button type="submit" form="settings" variant="primary" className="h-8 text-sm">
            Salvar
          </Button>
        </div>
      </form>
    </div>
  )
}
