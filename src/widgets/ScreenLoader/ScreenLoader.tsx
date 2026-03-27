import { Spinner } from "@/components/ui/spinner";

export const ScreenLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner className="size-12" color="#3572FF"/>
    </div>
  );
};
