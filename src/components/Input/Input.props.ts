import React from "react";

export interface InputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClick: () => void;
  value: string;
}