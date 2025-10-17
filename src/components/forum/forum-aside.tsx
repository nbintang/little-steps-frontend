import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import type { ForumThreadListItemAPI } from "@/types/forum";
import { ForumThreadCard } from "@/components/forum/forum-thread-card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { ArrowUpRight, Pen, SearchIcon, Sparkles } from "lucide-react";
import { useDebounce } from "use-debounce";
import { useFetchInfinite } from "@/hooks/use-fetch-infinite";
import { useInView } from "react-intersection-observer";
import { ErrorDynamicPage } from "@/components/error-dynamic";
import ForumThreadCardSkeleton from "@/components/forum/forum-thread-skeleton";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCapitalize } from "@/helpers/string-formatter";
import { ForumSort } from "@/lib/enums/forum-sort";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useFetchPaginated } from "@/hooks/use-fetch-paginated";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { UseQueryResult } from "@tanstack/react-query";
import { SuccessResponsePaginated } from "@/types/response";
import { JwtPayload, UserPayload } from "@/types/user-payload";
import { Separator } from "../ui/separator";
interface ForumAsideProps {
  searchKeyword: string;
  setSearchKeyword: Dispatch<SetStateAction<string>>;
  isSearching: boolean;
  isLoading: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  threads: SuccessResponsePaginated<ForumThreadListItemAPI[]> | undefined;
  sortBy?: string;
  setSortBy?: Dispatch<SetStateAction<string>>;
  user?: (UserPayload & JwtPayload) | null;
}
export const ForumAside = ({
  searchKeyword,
  setSearchKeyword,
  isSearching,
  isLoading,
  threads,
  sortBy,
  isSuccess,
  isError,
  setSortBy,
  user,
}: ForumAsideProps) => {
  return (
    <header className="flex items-end justify-between flex-wrap col-span-2 order-first lg:order-last  lg:col-span-1 lg:sticky lg:top-52 lg:self-start">
      <div className="w-full space-y-3 ">
        <div className="hidden md:inline">
          <h1 className="text-xl font-semibold text-balance">Forum Tools</h1>
          <p className="text-sm  font-normal text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
            earum enim nostrum.
          </p>
        </div>
        <ButtonGroup orientation="vertical" className="w-full max-w-md">
          <ButtonGroup className="w-full">
            <InputGroup>
              <InputGroupInput
                placeholder="Search threads..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                disabled={isLoading}
              />
              {isSearching ? (
                <InputGroupAddon align="inline-end">
                  <Spinner />
                </InputGroupAddon>
              ) : (
                <InputGroupAddon align="inline-end">
                  <SearchIcon className="size-4" />
                </InputGroupAddon>
              )}
            </InputGroup>
            <p></p>
          </ButtonGroup>
          <ButtonGroup orientation={"vertical"} className="w-full max-w-md">
            <ButtonGroup className="w-full max-w-md">
              <ButtonGroup className="w-full max-w-md">
                <Button className="w-full max-w-md" asChild>
                  <Link href={"/forum/new"}>
                    <Pen className="size-4" />
                    <span className="ml-2">New Thread</span>
                  </Link>
                </Button>
              </ButtonGroup>
              <ButtonGroup>
                <Select
                  value={sortBy}
                  onValueChange={(val) => setSortBy && setSortBy(val)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sort by</SelectLabel>
                      {Array.from(Object.values(ForumSort)).map((sort) => (
                        <SelectItem key={sort} value={sort}>
                          {formatCapitalize(sort)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </ButtonGroup>
            </ButtonGroup>
          </ButtonGroup>
        </ButtonGroup>
        <div className="flex items-center  my-5  gap-x-3">
          <span className="text-muted-foreground text-sm">
            {threads?.meta?.totalItems} total threads
          </span>
          <div className="flex-1">
            <Separator orientation="horizontal" className="" />
          </div>
        </div>
        {isLoading && <ForumThreadCardSkeleton />}
        {isSuccess &&
          threads?.data !== undefined &&
          threads.data.length > 0 && (
            <div className="my-3 hidden md:inline">
              <div className="my-3">
                <h1 className="text-lg font-semibold">Your Threads</h1>
              </div>
              <ScrollArea
                className={cn(
                  threads?.data?.length! > 0 ? "h-[200px]" : "h-[50px]"
                )}
              >
                <div className="space-y-2">
                  {threads?.data?.map((thread) => (
                    <ForumThreadCard
                      redirectUrl={`/forum/${thread?.id}`}
                      key={thread?.id}
                      thread={thread as ForumThreadListItemAPI}
                    />
                  ))}
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
              <Button variant={"link"} asChild>
                <Link href={"/author/forum"}>
                  See More
                  <ArrowUpRight />
                </Link>
              </Button>
            </div>
          )}
      </div>
    </header>
  );
};
