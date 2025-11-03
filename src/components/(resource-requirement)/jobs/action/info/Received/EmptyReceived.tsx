import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation";

export const EmptyCard = () => {

  const searchParams = useSearchParams();
  const router = useRouter();
      const handleClickShortlisted = () => {
    const value = "4";
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };
    return (
        <div className="w-full h-[600px] flex flex-col items-center justify-center text-center space-y-6 bg-card rounded-md border border-gray-200 shadow-sm">
            {/* Icon */}
            <div className="text-gray-400">
                <img src={'/assets/icons/job-info/rejected-file.svg'} alt="" />
            </div>

            {/* Message */}
            <p className="text-gray-600 text-sm sm:text-base w-full md:w-1/2 mx-auto">
                We're on it! Better-matched candidate profiles will be heading your way soon.
            </p>

            {/* Button */}
            <Button  onClick={handleClickShortlisted} className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-md">
                View shortlisted candidates
            </Button>
        </div>
    )
}