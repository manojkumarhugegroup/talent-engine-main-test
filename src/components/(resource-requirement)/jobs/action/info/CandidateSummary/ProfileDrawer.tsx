import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { CandidateSummaryTypes } from '@/types/jobs/info.types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import ProfileSummary from './ProfileSummary';
import QuickSummary from './QuickSummary';
import { ProfileDataType } from '@/types/jobs/Info/profile.type';

interface ProfileDrawerProps {
    candidate: CandidateSummaryTypes |null;
}


const ProfileDrawer = ({ candidate }: ProfileDrawerProps) => {
    const [data, setData] = useState<ProfileDataType | null>(null);
    const [open, setOpen] = useState(false); // Track Sheet open state
    const [loading, setLoading] = useState(false);
    console.log("came inside", candidate);
    

      if (!candidate) {
        console.log("comming from the drawer", candidate);
        
    return null;
  }

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/rr/info/profile", { cache: "no-store" });
            const result = await res.json();
            setData(result.data as ProfileDataType); // Assuming API returns { data: {...} }
        } catch (error) {
            console.error("Error fetching profile:", error);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            fetchProfile(); // Fetch only when opening
        }
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost" size={"sm"}

                    className="text-xs text-muted-foreground underline cursor-pointer h-4 px-0"
                >
                    {candidate.candidate_id}
                </Button>
            </SheetTrigger>

            <SheetContent className="w-auto !max-w-none h-screen flex flex-col gap-0">
                <SheetHeader className="p-2 border-b bg-card">
                    <SheetTitle className="flex items-center">
                        <SheetClose asChild>
                            <Button type="button" variant="ghost" className="h-5 w-5 p-0">
                                <ChevronLeft className="h-3.5 w-3.5" />
                            </Button>
                        </SheetClose>
                        <p className="text-lg font-semibold ml-2">Profile Info</p>
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 p-4 bg-card overflow-auto">
                    {loading ? (
                        <p className="text-sm text-muted-foreground">Loading profile...</p>
                    ) : data ? (
                        <Tabs defaultValue="quick-summary">
                            <TabsList className="grid w-full max-w-sm grid-cols-2 bg-accent">
                                <TabsTrigger
                                    value="quick-summary"
                                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs"
                                >
                                    Quick Summary
                                </TabsTrigger>
                                <TabsTrigger
                                    value="profile-summary"
                                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs"
                                >
                                    Profile Summary
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="quick-summary">
                                <QuickSummary data={data} />
                            </TabsContent>

                            <TabsContent value="profile-summary" className="mt-3">
                                <ProfileSummary data={data} />
                            </TabsContent>
                        </Tabs>
                    ) : (
                        <p className="text-sm text-destructive">Failed to load profile data.</p>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default ProfileDrawer;
