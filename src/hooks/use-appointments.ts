import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useEffect, useRef } from "react";
import DailyIframe, { type DailyCall } from "@daily-co/daily-js";
import { toast } from "sonner";

import {
  appointmentService,
  type AppointmentListQuery,
  type CancelAppointmentPayload,
  type CreateAppointmentPayload,
  type AppointmentTypeFilter,
  type PublicDoctorQuery,
} from "@/services/appointment.service";

export const appointmentKeys = {
  myList: (params?: AppointmentListQuery) =>
    ["appointments", "my-patient", params] as const,
  detail: (appointmentId: string) =>
    ["appointments", "detail", appointmentId] as const,
  doctors: (params?: PublicDoctorQuery) =>
    ["doctors", "public", params] as const,
  specialties: () => ["doctors", "specialties"] as const,
  doctorSlots: (
    doctorId: string,
    date: string,
    appointmentType: AppointmentTypeFilter,
  ) => ["doctors", "slots", doctorId, date, appointmentType] as const,
  doctorSlotSummary: (
    doctorId: string,
    from: string,
    to: string,
    appointmentType: AppointmentTypeFilter,
  ) =>
    [
      "doctors",
      "slots",
      "summary",
      doctorId,
      from,
      to,
      appointmentType,
    ] as const,
  videoStatus: (appointmentId: string) =>
    ["appointments", "video-status", appointmentId] as const,
};

// ─── READ HOOKS ──────────────────────────────────────────────────────────────

export function useAppointments(params?: AppointmentListQuery) {
  return useQuery({
    queryKey: appointmentKeys.myList(params),
    queryFn: () => appointmentService.getMyAppointments(params),
  });
}

export function useAppointmentDetail(appointmentId?: string) {
  return useQuery({
    queryKey: appointmentKeys.detail(appointmentId || ""),
    queryFn: () => appointmentService.getAppointmentById(appointmentId || ""),
    enabled: Boolean(appointmentId),
  });
}

export function useSpecialties() {
  return useQuery({
    queryKey: appointmentKeys.specialties(),
    queryFn: () => appointmentService.getSpecialties(),
  });
}

export function usePublicDoctors(params?: PublicDoctorQuery) {
  return useQuery({
    queryKey: appointmentKeys.doctors(params),
    queryFn: () => appointmentService.getPublicDoctors(params),
  });
}

// ─── MUTATION HOOKS ──────────────────────────────────────────────────────────

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAppointmentPayload) =>
      appointmentService.createAppointment(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appointmentId,
      payload,
    }: {
      appointmentId: string;
      payload: CancelAppointmentPayload;
    }) => appointmentService.cancelAppointment(appointmentId, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
      void queryClient.invalidateQueries({
        queryKey: appointmentKeys.detail(variables.appointmentId),
      });
    },
  });
}

// ─── VIDEO CALL HOOKS ─────────────────────────────────────────────────────────

export function useJoinVideoCall() {
  return useMutation({
    mutationFn: (appointmentId: string) =>
      appointmentService.joinVideoCall(appointmentId),
  });
}

export function useLeaveVideoCall() {
  return useMutation({
    mutationFn: (appointmentId: string) =>
      appointmentService.leaveVideoCall(appointmentId),
  });
}

export function useVideoCallStatus(appointmentId: string) {
  return useQuery({
    queryKey: appointmentKeys.videoStatus(appointmentId),
    queryFn: () => appointmentService.getVideoCallStatus(appointmentId),
    enabled: Boolean(appointmentId),
  });
}

// ─── VIDEO CALL MANAGER HOOK (Daily.co) ──────────────────────────────────────

export type VideoCallStatus =
  | "idle"
  | "loading"
  | "loaded"
  | "joining"
  | "lobby"
  | "joined"
  | "left"
  | "error";

interface UseVideoCallOptions {
  onJoined?: () => void;
  onApiReady?: () => void;
  userName?: string;
}

