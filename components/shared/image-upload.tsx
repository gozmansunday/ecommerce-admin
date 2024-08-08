"use client";

// External Imports
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TbPhotoPlus, TbTrashFilled } from "react-icons/tb";
import { Button } from "../ui/button";

interface Props {
  disabled: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
};

export const ImageUpload = ({
  disabled,
  onChange,
  onRemove,
  value
}: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {value.length !== 0 && (
        <div className="flex flex-col items-center gap-4 md:flex-row">
          {value.map((url) => (
            <div
              key={url}
              className="relative w-full aspect-[3/2] rounded-md overflow-hidden md:w-96 md:rounded-lg"
            >
              <Image
                src={url}
                alt="Image"
                fill
                className="object-cover"
              />
              <div className="absolute top-3 right-3">
                <Button
                  type="button"
                  onClick={() => onRemove(url)}
                  variant={"destructive"}
                  size={"icon"}
                >
                  <TbTrashFilled size={20} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <CldUploadWidget
        onUpload={onUpload}
        uploadPreset="ryhoyipq"
      >
        {({ open }) => (
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => open()}
            className="gap-2 self-stretch md:self-start"
          >
            <TbPhotoPlus size={20} />
            <span>Upload an Image</span>
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
};
