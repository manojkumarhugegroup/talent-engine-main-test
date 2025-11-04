import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { JDEditDrawer } from "./jd/EditDrawer";
import { downloadStyledMarkdownPdf } from "./jd/pdf";
import { toast } from "sonner";
import ScrollableShadowBox from "@/components/layout/ScrollableShadowBox";
import { useSearchParams } from "next/navigation";
import { JDContentSection } from "@/components/shared/JDContentSection";

export function JD() {
  const [activeTab, setActiveTab] = useState("0");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const searchParams = useSearchParams();
  const job_id = searchParams.get("d");

  const [jobDescription, setjobDescription] = useState("");

  const [advertisedPosition, setadvertisedPosition] = useState("");

  const [loading, setLoading] = useState<boolean>(false);

  const fetchJD = async () => {
    try {
      setLoading(true);
      const payload = {
        rr_name: job_id,
      };
      const endpoint = `/api/rr/info/jddetails`;
      const res = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Failed: ${res.status} ${res.statusText}`);
      }
      const responseData = await res.json();
      if (responseData?.message?.status === "success") {
        const data = responseData.message;
        setjobDescription(data?.job_description);
        setadvertisedPosition(data?.advertised_position);
      } else {
        setjobDescription("");
        setadvertisedPosition("");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setjobDescription("");
      setadvertisedPosition("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJD();
  }, []);

  const handleEditClick = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleDownload = () => {
    const content = activeTab === "0" ? advertisedPosition : jobDescription;
    const tabName =
      activeTab === "0" ? "Advertised Position" : "Job Description";

    downloadStyledMarkdownPdf(content, tabName, `${tabName}.pdf`);
  };

  const handleCopy = async () => {
    const content = activeTab === "0" ? advertisedPosition : jobDescription;

    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy");
    }
  };

  return (
    <ScrollableShadowBox>
      <div className="w-full min-w-0">
        <Tabs
          defaultValue="0"
          value={activeTab}
          onValueChange={setActiveTab}
          className="px-4 col-span-4 gap-0"
        >
          <div className="flex justify-between items-center">
            <TabsList className="bg-(--login-bg) rounded h-10">
              <TabsTrigger
                value="0"
                className="data-[state=active]:bg-card data-[state=active]:text-label text-sm rounded cursor-pointer px-4 py-1"
              >
                Advertised Position
              </TabsTrigger>
              <TabsTrigger
                value="1"
                className="data-[state=active]:bg-card data-[state=active]:text-label text-sm rounded cursor-pointer px-4 py-1"
              >
                Job Description
              </TabsTrigger>
            </TabsList>
            <div className="flex w-full justify-end gap-2 px-2">
              <div
                className="bg-[var(--edit-bg)] rounded w-8 h-8 hover:bg-[var(--edit-bg)] flex items-center justify-center cursor-pointer"
                onClick={handleEditClick}
              >
                <img
                  src="/assets/icons/job-info/edit.svg"
                  alt="Edit"
                  className="w-3 h-3"
                />
              </div>
              <div
                className="bg-[var(--copy-bg)] rounded w-8 h-8 hover:bg-[var(--copy-bg)] flex items-center justify-center cursor-pointer"
                onClick={handleCopy}
              >
                <img
                  src="/assets/icons/job-info/copy.svg"
                  alt="copy"
                  className="w-4 h-4"
                />
              </div>
              <div className="bg-[var(--share-bg)] rounded w-8 h-8 hover:bg-[var(--share-bg)] flex items-center justify-center cursor-pointer">
                <img
                  src="/assets/icons/job-info/share.svg"
                  alt="share"
                  className="w-4.5 h-4.5"
                />
              </div>
              <div
                className="bg-[var(--label)] rounded w-8 h-8 hover:bg-[var(--label)] flex items-center justify-center cursor-pointer"
                onClick={handleDownload}
                title="Download PDF"
              >
                <img
                  src="/assets/icons/job-info/download.svg"
                  alt="download"
                  className="w-3.5 h-3.5"
                />
              </div>
            </div>
          </div>
          <ScrollableShadowBox>
            <div className=" flex-1 flex-col h-[calc(80vh-6rem)]">
              <TabsContent value="0">
                <JDContentSection
                  loading={loading}
                  content={advertisedPosition}
                  fallbackText="Advertised Position Description not found"
                />
              </TabsContent>

              <TabsContent value="1">
                <JDContentSection
                  loading={loading}
                  content={jobDescription}
                  fallbackText="Job Description not found"
                />
              </TabsContent>
            </div>
          </ScrollableShadowBox>
        </Tabs>
      </div>
      <JDEditDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        activeTab={activeTab}
      />
    </ScrollableShadowBox>
  );
}
