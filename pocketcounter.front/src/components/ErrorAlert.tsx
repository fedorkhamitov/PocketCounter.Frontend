// components/ErrorAlert.tsx
interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
  buttonText?: string;
}

export const ErrorAlert = ({
  message,
  onRetry,
  buttonText,
}: ErrorAlertProps) => (
  <div className="container mt-5">
    <div className="alert alert-danger" role="alert">
      {message}
      {onRetry && (
        <div className="mt-2">
          <button className="btn btn-primary" onClick={onRetry}>
            {buttonText || "Попробовать снова"}
          </button>
        </div>
      )}
    </div>
  </div>
);
