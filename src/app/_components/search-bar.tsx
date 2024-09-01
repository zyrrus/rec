"use client";

import { Input } from "~/app/_components/ui/input";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import debounce from "lodash.debounce";

interface SearchBarProps {
  handleSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBar = ({ handleSearchInputChange }: SearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-stone-500 dark:placeholder:text-stone-400" />
      <Input
        placeholder="Search"
        className="pl-8"
        onChange={handleSearchInputChange}
      />
    </div>
  );
};

export const useDebouncedSearch = (debounceWait = 300) => {
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSetSearchQuery = useMemo(
    () => debounce(setSearchQuery, debounceWait),
    [debounceWait],
  );

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchQuery(e.target.value);
  };

  return { searchQuery, handleSearchInputChange };
};
