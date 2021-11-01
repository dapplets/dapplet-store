import React from "react";

export interface InputProps {
  searchQuery: string;
  editSearchQuery: React.Dispatch<React.SetStateAction<string>>
}