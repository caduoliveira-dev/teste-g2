'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pencil, Trash, PlusCircle } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

// definindo o tipo dde dado Receita
type Receita = {
  id: string;
  titulo: string;
  tipo: string;
  num_pessoas: number;
  nivel_dificuldade: string;
  lista_ingredientes: string;
  preparacao: string;
};

export default function Receita() {
  const [receitas, setReceitas] = useState<Receita[]>([]); // array de receitas q virá do get
  const [selectedReceita, setSelectedReceita] = useState<Receita | null>(null); // armazena a receita atual selecionada
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // controla a abertua/fechamento do dialog
  const router = useRouter();

  useEffect(() => {
    async function fetchReceitas() {
      const response = await fetch("https://673bc4aa96b8dcd5f3f766c6.mockapi.io/api/receita");
      const data = await response.json();
      setReceitas(data);
    }

    fetchReceitas();
  }, []); // efeito para quando o componente é montado

  // func para selecionar a receita
  const handleSelectReceita = (id: string) => {
    const receita = receitas.find((r) => r.id === id);
    if (receita) {
      setSelectedReceita(receita);
    }
  };

  // redireciona para a pag de edicao passando o id na url
  const handleEdit = () => {
    if (selectedReceita) {
      router.push(`/editar/${selectedReceita.id}`);
    }
  };

  // realiza a req DELETE para remover a receita da api
  const handleDelete = async () => {
    if (selectedReceita) {
      try {
        const response = await fetch(`https://673bc4aa96b8dcd5f3f766c6.mockapi.io/api/receita/${selectedReceita.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          // chama novo array de receitas filtrano a excluida
          setReceitas(receitas.filter(r => r.id !== selectedReceita.id));
          setSelectedReceita(null); // limpa a selecionada
        } else {
          console.error('Failed to delete recipe');
        }
      } catch (error) {
          console.error('Error deleting recipe:', error);
      }
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <div className="col-span-1">
        <Link href="/new"><Button size="sm"><PlusCircle /> Cadastrar Receita</Button></Link>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Receita</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receitas.map((receita) => (
              <TableRow key={receita.id} onClick={() => handleSelectReceita(receita.id)}>
                <TableCell className="font-medium">{receita.titulo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="col-span-3">
        {selectedReceita ? (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{selectedReceita.titulo.toUpperCase()}</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={handleEdit} className="bg-blue-500 w-8 h-8 hover:bg-blue-700"><Pencil className="h-4 w-4" /></Button>
                  <Button onClick={() => setIsDeleteDialogOpen(true)} className="bg-red-500 w-8 h-8 hover:bg-red-700"><Trash className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <Label>Tipo de Refeição:</Label>
                  <div>{selectedReceita.tipo}</div>
                </div>
                <div>
                  <Label>N° de Pessoas que serve:</Label>
                  <div>{selectedReceita.num_pessoas}</div>
                </div>
                <div>
                  <Label>Dificuldade:</Label>
                  <div>{selectedReceita.nivel_dificuldade}</div>
                </div>
                <div>
                  <Label>Lista de Ingredientes:</Label>
                  <div>
                    {selectedReceita.lista_ingredientes}
                  </div>
                </div>
                <div>
                  <Label>Modo de Preparo:</Label>
                  <div>{selectedReceita.preparacao}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div>Selecione uma receita para ver os detalhes.</div>
        )}
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja excluir esta receita?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a receita "{selectedReceita?.titulo}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-700">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
