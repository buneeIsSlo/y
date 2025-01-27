"use client";

import { Search as SearchIcon } from "@mynaui/icons-react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

export default function SearchField() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const query = (form.query as HTMLInputElement).value.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <form onSubmit={handleSubmit} action="/search" method="GET">
      <div className="relative">
        <Input name="query" placeholder="Search" className="py-6" />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}
