interface TopSheetProps {
  state: boolean;
  outClickAction: () => void;
  closeHandler: () => void;
}

export default function TopSheet({ state, outClickAction, closeHandler }: TopSheetProps) {}
