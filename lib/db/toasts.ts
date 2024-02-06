import { toast } from "sonner";

export const successToast = (message: string, element?: JSX.Element) => {
  toast.success(message, {
    cancel: {
      label: element as unknown as string,
    },
  });
};

export const errorToast = (message: string, element?: JSX.Element) => {
  toast.error(message, {
    cancel: {
      label: element as unknown as string,
    },
  });
};

export const normalToast = (message: string, element?: JSX.Element) => {
  toast(message, {
    cancel: {
      label: element as unknown as string,
    },
  });
};

export const promiseToast = (message: string) => {
  toast.promise(
    Promise.resolve(),
    {
      loading: message,
    }
  );
};