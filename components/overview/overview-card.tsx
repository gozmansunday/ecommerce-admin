"use client";

// External Imports
import { IconType } from "react-icons/lib";

// Local Imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  title: string;
  icon: IconType;
  content: string | number;
};

export const OverviewCard = ({ title, icon: Icon, content }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-4 w-full">
          <span className="text-base font-bold lg:text-lg">{title}</span>
          <Icon
            className="text-2xl text-neutral-500 lg:text-3xl"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold lg:text-5xl">
          {content}
        </div>
      </CardContent>
    </Card>
  );
};
