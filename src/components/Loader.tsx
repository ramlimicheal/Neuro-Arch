
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full space-y-4">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary/30 animate-pulse"></div>
      </div>
      <p className="text-muted-foreground text-sm animate-pulse">Processing your thought...</p>
    </div>
  );
};

export default Loader;
