"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, Clock, Plus, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScheduleFormDialog } from "./schedule-form-dialog";
import { DayOfWeek } from "@/lib/enums/day-of-week";
import { useScheduleStore } from "../hooks/use-schedule";
import { useShallow } from "zustand/shallow";
import { DialogLayout } from "@/components/dialog-layout";
import { format } from "date-fns"

export function ManageSchedulesDialog() {
  const {
    isOpen,
    child,
    schedules,
    isCreating,
    editingId,
    closeDialog,
    setIsCreating,
    setEditingId,
    addSchedule,
    updateSchedule,
    deleteSchedule,
  } = useScheduleStore(useShallow((state) => state));

  if (!child) return null;

  const editingSchedule = schedules.find((s) => s.id === editingId) || null;

  return (
    <DialogLayout
      isOpen={isOpen}
      onOpenChange={closeDialog}
      title="Manage Schedule"
    >
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={child.avatarUrl || "/placeholder.svg"}
                alt={`${child.name} avatar`}
              />
              <AvatarFallback>
                {child.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium leading-none">{child.name}</p>
              <p className="text-muted-foreground text-sm">
                Schedules: {schedules.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Schedules</h3>
        <Button
          size="sm"
          onClick={() => {
            setEditingId(null);
            setIsCreating(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Schedule
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
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
              schedules.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.day}</TableCell>
                  <TableCell>
                    <div className="inline-flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" />
                         <span>{format(new Date(s.startTime), "HH:mm")}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="inline-flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" />
                         <span>{format(new Date(s.endTime), "HH:mm")}</span>
                    </div>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[140px]">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingId(s.id ?? "");
                            setIsCreating(false);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => deleteSchedule(s.id ?? "")}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {(isCreating || editingSchedule) && (
        <div className="mt-2">
          <ScheduleFormDialog
            key={editingSchedule?.id || "create"}
            defaultValues={
              editingSchedule
                ? {
                    day: Object.values(DayOfWeek).includes(editingSchedule.day)
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
              setEditingId(null);
            }}
            onSubmit={(values) => {
              if (editingSchedule && editingSchedule.id) {
                updateSchedule(editingSchedule.id, values);
              } else {
                addSchedule(values);
              }
            }}
          />
        </div>
      )}
    </DialogLayout>
  );
}
