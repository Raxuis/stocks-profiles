/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from 'react';
import { getStockProfile } from '@/features/stocks/stock.action';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { useZodForm, Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Badge from '@/components/pages-components/stock-profile/Badge';
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import type { StockDatasType } from "@/types/StockDatas.type";
import createQuery from '@/features/stock-profile/createQuery';
import { useSession } from 'next-auth/react';
import { useQueryState } from 'nuqs';
import { FormProfileSchema } from '@/lib/validation';
import { cn } from '@/lib/utils';
import { AiOutlineLoading } from 'react-icons/ai';

let stocksData: StockDatasType[];

const StockProfile = () => {
  const [localStockSymbolFormatted, setLocalStockSymbolFormatted] = useState<StockDatasType[]>([]);
  const [stock, setStock] = useQueryState('stock');

  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      setIsLoggedIn(true);
    }
  }, [status]);

  useEffect(() => {
    const fetchData = () => {
      if (typeof window !== 'undefined') {
        const localStockSymbol = localStorage.getItem('stockSymbol') || '';
        if (localStockSymbol) {
          setLocalStockSymbolFormatted(JSON.parse(localStockSymbol));
        }
      }
    };

    fetchData();
  }, []);

  const form = useZodForm({
    schema: FormProfileSchema,
    defaultValues: {
      symbol: stock || '',
    },
  });

  const onSubmit = async (data: z.infer<typeof FormProfileSchema>) => {
    try {
      setIsLoading(true);
      stocksData = await getStockProfile(data.symbol);
      const date = new Date();
      const isoDate = date.toISOString();

      stocksData = stocksData.map(stock => ({
        ...stock,
        queriedAt: isoDate,
      }));

      toast({
        title: "📈 Wow 📈",
        description: (
          <p className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">That&apos;s one small step for man, one giant leap for Stocks!</p>
        ),
      });

      localStorage.setItem("stockSymbol", JSON.stringify(stocksData));
      setLocalStockSymbolFormatted(stocksData);
      await createQuery(data.symbol, "StockProfile");
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "❌ You entered a wrong symbol ❌",
        description: (
          <p className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 text-red-500">Please, try rewriting your Stock Symbol. 😀</p>
        ),
      });
      setIsLoading(false);
    }
  };

  const calculateTimeDifference = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
  };

  if (!isLoggedIn) {
    return <p>You are not logged in, please log in to see stock-profile page.</p>;
  }

  return (
    <>
      <Form form={form} onSubmit={onSubmit}>
        <FormField
          name="symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock&apos;s Symbol</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  placeholder="Symbol"
                  {...field}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.symbol?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Button type="submit" className='mt-3 max-sm:w-full'>
          {
            isLoading
              ? <AiOutlineLoading className='animate-spin' />
              : 'Search'
          }
        </Button>
      </Form>
      {localStockSymbolFormatted && (
        <div className='mt-8 flex justify-center'>
          {localStockSymbolFormatted.map((stock) => (
            <Card key={stock.symbol} className='w-full sm:w-2/3 md:w-1/2'>
              <CardHeader className='flex items-center px-10 py-6'>
                {stock.image && <img src={stock.image} alt={stock.symbol} className='size-20' />}
                <div className='flex flex-col space-y-1.5 p-6'>
                  {stock.companyName && <CardTitle className='flex items-center'> {stock.companyName} {stock.symbol}</CardTitle>}
                  {stock.ceo && <CardDescription>CEO: {stock.ceo}</CardDescription>}
                  {stock.queriedAt && <CardDescription>Queried: {calculateTimeDifference(stock.queriedAt)}</CardDescription>}
                </div>
              </CardHeader>
              <CardContent className='flex flex-col space-y-6 '>
                <div className='space-y-4 px-2'>
                  {stock.sector && <p>Sector: {stock.sector}</p>}
                  <div className='flex gap-4'>
                    {stock.price && <p className='text-xl'>Price: {stock.price} {stock.currency}</p>}
                    {stock.changes && <Badge value={stock.changes} currency={stock.currency} />}
                  </div>
                </div>
                {stock.website && <a href={stock.website} target='_blank' className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'text-ellipsis overflow-hidden')}>{stock.website}</a>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

export default StockProfile;
