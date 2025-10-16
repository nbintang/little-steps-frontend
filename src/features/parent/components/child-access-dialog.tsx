"use client";
import { useState, useEffect, useTransition } from "react";
import { useOpenChildAccessDialog } from "../hooks/use-open-child-access-dialog";
import { useShallow } from "zustand/shallow";
import { DialogLayout } from "@/components/dialog-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFetchInfinite } from "@/hooks/use-fetch-infinite";
import { ChildrenAPI } from "@/types/children";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "use-debounce";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { formatCapitalize } from "@/helpers/string-formatter";
import { IconLogin2 } from "@tabler/icons-react";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useProgress } from "@bprogress/next";
import { toast } from "sonner";
import useChildProfile from "@/hooks/use-child-profile";
import axios, { isAxiosError } from "axios";
import { ChildGender } from "@/lib/enums/child-gender";
import { useChildDialog } from "../hooks/use-open-child-form-dialog";
import { accessChildService } from "../services/access-child-service";
import Link from "next/link";

export const ChildAccessDialog = () => {
  const { openDialog, setOpenDialog, closeDialog } = useOpenChildAccessDialog(
    useShallow((state) => ({
      openDialog: state.openDialog,
      closeDialog: state.closeDialog,
      setOpenDialog: state.setOpenDialog,
    }))
  );
  const [isPending, setIsPending] = useState<boolean>(false);
  const { openDialog: openChildDialog, closeDialog: closeChildDialog } =
    useChildDialog();
  const progress = useProgress();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearch] = useDebounce(searchKeyword, 300);
  const [genderFilter, setGenderFilter] = useState<ChildGender | "">("");
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
  });

  const { data: childProfile, isLoading } = useChildProfile();
  const router = useRouter();

  const accessChild = async (childId: string) => {
    setIsPending(true);
   
    return await toast
      .promise(() => accessChildService(childId), {
        loading: "Accessing child...",
        success: (res) => {
          if (res.data?.accessInfo.isAllowed) {
            router.push("/children/playground");
          }
          return "Child accessed successfully";
        },
        error: (err) =>
          isAxiosError(err)
            ? err.response?.data.message
            : "Failed to access child",
        finally: () => {
          setIsPending(false);
           closeDialog();
        },
      })
      .unwrap();
  };
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isChildrenLoading,
    isError,
    error,
  } = useFetchInfinite<ChildrenAPI>({
    endpoint: `parent/children`,
    keys: [
      "children",
      debouncedSearch,
      genderFilter,
      "schedules",
      childProfile?.id ?? "",
    ],
    enabled: openDialog,
    protected: true,
    config: {
      params: {
        name: debouncedSearch || undefined,
        gender: genderFilter || undefined,
      },
    },
  });
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <DialogLayout
      title="Child Access"
      description="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur est inventore animi?"
      isOpen={openDialog}
      onOpenChange={setOpenDialog}
    >
      <div className="flex gap-2 items-center">
        <InputGroup>
          <InputGroupInput
            placeholder="Search by name..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <Select
          value={genderFilter || "ALL"}
          onValueChange={(val) =>
            setGenderFilter(val === "ALL" ? "" : (val as ChildGender))
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Filter gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value={ChildGender.MALE}>Male</SelectItem>
            <SelectItem value={ChildGender.FEMALE}>Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[400px] w-full">
        <div className="space-y-2">
          <Item variant="muted">
            <ItemMedia>
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={
                    "https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/Portrait_placeholder.png/330px-Portrait_placeholder.png"
                  }
                />
                <AvatarFallback>{"AA"}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{"Add Child"}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Button
                size="icon-sm"
                variant="outline"
                className="rounded-full"
                aria-label="Add"
                onClick={() => {
                  openChildDialog();
                }}
              >
                <Plus />
              </Button>
            </ItemActions>
          </Item>
          {/* Loading */}
          {!data && !isFetchingNextPage && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              <Spinner className="mx-auto mb-2" />
              Loading children...
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="py-10 text-center text-sm text-red-500">
              Failed to load data
            </div>
          )}

          {/* Empty state */}
          {data && data.pages.every((page) => page?.data?.length === 0) && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No children found
            </div>
          )}

          {/* Children list */}
          {data?.pages.map((page) =>
            page.data?.map((child) => (
              <Item key={child.id} variant="outline">
                <ItemMedia>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={child.avatarUrl || ""} />
                    <AvatarFallback>{child.name?.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle
                    className="hover:underline"
                    onClick={() => (
                      router.push("/settings/children"), closeDialog()
                    )}
                  >
                    {child.name}
                  </ItemTitle>
                  <ItemDescription>
                    Gender: {formatCapitalize(child.gender) || "N/A"}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    size="icon-sm"
                    variant="outline"
                    onClick={() => accessChild(child.id)}
                    className="rounded-full"
                    aria-label="Invite"
                    disabled={isLoading || !child.isActive || isPending}
                  >
                    {isLoading || isPending ? <Spinner /> : <IconLogin2 />}
                  </Button>
                </ItemActions>
              </Item>
            ))
          )}
          <div ref={ref} className="h-4" />
          {isFetchingNextPage && <p className="text-center py-2">Loading...</p>}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </DialogLayout>
  );
};
