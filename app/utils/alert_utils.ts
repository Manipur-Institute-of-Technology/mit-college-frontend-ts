import Swal, {
  type SweetAlertIcon,
  type SweetAlertOptions,
} from "sweetalert2";

const SWEET_ALERT_CONFIRM_COLOR = "#22c55e";
const SWEET_ALERT_CANCEL_COLOR = "#ef4444";

type ConfirmActionOptions = Omit<
  SweetAlertOptions,
  "showCancelButton"
>;

export const showAlert = (options: SweetAlertOptions) =>
  Swal.fire(options);

export const alertSuccess = (message: string) =>
  showAlert({
    icon: "success",
    text: message,
    confirmButtonColor: SWEET_ALERT_CONFIRM_COLOR,
  });

export const alertError = (message: string) =>
  showAlert({
    icon: "error",
    text: message,
    confirmButtonColor: SWEET_ALERT_CONFIRM_COLOR,
  });

export const alertWarning = (message: string) =>
  showAlert({
    icon: "warning",
    text: message,
    confirmButtonColor: SWEET_ALERT_CONFIRM_COLOR,
  });

export const alertInfo = (message: string) =>
  showAlert({
    icon: "info",
    text: message,
    confirmButtonColor: SWEET_ALERT_CONFIRM_COLOR,
  });

export const confirmAction = async (
  options: ConfirmActionOptions,
) => {
  const result = await showAlert({
    ...options,
    showCancelButton: true,

    // Same colors for every confirmation dialog
    confirmButtonColor: SWEET_ALERT_CONFIRM_COLOR,
    cancelButtonColor: SWEET_ALERT_CANCEL_COLOR,
  } as SweetAlertOptions);

  return result.isConfirmed;
};

export const showLoadingAlert = (options: SweetAlertOptions) =>
  Swal.fire({
    ...options,
    confirmButtonColor: SWEET_ALERT_CONFIRM_COLOR,
    cancelButtonColor: SWEET_ALERT_CANCEL_COLOR,
    didOpen: () => {
      Swal.showLoading();
    },
  } as SweetAlertOptions);

export const confirmDelete = async ({
  title = "Are you sure?",
  text = "This action cannot be undone.",
  confirmButtonText = "Delete",
  ...options
}: ConfirmActionOptions = {}) =>
  confirmAction({
    title,
    text,
    confirmButtonText,
    cancelButtonText: "Cancel",
    icon: "warning",
    ...options,
  });

export const confirmReject = async ({
  title = "Reject registration?",
  text,
  confirmButtonText = "Reject",
  ...options
}: ConfirmActionOptions = {}) =>
  confirmAction({
    title,
    text,
    confirmButtonText,
    cancelButtonText: "Cancel",
    icon: "warning",
    ...options,
  });

export const confirmApprove = async ({
  title = "Approve this request?",
  text,
  confirmButtonText = "Approve",
  ...options
}: ConfirmActionOptions = {}) =>
  confirmAction({
    title,
    text,
    confirmButtonText,
    cancelButtonText: "Cancel",
    icon: "question" as SweetAlertIcon,
    ...options,
  });

export const confirmExternalLink = async ({
  title = "Leave this site?",
  text = "You are being redirected to an external website.",
  confirmButtonText = "Continue",
  cancelButtonText = "Stay here",
  ...options
}: ConfirmActionOptions = {}) =>
  confirmAction({
    title,
    text,
    confirmButtonText,
    cancelButtonText,
    icon: "warning",
    ...options,
  });