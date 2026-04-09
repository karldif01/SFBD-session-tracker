interface PaymentBadgeProps {
  paid: boolean;
  onClick: () => void;
  label?: string;
}

export default function PaymentBadge({ paid, onClick, label }: PaymentBadgeProps) {
  return (
    <button
      onClick={onClick}
      title={label ? `Toggle ${label} payment` : 'Toggle payment'}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 ${
        paid
          ? 'bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 hover:shadow-[0_0_12px_rgba(0,212,170,0.15)]'
          : 'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 hover:shadow-[0_0_12px_rgba(255,77,106,0.15)]'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${paid ? 'bg-accent shadow-[0_0_6px_rgba(0,212,170,0.5)]' : 'bg-danger shadow-[0_0_6px_rgba(255,77,106,0.5)]'}`} />
      {paid ? 'Paid' : 'Unpaid'}
    </button>
  );
}
