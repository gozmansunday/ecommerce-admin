// Local Imports
import { BillboardClient } from "@/components/billboards/billboard-client";

const BillboardsPage = () => {
  return (
    <main className="flex flex-col py-6">
      <div>
        <BillboardClient />
      </div>
    </main>
  );
};

export default BillboardsPage;