import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ message, type = 'info', duration = 3000 }: ToastProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const icon = {
      success: <CheckCircle2 className="h-5 w-5 text-success-vivid" />,
      error: <AlertCircle className="h-5 w-5 text-destructive" />,
      info: <Info className="h-5 w-5 text-primary-500" />,
    }[type];

    toast({
      description: message,
      duration,
      className: {
        success: "bg-success-50 border-success-200 text-success-700",
        error: "bg-destructive/10 border-destructive/20 text-destructive",
        info: "bg-primary-50 border-primary-200 text-primary-700",
      }[type]
    });
  }, [message, type, duration, toast]);

  return null;
}; 