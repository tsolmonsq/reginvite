'use client';

import Button from "@/components/ui/buttons/Button";
import { Template, EventData } from "@/lib/types";
import { generateInvitationHtml } from "@/utils/generateInvitationHtml";

interface TemplatePreviewCardProps {
  template: Template;
  event: EventData;
  onSelect: () => void;
  font: string, 
  color: string
}

export default function TemplatePreviewCard({ template, event, onSelect, font, color }: TemplatePreviewCardProps) {
  const previewHtml = generateInvitationHtml(template, event, false, false, font, color);

  return (
    <div className="border border-gray-200 rounded-lg p-2 group hover:shadow-md relative overflow-hidden">
      <div className="aspect-[5/6] overflow-hidden rounded-md bg-white relative">
        <iframe
          srcDoc={previewHtml}
          sandbox="allow-same-origin"
          className="w-full h-full scale-75 pointer-events-none"
        />
      </div>
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
        <Button className="text-white font-semibold" onClick={onSelect}>Сонгох</Button>
      </div>
    </div>
  );
}
