import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Settings() {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-base text-muted-foreground lg:text-lg">Theme</p>
        <ThemeSwitcher />
      </div>
    </div>
  );
}
