
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ExpandableCardProps {
  title: string;
  content: string;
  initiallyOpen?: boolean;
}

export const ExpandableCard: React.FC<ExpandableCardProps> = ({ title, content, initiallyOpen = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${title}\n\n${content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm shadow-lg mb-4 overflow-hidden">
      <Accordion type="single" collapsible defaultValue={initiallyOpen ? "item-1" : undefined}>
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-foreground hover:no-underline hover:bg-accent/50 transition-colors">
            {title}
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed mb-4">{content}</p>
            <div className="flex justify-end">
              <Button
                onClick={handleCopy}
                variant="ghost"
                size="sm"
                className="text-sm hover:bg-accent transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};
