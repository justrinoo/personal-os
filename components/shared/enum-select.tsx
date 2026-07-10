"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatEnumLabel } from "@/utils/format";

export interface SelectOption {
  value: string;
  label: string;
}

interface EnumSelectProps {
  value: string;
  onChange: (value: string) => void;
  /** Enum string values (labels derived) or explicit options. */
  options: readonly string[] | SelectOption[];
  placeholder?: string;
}

export function EnumSelect({
  value,
  onChange,
  options,
  placeholder,
}: EnumSelectProps) {
  const items: SelectOption[] = options.map((option) =>
    typeof option === "string"
      ? { value: option, label: formatEnumLabel(option) }
      : option
  );

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
