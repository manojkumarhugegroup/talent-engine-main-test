"use client";

import { useEffect, useState } from "react";
import { Bell, LucideBell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Notification {
  notification: string;
  date: string;
}
type JobOption = {
  id: string;
  title: string;
};

interface NotificationBellProps {
  onNotifications?: (notifications: JobOption[]) => void; // 👈 callback prop
}
export default function NotificationBell({
  onNotifications,
}: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPageCount = 5; // Adjust if needed
  const [open, setOpen] = useState(false);

  const fetchNotifications = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://mock.apidog.com/m1/1041944-1029173-default/api/rr`,
        {
          cache: "no-store",
        }
      );

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const responseData = await res.json();
      console.log("📡 dashboard notification", responseData.data);

      let fetched: Notification[] = [];

      if (
        responseData &&
        Array.isArray(responseData.data) &&
        responseData.data.length > 0 &&
        Array.isArray(responseData.data[0].notifications)
      ) {
        fetched = responseData.data[0].notifications;
        setNotifications(fetched);
      } else {
        console.warn("Unexpected API response structure:", responseData);
        setNotifications([]);
      }

      // 👈 send to parent
      if (onNotifications) {
        // Convert API response -> JobOption[]
        const jobsData: JobOption[] = responseData.data.map(
          (job: { name: string; job_title: string }) => ({
            id: job.name,
            title: job.job_title,
          })
        );

        onNotifications(jobsData); // 👈 send JobOption[] to parent
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
      if (onNotifications) {
        onNotifications([]); // still notify parent
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative p-2 rounded-md hover:bg-gray-100 cursor-pointer"
          aria-label="Notifications"
        >
          <LucideBell
            fill="#6C757D"
            className="h-5 w-5 stroke-[#6C757D]"
            aria-hidden="true"
          />
          {!loading && notifications.length > 0 && (
            <span className="absolute -top-1 -right-0.5 flex items-center justify-center w-5 h-5 bg-red-600 text-white text-[10px] p-0.5 font-semibold rounded-full border-2 border-white">
              {notifications.length > 9 ? "9+" : notifications.length}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 max-h-60 overflow-y-auto"
      >
        {loading ? (
          <div className="p-2 text-center text-sm text-gray-500">
            Loading...
          </div>
        ) : notifications.length > 0 ? (
          notifications.slice(0, 10).map((item, idx) => (
            <DropdownMenuItem
              key={idx}
              onClick={(e) => {
                toast("Application Declined", {
                  description: "The candidate application has been declined.",
                  icon: <Bell className="text-green-500 mr-2" />,
                  style: {
                    backgroundColor: "#dcfce7",
                    color: "#166534",
                  },
                });
                setOpen(false);
                e.stopPropagation();
              }}
              className="flex flex-col text-sm capitalize"
            >
              <span className="font-semibold capitalize">
                {item.notification}
              </span>
              <span className="text-xs text-muted-foreground">{item.date}</span>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
