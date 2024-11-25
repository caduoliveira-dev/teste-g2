'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  num_pessoas: z.number().min(1, 'Número de pessoas deve ser pelo menos 1'),
  nivel_dificuldade: z.string().min(1, 'Nível de dificuldade é obrigatório'),
  lista_ingredientes: z.string().min(1, 'Lista de ingredientes é obrigatória'),
  preparacao: z.string().min(1, 'Preparação é obrigatória'),
}) //validacao do form

type FormValues = z.infer<typeof formSchema> // tipando os dados do form

export default function EditarReceita({ params }: { params: Promise<{ id: string }> }) {
  // aguardar a promise seja resolvida para obter o valor do id
  const resolvedParams = use(params)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {toast} = useToast()
  const router = useRouter()

  const form = useForm<FormValues>({ // gerencia o estado e validacao do form
    resolver: zodResolver(formSchema), // resolver intregra o react-hook-form com o zod
    defaultValues: {
      titulo: '',
      tipo: '',
      num_pessoas: 1,
      nivel_dificuldade: '',
      lista_ingredientes: '',
      preparacao: '',
    },
  })

  useEffect(() => { // busca receita pelo id
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`https://673bc4aa96b8dcd5f3f766c6.mockapi.io/api/receita/${resolvedParams.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (!response.ok) {
          throw new Error('falha ao buscar receita')
        }
        const recipeData = await response.json()
        form.reset(recipeData) //preenche o form com o dado vindo do get
      } catch (error) {
        console.error('error:', error)
        toast({
          title: "Error",
          description: "error ao buscar receita.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecipe()
  }, [resolvedParams.id, form])

  const onSubmit = async (data: FormValues) => { // envia os dados par aapi
    setIsSubmitting(true)
    try {
      const response = await fetch(`https://673bc4aa96b8dcd5f3f766c6.mockapi.io/api/receita/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('falha ao atualizar receita')
      }

      toast({
        title: "Success",
        description: "alterada com sucesso!",
      })
      router.push('/')
    } catch (error) {
      console.error('error:', error)
      toast({
        title: "Error",
        description: "falha ao buscar receita.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) { // carregamento para aguardar o get
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Editar Receita</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o título da receita" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o tipo da receita" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="num_pessoas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Pessoas</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="Digite o número de pessoas"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nivel_dificuldade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nível de Dificuldade</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível de dificuldade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="facil">Fácil</SelectItem>
                      <SelectItem value="medio">Médio</SelectItem>
                      <SelectItem value="dificil">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lista_ingredientes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lista de Ingredientes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite a lista de ingredientes"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preparacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preparação</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite o modo de preparo"
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : (
                'Atualizar Receita'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}