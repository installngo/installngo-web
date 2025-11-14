"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import Button from "../Button";

interface Props {
  organizationName: string;
  organizationCode: string;
  onLogout: () => void;
}

export default function ProfileDropdown({ organizationName, organizationCode, onLogout }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button variant="secondary" onClick={() => setOpen(!open)} className="flex items-center gap-2 h-8">
        {organizationName} ({organizationCode})
        <ChevronDown size={14} className={open ? "rotate-180" : "rotate-0"} />
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-[var(--submenu-bg)] text-[var(--submenu-text)] rounded-md shadow-lg z-50">
          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--menu-hover-bg)] hover:text-[var(--menu-hover-text)]"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}