"use client";

// Global Imports
import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";
import { TbBuildingStore, TbCheck, TbCirclePlus, TbLoader, TbSelector } from "react-icons/tb";

// Local Imports
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useStoreModal } from "@/hooks/useStoreModal";
import { cn } from "@/lib/utils/cn";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../ui/command";
import { Drawer, DrawerContent, DrawerFooter, DrawerTrigger } from "../ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

// Types
type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface Props extends PopoverTriggerProps {
  items: Store[];
};

export const StoreSwitcher = ({ className, items = [], }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Navigation
  const router = useRouter();
  const params = useParams();

  // Create Store Modal State
  const storeModal = useStoreModal();

  // useStates
  const [isMounted, setIsMounted] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [clickedStoreId, setClickedStoreId] = useState("");

  // Display Store Switcher only when the component is a client.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // If it isn't a client component, don't display the store switcher.
  if (!isMounted) {
    return null;
  }

  const formattedItems = items.map((i) => ({
    label: i.name,
    id: i.id,
  }));

  const currentStore = formattedItems.find((i) => i.id === params.storeId);

  const onStoreSelect = (store: { label: string, id: string }) => {
    setClickedStoreId(store.id);

    // setPopoverOpen(false);
    router.push(`/${store.id}`);
  };

  if (isDesktop) return (
    <Popover
      open={popoverOpen}
      onOpenChange={setPopoverOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size={"combo"}
          role="combobox"
          aria-expanded={popoverOpen}
          aria-label="Select a store"
          className={cn(
            "w-[12.5rem] justify-between gap-2 md:w-[15rem]",
            className
          )}
        >
          <TbBuildingStore
            size={18}
            className="shrink-0"
          />
          <span className="line-clamp-1 overflow-auto">{currentStore?.label}</span>
          <TbSelector
            size={18}
            className="ml-auto shrink-0 text-neutral-400 dark:text-neutral-600"
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[12.5rem] p-0 md:w-[15rem]">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems.map((store) => (
                <CommandItem
                  key={store.id}
                  value={store.label}
                  onSelect={() => {
                    onStoreSelect(store);
                  }}
                  className="justify-between gap-2"
                >
                  {clickedStoreId === store.id ? (
                    <TbLoader
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <TbBuildingStore
                      size={18}
                    />
                  )}
                  <span className="line-clamp-1">{store.label}</span>
                  <TbCheck
                    size={18}
                    className={cn(
                      "ml-auto",
                      currentStore?.id === store.id ?
                        "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setPopoverOpen(false);
                  storeModal.onOpen();
                }}
                className="gap-2"
              >
                <TbCirclePlus size={20} />
                <span>Create New Store</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );

  return (
    <Drawer
      open={popoverOpen}
      onOpenChange={setPopoverOpen}
    >
      <DrawerTrigger asChild>
        <Button
          variant={"outline"}
          size={"combo"}
          aria-expanded={popoverOpen}
          aria-label="Select a store"
          className={cn(
            "w-[12.5rem] justify-between gap-2 md:w-[15rem]",
            className
          )}
        >
          <TbBuildingStore
            size={18}
            className="shrink-0"
          />
          <span className="line-clamp-1 overflow-auto">{currentStore?.label}</span>
          <TbSelector
            size={18}
            className="ml-auto shrink-0 text-neutral-400 dark:text-neutral-600"
          />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-0">
        <div className="mt-4 border-t">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search store..." />
              <CommandEmpty>No store found.</CommandEmpty>
              <CommandGroup heading="Stores">
                {formattedItems.map((store) => (
                  <CommandItem
                    key={store.id}
                    value={store.label}
                    onSelect={() => {
                      onStoreSelect(store);
                    }}
                    className="justify-between gap-2"
                  >
                    {clickedStoreId === store.id ? (
                      <TbLoader
                        size={18}
                        className="animate-spin"
                      />
                    ) : (
                      <TbBuildingStore
                        size={18}
                      />
                    )}
                    <span className="line-clamp-1">{store.label}</span>
                    <TbCheck
                      size={18}
                      className={cn(
                        "ml-auto",
                        currentStore?.id === store.id ?
                          "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setPopoverOpen(false);
                    storeModal.onOpen();
                  }}
                  className="gap-2"
                >
                  <TbCirclePlus size={20} />
                  <span>Create New Store</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </DrawerContent>
      <DrawerFooter />
    </Drawer>
  );
};
