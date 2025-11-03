"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function BreadcrumbCSeparator() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Define keywords that should NOT be clickable
  const nonClickableKeywords = ["resource-requirement","action"];

  function getLabel(slug: string) {
    return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  }

  // Check if a segment should be clickable
  function isClickable(segment: string, isLast: boolean) {
    if (isLast) return false; // Last segment is never clickable
    
    // Check if segment matches any non-clickable keywords
    return !nonClickableKeywords.some(keyword => 
      segment.toLowerCase() === keyword.toLowerCase()
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment, idx) => {
          const url = "/" + segments.slice(0, idx + 1).join("/");
          const isLast = idx === segments.length - 1;
          const clickable = isClickable(segment, isLast);

          return (
            <span
              key={url}
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {!clickable ? (
                  <BreadcrumbPage className="text-muted-foreground">{getLabel(segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={url}>{getLabel(segment)}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}