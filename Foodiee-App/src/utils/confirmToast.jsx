import toast from "react-hot-toast";

const VARIANT_STYLES = {
  danger: {
    accent: "text-rose-600",
    confirm: "bg-rose-600 hover:bg-rose-700",
  },
  warning: {
    accent: "text-amber-600",
    confirm: "bg-amber-600 hover:bg-amber-700",
  },
  info: {
    accent: "text-blue-600",
    confirm: "bg-blue-600 hover:bg-blue-700",
  },
};

export const showConfirmToast = ({
  title = "Are you sure?",
  description = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  duration = 8000,
}) =>
  new Promise((resolve) => {
    const tone = VARIANT_STYLES[variant] || VARIANT_STYLES.danger;
    let resolved = false;

    const settle = (value, toastId) => {
      if (resolved) return;
      resolved = true;
      toast.dismiss(toastId);
      resolve(value);
    };

    const toastId = toast.custom(
      (t) => (
        <div className="w-[92vw] max-w-sm rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
          <p className={`text-sm font-black tracking-tight ${tone.accent}`}>{title}</p>
          {description ? <p className="mt-1 text-xs text-slate-600">{description}</p> : null}

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => settle(false, t.id)}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={() => settle(true, t.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold text-white transition-colors ${tone.confirm}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      ),
      {
        duration,
      }
    );

    setTimeout(() => settle(false, toastId), duration + 50);
  });
