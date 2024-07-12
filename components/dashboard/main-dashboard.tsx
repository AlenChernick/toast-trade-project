'use client';
import type { FC } from 'react';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { Monitor, Smartphone } from 'lucide-react';

const MainDashboard: FC = () => {
  const desktopColor = '#e11d4896';
  const mobileColor = '#046ff2e0';

  const chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: {
      icon: Monitor,
      label: 'Desktop',
      color: desktopColor,
    },
    mobile: {
      icon: Smartphone,
      label: 'Mobile',
      color: mobileColor,
    },
  } satisfies ChartConfig;

  return (
    <section className='flex w-full'>
      <Card className='flex flex-col w-full md:w-full md:px-5 md:h-[33.5rem]'>
        <CardHeader>
          <CardTitle className='text-center'>Latest Activity</CardTitle>
        </CardHeader>
        <CardContent className='px-0'>
          <ChartContainer
            config={chartConfig}
            className='min-h-[9.3rem] md:h-[27.5rem] w-full md:text-base'>
            <AreaChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='month'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                padding={{ left: 15, right: 15 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area dataKey='desktop' fill='var(--color-desktop)' radius={4} />
              <Area dataKey='mobile' fill='var(--color-mobile)' radius={4} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  );
};

export default MainDashboard;
