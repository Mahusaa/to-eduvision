'use client'

import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Label } from '~/components/ui/label'

interface ExamFinishConfirmationDialogProps {
  onConfirm: () => Promise<void>
  children: React.ReactNode
  isSubmitting: boolean
}

export function FinishTryoutDialog({ onConfirm, children, isSubmitting }: ExamFinishConfirmationDialogProps) {
  const [open, setOpen] = useState(false)
  const [isChecked, setIsChecked] = useState(false)


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Konfirmasi Selesai Pengerjaan</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menyelesaikan ujian? Setelah dikonfirmasi, Anda tidak dapat kembali ke soal-soal ujian.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <Checkbox
            id="confirm-checkbox"
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(checked as boolean)}
          />
          <Label
            htmlFor="confirm-checkbox"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Saya telah memeriksa semua jawaban dan siap untuk menyelesaikan ujian
          </Label>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={!isChecked || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3 h-3 inline-block mr-2" />
                Mengirim...
              </>
            ) : (
              "Ya, Selesaikan Ujian"
            )}
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


