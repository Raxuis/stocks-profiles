"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";


interface DatePickerProps {
  className?: React.HTMLAttributes<HTMLDivElement>;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}

export default function DateRangePicker({
  className, date, setDate
}: DatePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to midnight
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() - 1); // Set max date to yesterday

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full sm:w-[300px] justify-center text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "yyyy-MM-dd")} -{" "}
                  {format(date.to, "yyyy-MM-dd")}
                </>
              ) : (
                format(date.from, "yyyy-MM-dd")
              )
            ) : (
              <span>Pick a from and to date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
            toDate={maxDate} // Set max date to yesterday
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
