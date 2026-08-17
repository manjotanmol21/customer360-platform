import Button from "../UI/Button";

interface CustomerDeleteModalProps {
  customerName: string;
  isOpen: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function CustomerDeleteModal({
  customerName,
  isOpen,
  isDeleting,
  onCancel,
  onConfirm,
}: CustomerDeleteModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-customer-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2
          id="delete-customer-title"
          className="text-xl font-bold text-slate-950"
        >
          Delete customer?
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          You are about to delete{" "}
          <span className="font-semibold text-slate-900">
            {customerName}
          </span>
          . This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            disabled={isDeleting}
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            isLoading={isDeleting}
            loadingText="Deleting..."
            onClick={onConfirm}
          >
            Delete Customer
          </Button>
        </div>
      </div>
    </div>
  );
}