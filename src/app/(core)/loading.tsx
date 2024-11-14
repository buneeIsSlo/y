import { Spinner } from "@mynaui/icons-react";

export default function Loading() {
  return (
    <div className="mx-auto flex max-w-sm animate-pulse flex-col items-center gap-2">
      <Spinner className="animate-spin text-muted-foreground" />
      <p className="text-center text-muted-foreground">
        Cool content being loaded. Please wait...
      </p>
    </div>
  );
}
