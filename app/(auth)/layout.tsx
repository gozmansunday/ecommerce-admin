// Global Imports
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="flex items-center justify-center h-full">
      {children}
    </div>
  );
};

export default AuthLayout;