import { SadGhost } from "@mynaui/icons-react";

export default function NotFound() {
  return (
    <div className="my-12 w-full space-y-3 text-center">
      <SadGhost className="mx-auto size-12 text-muted-foreground" />
      <h1 className="text-3xl text-muted-foreground">Page Not Found</h1>
      <p className="text-muted-foreground">
        It seems the page you are looking for has vanished into thin air.
      </p>
    </div>
  );
}
