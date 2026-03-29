import { useRef, useEffect } from "react";
import { useVideoCall } from "@/hooks/use-appointments";
import { Video, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface VideoPanelProps {
  appointmentId: string;
  userName?: string;
  onJoined?: () => void;
  onApiReady?: () => void;
}

export function VideoPanel({
  appointmentId,
  userName,
  onJoined,
  onApiReady,
}: VideoPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const { status, error, joinCall } = useVideoCall({
    onJoined,
    onApiReady,
    userName,
  });

  useEffect(() => {
    if (appointmentId && containerRef.current && !startedRef.current) {
      startedRef.current = true;
      joinCall(appointmentId, containerRef.current);
    }
  }, [appointmentId, joinCall]);

  return (
    <Card className="h-full flex flex-col bg-white border-0 rounded-xl overflow-hidden shadow-2xl">

      {/* Video Container */}
      <div className="flex-1 relative min-h-[400px]">
        {/* The actual container for Daily Iframe */}
        <div ref={containerRef} className="absolute inset-0 z-10" />

        {/* Initial Loading Overlay (Only until Iframe is ready/loaded) */}
        {(status === "loading" || status === "idle") && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-blue-600 animate-spin" />
              <Video className="absolute inset-0 m-auto h-6 w-6 text-blue-600" />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-600">
              Đang chuẩn bị phòng tư vấn...
            </p>
          </div>
        )}

        {/* Error State Overlay */}
        {status === "error" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-white">
            <div className="bg-red-50 p-4 rounded-full mb-4 border border-red-100">
              <VideoOff className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-lg font-bold text-slate-900 mb-2">Không thể kết nối video</p>
            <p className="text-sm text-slate-500 mb-6 max-w-sm">
              {error || "Đã xảy ra lỗi không xác định. Vui lòng thử lại."}
            </p>
            <Button
              variant="default"
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px] shadow-sm"
              onClick={() => {
                startedRef.current = false;
                if (containerRef.current) {
                  joinCall(appointmentId, containerRef.current);
                }
              }}
            >
              Thử lại ngay
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
