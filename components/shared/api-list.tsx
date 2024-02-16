"use client";

// Global Imports
import { useParams } from "next/navigation";

// Local Imports
import { useOrigin } from "@/hooks/useOrigin";
import { ApiAlert } from "./api-alert";

interface Props {
  entityName: string;
  entityIdName: string;
};

export const ApiList = ({ entityName, entityIdName }: Props) => {
  const params = useParams();
  const origin = useOrigin();

  const baseUrl = `${origin}/api/${params.storeId}`;

  return (
    <div className="flex flex-col gap-4">
      <ApiAlert
        title="GET"
        description={`${baseUrl}/${entityName}`}
        variant="public"
      />
      <ApiAlert
        title="GET"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
        variant="public"
      />
      <ApiAlert
        title="POST"
        description={`${baseUrl}/${entityName}`}
        variant="admin"
      />
      <ApiAlert
        title="PATCH"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
        variant="admin"
      />
      <ApiAlert
        title="DELETE"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
        variant="admin"
      />
    </div>
  );
};
