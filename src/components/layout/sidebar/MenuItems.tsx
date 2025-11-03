import { MenuItem } from "@/types/layout.types";
import { Dot, Home, Inbox, Settings, User } from "lucide-react";

export const menuItems: MenuItem[] = [
    {
        title: "Dashboard",
        icon: '/assets/icons/dashboard.svg',
        url: "/dashboard"
    },
    {
        title: "resource requirements",
        icon: '/assets/icons/cart.svg',
        // badge: 0
        subitems: [
            {
                title: "Jobs",
                icon: '/assets/icons/ellipse.svg',
                url: "/resource-requirement/jobs"
            },
            {
                title: "Hiring Team",
                icon: '/assets/icons/ellipse.svg',
                url: "/resource-requirement/hiring-team"
            }
        ]
    },
    // {
    //     title: "Generate JD",
    //     icon: '/assets/icons/report.svg',
    //     url: "/"
    //  },
      {
        title:"Time Sheet",
        icon:"/assets/icons/timesheet.png",
        url:"/time-sheet"
     }
];