"use client";

// External Imports
import { GeistMono } from "geist/font/mono";
import { useEffect, useState } from "react";
import { TbClipboardCheck, TbCopy, TbServer, TbX } from "react-icons/tb";
import { toast } from "sonner";

// Local Imports
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils/cn";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Badge, BadgeProps } from "../ui/badge";
import { Button } from "../ui/button";

interface Props {
  title: string;
  description: string;
  variant: "public" | "admin";
};

const textMap: Record<Props["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<Props["variant"], BadgeProps["variant"]> = {
  public: "default",
  admin: "destructive",
};

export const ApiAlert = ({
  title,
  description,
  variant = "public"
}: Props) => {
  const [descCopied, setDescCopied] = useState(false);

  useEffect(() => {
    if (descCopied) {
      setTimeout(() => {
        setDescCopied(false);
      }, 3000);
    }
  }, [descCopied]);

  const onCopy = (description: string) => {
    if (descCopied) return;

    navigator.clipboard.writeText(description);
    setDescCopied(true);
    toast.success("API Route copied!");
  };

  return (
    <Alert>
      <TbServer
        size={useMediaQuery("(min-width: 768px)") ? 24 : 22}
      />

      <div className="flex items-center justify-between">
        <AlertTitle className="flex items-center gap-3">
          {title}
          <Badge variant={variantMap[variant]}>
            {textMap[variant]}
          </Badge>
        </AlertTitle>
        {/* <Button
          onClick={() => onCopy(description)}
          variant={"outline"}
          size={"icon"}
          className="flex-none"
        >
          {descCopied ?
            <TbClipboardCheck size={20} /> :
            <TbCopy size={20} />}
        </Button> */}
      </div>

      <div className="absolute top-2 right-2 md:top-3 md:right-3">
        <Button
          onClick={() => onCopy(description)}
          variant={"outline"}
          size={"icon"}
          className="flex-none"
        >
          {descCopied ?
            <TbClipboardCheck size={20} /> :
            <TbCopy size={20} />}
        </Button>
      </div>

      <AlertDescription
        className={cn(
          "flex items-center justify-between gap-4 md:gap-6 mt-4",
          GeistMono.className
        )}
      >
        <code className="relative rounded-md px-2 py-1 text-sm font-semibold bg-neutral-100 dark:bg-neutral-900">
          {description}
        </code>
      </AlertDescription>
    </Alert>
  );
};
