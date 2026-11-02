// AddressInput: optional address, used only for distance
// Used on: /onboarding, /settings
// Spec: docs/product/design-inventory.md, "Address input"
import { useId } from 'react';
import { Input } from '@/components/ui/input';

type AddressInputProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
};

// One field for now (per the user-flows spec). If the team picks separate
// street/city/ZIP fields, this is the only component that needs to change.
export function AddressInput({ value, onChange, label = 'Address' }: AddressInputProps) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-lg font-medium text-foreground">
        {label}
      </label>
      <Input
        id={id}
        name="address"
        autoComplete="street-address"
        placeholder="123 Example St, Blue Ridge, GA"
        aria-describedby={hintId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <p id={hintId} className="text-base text-muted-foreground">
        We only use this to find events near you. It&apos;s never shown to anyone.
      </p>
    </div>
  );
}
