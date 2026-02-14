// utils/GlobalFloatingButtons.tsx
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useFloatingButtons } from './FloatingButtonsContext';

const GlobalFloatingButtons: React.FC = () => {
  const {
    showButtons,
    onSaveDraft,
    onFinalSubmit,
    isLoading,
    isDisabled
  } = useFloatingButtons();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!showButtons || !isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 animate-in slide-in-from-bottom-5 duration-300">
      <Button
        onClick={onSaveDraft}
        variant="outline"
        disabled={isLoading || isDisabled}
        className="shadow-xl bg-white hover:bg-gray-50 border-2 px-6 py-5 text-sm font-medium"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Save as Draft
      </Button>
      <Button
        onClick={onFinalSubmit}
        disabled={isLoading || isDisabled}
        className="shadow-xl bg-primary hover:bg-primary/90 px-6 py-5 text-sm font-medium"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Submit
      </Button>
    </div>
  );
};

export default GlobalFloatingButtons;