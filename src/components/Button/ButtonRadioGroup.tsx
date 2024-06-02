"use client";
import { cn } from "@/lib/utils/utils";
import React from "react";
import { Button } from "../ui/button";

interface ButtonOption {
  label: string;
  value: string;
}

interface ButtonRadioGroupProps {
  options: ButtonOption[];
  value: string;
  onChange: (value: string) => void;
}

const ButtonRadioGroup: React.FC<ButtonRadioGroupProps> = ({
  options,
  value,
  onChange,
}) => {
  return (
    <div className="flex space-x-2">
      {options.map((option) => (
        <Button
          key={option.value}
          onClick={() => onChange(option.value)}
          variant={value === option.value ? "default" : "secondary"}
          className={cn("rounded-full")}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export default ButtonRadioGroup;
