"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"


export function EditTryoutDialog({ tryoutId }: { tryoutId: number }) {
  const [open, setOpen] = useState(false)
  const [selectedSubtest, setSelectedSubtest] = useState("")
  const router = useRouter()
  const subtests = [
    { id: "pu", name: "Penalaran Umum", route: `/edit/${tryoutId}/pu` },
    { id: "pm", name: "Penalaran Matematika", route: `/edit/${tryoutId}/pm` },
    { id: "pbm", name: "Kemampuan Memahami Bacaan dan Menulis", route: `/edit/${tryoutId}/pbm` },
    { id: "ppu", name: "Pengetahuan dan Pemahaman Umum", route: `/edit/${tryoutId}/ppu` },
    { id: "kk", name: "Kemampuan Kuantitatif", route: `/edit/${tryoutId}/kk` },
    { id: "lbind", name: "Literasi Bahasa Indonesia", route: `/edit/${tryoutId}/lbind` },
    { id: "lbing", name: "Literasi Bahasa Inggris", route: `/edit/${tryoutId}/lbing` }
  ]

  const handleSubtestSelect = (value: string) => {
    setSelectedSubtest(value)
  }

  const handleEdit = () => {
    const subtest = subtests.find(s => s.id === selectedSubtest)
    if (subtest) {
      router.replace(subtest.route)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Tryout Subtest</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="subtest-select" className="text-sm font-medium">Select Subtest</label>
            <Select onValueChange={handleSubtestSelect} value={selectedSubtest}>
              <SelectTrigger id="subtest-select">
                <SelectValue placeholder="Select a subtest to edit" />
              </SelectTrigger>
              <SelectContent>
                {subtests.map((subtest) => (
                  <SelectItem key={subtest.id} value={subtest.id}>
                    {subtest.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleEdit} disabled={!selectedSubtest}>
          Edit Selected Subtest
        </Button>
      </DialogContent>
    </Dialog>
  )
}


