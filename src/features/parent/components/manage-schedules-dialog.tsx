"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Trash2, Clock, Plus, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScheduleForm } from "./form/schedule-form";
import { DayOfWeek } from "@/lib/enums/day-of-week";
import { useScheduleDialogStore } from "../hooks/use-schedule";
import { useShallow } from "zustand/shallow";
import { usePost } from "@/hooks/use-post";
import { ScheduleAPI } from "@/types/schedule";
import { usePatch } from "@/hooks/use-patch";
import { useDelete } from "@/hooks/use-delete";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useFetch } from "@/hooks/use-fetch";
import { Skeleton } from "@/components/ui/skeleton";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { useQueryClient } from "@tanstack/react-query";
export function ManageSchedulesDialog() {
  const { isOpen, child, closeDialog } = useScheduleDialogStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      child: state.child,
      closeDialog: state.closeDialog,
      openDialog: state.openDialog,
    }))
  );

  const [isCreating, setIsCreating] = React.useState(false);
  const { editingScheduleId, setEditingScheduleId } = useScheduleDialogStore();
  const [scheduleId, setScheduleId] = React.useState<string | null>(null);
  const queryClient = useQueryClient();
  // Fetch schedules
  const {
    data: schedules = [],
    refetch,
    isLoading,
  } = useFetch<ScheduleAPI[]>({
    endpoint: `parent/children/${child.id}/schedules`,
    keys: ["schedules", child?.id ?? ""],
  });

  React.useEffect(() => {
    if (editingScheduleId) setScheduleId(editingScheduleId);
  }, [editingScheduleId]);

  // Find editing schedule
  const editingSchedule =
    schedules.find((s) => s.id === editingScheduleId) || null;

  // Mutations
  const addSchedule = usePost<ScheduleAPI>({
    endpoint: `parent/children/${child.id}/schedules`,
    keys: ["schedules", child?.id ?? ""],
  });

  const updateSchedule = usePatch<ScheduleAPI>({
    endpoint: `parent/children/${child.id}/schedules/${editingScheduleId}`,
    keys: ["schedules", child?.id ?? ""],
  });

  const deleteSchedule = useDelete<ScheduleAPI>({
    endpoint: `parent/children/${child.id}/schedules/${scheduleId || ""}`,
    keys: ["schedules", child?.id ?? ""],
  });

  const isPending =
    addSchedule.isPending ||
    updateSchedule.isPending ||
    deleteSchedule.isPending;

  const handleAddSchedule = (values: ScheduleAPI) => {
    addSchedule.mutate(values, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey.some(
              (key) => key === "schedules" || key === "children"
            ),
        });
        refetch();
      },
    });
  };

  const handleUpdateSchedule = (schedule: ScheduleAPI) => {
    updateSchedule.mutate(schedule, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey.some((key) => key === "schedules"),
        });
        setEditingScheduleId(null);
        refetch();
      },
    });
  };

  // Then update the handler:
  const handleDeleteSchedule = (id: string) => {
    setScheduleId(id);
    deleteSchedule.mutate(undefined, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey.some((key) => key === "schedules"),
        });
      },
    });
  };

  const childAvatar = child.avatarUrl;
  const childName = child.name;

  const handleClose = () => {
    setIsCreating(false);
    setEditingScheduleId(null);
    closeDialog();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Schedule</DialogTitle>
        </DialogHeader>

        <Item variant="outline">
          <ItemMedia>
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={
                  childAvatar ||
                  "https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/Portrait_placeholder.png/330px-Portrait_placeholder.png"
                }
              />
              <AvatarFallback>{"AA"}</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{childName}</ItemTitle>
          </ItemContent>
        </Item>

        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Schedules</h3>
          {!isCreating && !editingSchedule && (
            <Button
              size="sm"
              onClick={() => setIsCreating(true)}
              disabled={isPending}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Schedule
            </Button>
          )}
        </div>

        <ScrollArea className="h-[300px]">
          <div className="rounded-md border">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-muted-foreground"
                      >
                        No schedules yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    schedules.map((s) => {
                      return (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.day}</TableCell>
                          <TableCell>
                            <div className="inline-flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{s.startTime}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="inline-flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{s.endTime}</span>
                            </div>
                          </TableCell>
                          <TableCell className="flex gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={isPending}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-[140px]"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    setEditingScheduleId(s.id ?? "")
                                  }
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() =>
                                    handleDeleteSchedule(s.id ?? "")
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        {(isCreating || editingSchedule) && (
          <div className="mt-4 border-t pt-4">
            <ScheduleForm
              key={editingSchedule?.id || "create"}
              isLoading={isPending}
              defaultValues={
                editingSchedule
                  ? {
                      day: Object.values(DayOfWeek).includes(
                        editingSchedule.day
                      )
                        ? editingSchedule.day
                        : DayOfWeek.SUNDAY,
                      startTime: editingSchedule.startTime,
                      endTime: editingSchedule.endTime,
                      timezone: "Asia/Jakarta",
                    }
                  : undefined
              }
              onCancel={() => {
                setIsCreating(false);
                setEditingScheduleId(null);
              }}
              onSubmit={(values) => {
                if (editingSchedule && editingSchedule.id) {
                  handleUpdateSchedule(values);
                } else {
                  handleAddSchedule(values);
                }
              }}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
