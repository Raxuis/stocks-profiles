"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import DateRangePicker from "@/components/pages-components/stock-chart/date-range-picker";
import TimeframeSelect from "@/components/pages-components/stock-chart/timeframe-select";
import { toast } from "@/components/ui/use-toast";
import { getStockChart } from "@/features/stocks/stock.action";
import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import createQuery from "@/features/stock-profile/createQuery";
import { StockChartValidationSchema } from "@/lib/validation";

import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { exportAsCSV, exportAsPDF } from "@/features/export/export";
import { Plus } from "lucide-react";
import { AiOutlineLoading } from "react-icons/ai";

type StockData = {
  date: string;
  open: number;
  close: number;
};

export default function StockChart() {

  const [chartData, setChartData] = useState<StockData[]>([]);
  const [exportSymbol, setExportSymbol] = useState<string>(""); // State to store the export symbol to avoid user changing it
  const [isLoading, setIsLoading] = useState(false);
  const currentDay = new Date();
  const dateWithoutCurrentDay = new Date(currentDay.setDate(currentDay.getDate() - 1));

  const form = useForm<z.infer<typeof StockChartValidationSchema>>({
    resolver: zodResolver(StockChartValidationSchema),
    defaultValues: {
      symbol: "",
      timeframe: "1hour",
      date: { from: dateWithoutCurrentDay, to: dateWithoutCurrentDay },
    },
  })

  const { data: session, status } = useSession();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      setIsLoggedIn(true);
    }
  }, [status]);

  if (!isLoggedIn) {
    return <p>You are not logged in, please log in to see stock-chart page.</p>;
  }

  const chartConfig = {
    open: {
      label: "Open",
      color: "#82ca9d",
    },
    close: {
      label: "Close",
      color: "#8884d8",
    },
  } satisfies ChartConfig;

  const onSubmit = async (values: z.infer<typeof StockChartValidationSchema>) => {
    try {
      setIsLoading(true);
      const response: StockData[] = await getStockChart({
        symbol: values.symbol,
        timeframe: values.timeframe,
        from: format(values.date.from, "yyyy-MM-dd"),
        to: format(values.date.to, "yyyy-MM-dd"),
      });

      const sortedData = response.sort((a: StockData, b: StockData) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setChartData(sortedData);
      setExportSymbol(values.symbol);

      await createQuery(values.symbol, "StockChart");
      toast({
        title: "Nice One 🥳",
        description: "Congratulations! That's a hell of a query!",
      });
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "❌ Something badly occurred. Please try again ❌",
      });
      setIsLoading(false);
    }
  };

  const chartDataString = JSON.stringify(chartData, null, 2);

  return (
    <div className="w-full space-y-6">
      <Form form={form} onSubmit={onSubmit}>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <div className="grid w-full items-center gap-1.5 sm:max-w-sm">
                    <Input placeholder="AAPL" {...field} />
                  </div>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <FormField name="date" render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Date</FormLabel>
              <DateRangePicker date={field.value} setDate={field.onChange} />
              <FormMessage className="text-red-400" />
            </FormItem>
          )} />
          <FormField name="timeframe" render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Timeframe</FormLabel>
              <TimeframeSelect timeframe={field.value} setTimeFrame={field.onChange} />
              <FormMessage className="text-red-400" />
            </FormItem>
          )} />

          <Button type="submit" className="max-sm:w-full" style={{ marginTop: '1rem' }}>
            {
              isLoading
                ? <AiOutlineLoading className='animate-spin' />
                : 'Submit'
            }
          </Button>
        </div>
      </Form>

      {chartData.length > 0 && (
        <div className='flex justify-center'>
          <Card className='mx-auto w-full p-2 max-sm:mb-20 sm:p-4'>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tickFormatter={(value) => format(value, "yyyy-MM-dd / HH:mm")}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    dataKey="open"
                    type="natural"
                    fill="var(--color-open)"
                    fillOpacity={0.4}
                    stroke="var(--color-open)"
                    stackId="a"
                  />
                  <Area
                    dataKey="close"
                    type="natural"
                    fill="var(--color-close)"
                    fillOpacity={0.4}
                    stroke="var(--color-close)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="max-sm:w-full">Export Chart datas</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-2">
                        <AlertDialogTitle>Export Chart datas</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to export the chart datas?</AlertDialogDescription>
                      </div>
                      <Plus size={24} className="rotate-45 cursor-pointer self-start text-white duration-300 hover:text-red-500" onClick={() => setOpen(false)} />
                    </div>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-2">
                    <div className="flex items-center justify-between gap-2">
                      <Button variant="outline" className="bg-red-700 text-white hover:bg-red-800 hover:text-white max-sm:w-full" onClick={() => {
                        exportAsPDF(chartDataString, `${exportSymbol}-datas.pdf`);
                        setOpen(false);
                      }}>Export as PDF</Button>
                      <Button variant="outline" className="bg-green-700 text-white hover:bg-green-800 hover:text-white max-sm:w-full" onClick={() => {
                        exportAsCSV(chartData, `${exportSymbol}-datas.csv`);
                        setOpen(false);
                      }}>Export as CSV</Button>
                    </div>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
