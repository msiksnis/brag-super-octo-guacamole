"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SearchFieldProps {
  className?: string;
}

export default function SearchField({ className }: SearchFieldProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
  }

  return (
    <form onSubmit={handleSubmit} method="GET" action="/search">
      <div className="relative">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          name="q"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn("pe-10", className)}
        />
        <SearchIcon className="absolute top-1/2 transform -translate-y-1/2 right-1.5 md:right-3 size-6 md:size-5 text-muted-foreground pointer-events-none" />
      </div>
    </form>
  );
}