export function useVideoCall(options?: UseVideoCallOptions) {
  const [status, setStatus] = useState<VideoCallStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [accessLevel, setAccessLevel] = useState<string | null>(null);
  const callObjectRef = useRef<DailyCall | null>(null);
  const joiningRef = useRef(false);
  const appointmentIdRef = useRef<string | null>(null);

  const onJoinedRef = useRef(options?.onJoined);
  const onApiReadyRef = useRef(options?.onApiReady);
  const userNameRef = useRef(options?.userName);

  useEffect(() => {
    onJoinedRef.current = options?.onJoined;
    onApiReadyRef.current = options?.onApiReady;
    userNameRef.current = options?.userName;
  }, [options?.onJoined, options?.onApiReady, options?.userName]);

  useEffect(() => {
    return () => {
      if (callObjectRef.current) {
        callObjectRef.current.destroy().catch(console.error);
      }
      joiningRef.current = false;
    };
  }, []);

  const requestAccess = useCallback(async () => {
    if (!callObjectRef.current) return;
    try {
      await callObjectRef.current.requestAccess({
        name: userNameRef.current || "Người tham gia",
        access: { level: "full" },
      });
    } catch (err) {
      console.error("Failed to request access:", err);
    }
  }, []);

  const joinCall = useCallback(
    async (appointmentId: string, containerRef: HTMLElement) => {
      if (!appointmentId || !containerRef) return;
      if (joiningRef.current) return;

      joiningRef.current = true;
      appointmentIdRef.current = appointmentId;

      try {
        setStatus("loading");
        setError(null);

        const data = await appointmentService.joinVideoCall(appointmentId);

        if (!data?.url) {
          throw new Error("Không nhận được thông tin phòng họp từ hệ thống.");
        }

        onApiReadyRef.current?.();

        if (callObjectRef.current) {
          await callObjectRef.current.destroy();
          callObjectRef.current = null;
        }

        const callFrame = DailyIframe.createFrame(containerRef, {
          iframeStyle: {
            width: "100%",
            height: "100%",
            border: "0",
            borderRadius: "12px",
            backgroundColor: "#FFFFFF",
          },
          showLeaveButton: true,
          showFullscreenButton: true,
          theme: {
            colors: {
              accent: "#1E73BE",
              accentText: "#FFFFFF",
              background: "#FFFFFF",
              baseText: "#000000",
            },
          },
        });

        callObjectRef.current = callFrame;

        let hasJoined = false;
        let joinTimeout: ReturnType<typeof setTimeout> | null = null;

        const cleanup = () => {
          joiningRef.current = false;
          if (joinTimeout) {
            clearTimeout(joinTimeout);
            joinTimeout = null;
          }
        };

        callFrame.on("loading", () => {
          setStatus("loading");
        });

        callFrame.on("loaded", () => {
          setStatus("loaded");
        });

        callFrame.on("joining-meeting", () => {
          setStatus("joining");
        });

        callFrame.on("joined-meeting", () => {
          hasJoined = true;
          setStatus("joined");
          cleanup();
          onJoinedRef.current?.();
        });

        callFrame.on("left-meeting", () => {
          if (!hasJoined) {
            setError("Kết nối bị ngắt trước khi tham gia");
            setStatus("error");
          } else {
            setStatus("left");
            if (appointmentIdRef.current) {
              appointmentService
                .leaveVideoCall(appointmentIdRef.current)
                .catch(console.error);
            }
          }
          cleanup();
        });

        callFrame.on("access-state-updated", (e: any) => {
          const level = e?.access?.level || "unknown";
          setAccessLevel(level);

          if (level === "lobby") {
            setStatus("lobby");
          } else if (level === "full") {
            if (hasJoined) setStatus("joined");
          }
        });

        callFrame.on("error", (e: unknown) => {
          console.error("Daily error:", e);
          const dailyError = e as Record<string, any>;
          const errorMsg =
            dailyError?.errorMsg || dailyError?.error?.msg || JSON.stringify(e);
          setError(errorMsg);
          setStatus("error");
          cleanup();
        });

        joinTimeout = setTimeout(() => {
          // Increased timeout to 60s for haircheck/lobby
          if (
            !hasJoined &&
            joiningRef.current &&
            status !== "lobby" &&
            status !== "loaded" &&
            status !== "joined"
          ) {
            setError(
              "Hết thời gian kết nối. Vui lòng kiểm tra camera/mic và thử lại.",
            );
            setStatus("error");
            cleanup();
            if (callObjectRef.current) {
              callObjectRef.current.destroy();
              callObjectRef.current = null;
            }
          }
        }, 60000);

        await callFrame.join({
          url: data.url + "?name=" + userNameRef.current,
        });
      } catch (err: unknown) {
        const error = err as Record<string, any>;
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          "Không thể thiết lập cuộc gọi.";
        setError(msg);
        setStatus("error");
        toast.error(msg);

        if (callObjectRef.current) {
          callObjectRef.current.destroy();
          callObjectRef.current = null;
        }
        joiningRef.current = false;
      }
    },
    [status],
  );

  const leaveCall = useCallback(async (appointmentId?: string) => {
    const id = appointmentId || appointmentIdRef.current;

    if (callObjectRef.current) {
      await callObjectRef.current.destroy();
      callObjectRef.current = null;
    }

    if (id) {
      appointmentService.leaveVideoCall(id).catch(console.error);
    }

    setStatus("idle");
    joiningRef.current = false;
  }, []);

  return {
    callObject: callObjectRef.current,
    status,
    error,
    accessLevel,
    joinCall,
    leaveCall,
    requestAccess,
  };
}
