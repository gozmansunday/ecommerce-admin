// Libs
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
};

const AuthLayout = ({ children }: Readonly<Props>) => {
  return (
    <div className="flex items-center justify-center h-full">
      {children}
    </div>
  );
};

export default AuthLayout;