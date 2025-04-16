import { useAlertContext } from "@/context/AlertProvider";

export function useAlert() {
  const { showAlert } = useAlertContext();

  return {
    success: (msg: string) => showAlert({ message: msg, type: 'success' }),
    error: (msg: string) => showAlert({ message: msg, type: 'error' }),
    info: (msg: string) => showAlert({ message: msg, type: 'info' }),
  };
}
