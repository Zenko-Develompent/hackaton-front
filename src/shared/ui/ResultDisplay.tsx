// shared/ui/ResultDisplay.tsx
import { Button } from "@/components/ui/button";

interface ResultDisplayProps {
  title: string;
  message: string;
  details?: {
    label: string;
    value: string | number;
    highlight?: boolean;
  }[];
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'outline';
  }[];
}

export const ResultDisplay = ({
  title,
  message,
  details = [],
  actions = [],
}: ResultDisplayProps) => {
  return (
    <div className=" p-20  text-center">
      <div className="mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600">{message}</p>
      </div>
      
      {details.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
          {details.map((detail, index) => (
            <div key={index}>
              <p className="text-sm text-gray-500">{detail.label}</p>
              <p className={`text-2xl font-bold ${detail.highlight ? 'text-green-600' : ''}`}>
                {detail.value}
              </p>
            </div>
          ))}
        </div>
      )}
      
      {actions.length > 0 && (
        <div className="flex gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant === 'outline' ? 'outline' : 'default'}
              onClick={action.onClick}
              className="flex-1 text-base"
              size="lg"
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};