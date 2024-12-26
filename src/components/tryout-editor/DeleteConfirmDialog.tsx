import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemName: string
}

export function DeleteConfirmDialog({ isOpen, onClose, onConfirm, itemName }: DeleteConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {itemName}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


