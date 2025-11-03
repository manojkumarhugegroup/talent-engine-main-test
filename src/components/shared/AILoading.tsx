import { cn } from "@/lib/utils";

interface GalaxyAILoaderProps {
  isLoading?: boolean;
  className?: string;
}

export function AILoader({ isLoading = true, className }: GalaxyAILoaderProps) {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-10 flex items-center justify-center select-none",
        "bg-black/30 backdrop-blur",
        "bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-blue-900/40",
        className
      )}
      aria-busy="true"
      role="status"
      aria-label="Loading AI content"
    >
      {/* Main container */}
      <div className="flex flex-col items-center space-y-6">
        {/* Animated AI icons loader */}
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400/20 via-violet-400/20 to-cyan-400/20 blur animate-pulse" />

          {/* Main AI icon container */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* Primary AI icon - animated */}
            <div className="relative animate-pulse">
              <img
                src={"/assets/icons/job-info/loraAi.svg"}
                alt="AI"
                className="w-12 h-12 animate-bounce drop-shadow-lg"
                style={{
                  filter: "drop-shadow(0 0 8px rgba(0, 255, 255, 0.6))",
                  animationDuration: "2s",
                }}
              />

              {/* Overlaying darker AI icon with different animation */}
              <img
                src={"/assets/icons/job-info/loraAI_w.svg"}
                alt="AI"
                className="absolute inset-0 w-12 h-12 animate-ping opacity-60"
                style={{
                  filter: "drop-shadow(0 0 12px rgba(139, 92, 246, 0.8))",
                  animationDuration: "3s",
                }}
              />
            </div>
          </div>

          {/* Orbiting AI icons */}
          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "4s" }}
          >
            <img
              src={"/assets/icons/job-info/loraAI_w.svg"}
              alt="AI"
              className="absolute -top-2 left-1/2 w-3 h-3 transform -translate-x-1/2 opacity-80"
              style={{ filter: "drop-shadow(0 0 4px rgba(0, 255, 255, 0.8))" }}
            />
          </div>
          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "6s", animationDirection: "reverse" }}
          >
            <img
              src={"/assets/icons/job-info/loraAI_w.svg"}
              alt="AI"
              className="absolute -bottom-2 left-1/2 w-2.5 h-2.5 transform -translate-x-1/2 opacity-70"
              style={{ filter: "drop-shadow(0 0 4px rgba(139, 92, 246, 0.8))" }}
            />
          </div>
          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "5s" }}
          >
            <img
              src={"/assets/icons/job-info/loraAi.svg"}
              alt="AI"
              className="absolute top-1/2 -right-2 w-2 h-2 transform -translate-y-1/2 opacity-60"
              style={{ filter: "drop-shadow(0 0 3px rgba(0, 255, 255, 0.6))" }}
            />
          </div>
          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "4s" }}
          >
            <img
              src={"/assets/icons/job-info/loraAi.svg"}
              alt="AI"
              className="absolute top-1/2 -right-2 w-2 h-2 transform -translate-y-1/2 opacity-60"
              style={{ filter: "drop-shadow(0 0 3px rgba(0, 255, 255, 0.6))" }}
            />
          </div>
          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "4s", animationDirection: "reverse" }}
          >
            <img
              src={"/assets/icons/job-info/loraAi.svg"}
              alt="AI"
              className="absolute top-1/2 -right-2 w-2 h-2 transform -translate-y-1/2 opacity-60"
              style={{ filter: "drop-shadow(0 0 3px rgba(0, 255, 255, 0.6))" }}
            />
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center space-y-2">
          {/* <div className="wordsLoader">
            <p>loading</p>
            <div className="words">
              <span className="word">buttons</span>
              <span className="word">forms</span>
              <span className="word">switches</span>
              <span className="word">cards</span>
              <span className="word">buttons</span>
            </div>
          </div> */}
          <p className="text-lg font-semibold tracking-wide text-primary">
            Generating with Lora...
          </p>
        </div>
      </div>

      {/* Ambient Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-400/50 rounded-full blur animate-pulse" />

      <div
        className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-violet-400/50 rounded-full blur-xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div
        className="absolute top-10 right-1/3 w-20 h-20 bg-blue-400/50 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: "0.5s" }}
      />

      <div
        className="absolute bottom-10 left-1/3 w-28 h-28 bg-purple-500/50 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: "1.5s" }}
      />

      <div
        className="absolute top-1/2 left-10 w-16 h-16 bg-cyan-300/50 rounded-full blur-xl animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      <div
        className="absolute bottom-1/2 right-10 w-14 h-14 bg-fuchsia-400/50 rounded-full blur-xl animate-pulse"
        style={{ animationDelay: "2.5s" }}
      />

      <div
        className="absolute top-[30%] right-[20%] w-20 h-20 bg-cyan-500/50 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "0.75s" }}
      />

      <div
        className="absolute bottom-[30%] left-[15%] w-24 h-24 bg-indigo-400/50 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1.25s" }}
      />
    </div>
  );
}
