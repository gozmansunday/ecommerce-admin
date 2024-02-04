// Libs
import { UserButton } from "@clerk/nextjs";

const SetupPage = () => {
  return (
    <div className="flex items-center justify-between container py-4">
      <p>The setup page is a protected route!</p>
      <UserButton afterSignOutUrl="/sign-up" />
    </div>
  );
};

export default SetupPage;