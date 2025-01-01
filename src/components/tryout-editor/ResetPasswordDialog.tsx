import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemName: string
}

export function ResetPasswordDialog({ isOpen, onClose, onConfirm, itemName }: DeleteConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Reset Password</DialogTitle>
          <DialogDescription>
            Apakah anda akan mereset password user bernama {itemName}?.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="default" className="bg-yellow-400 text-white hover:bg-yellow-600 hover:text-white" onClick={onConfirm}>Reset</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


