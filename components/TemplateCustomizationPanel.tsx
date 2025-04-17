'use client';

import Button from "@/components/ui/buttons/Button";

interface Props {
  font: string;
  setFont: (v: string) => void;
  color: string;
  setColor: (v: string) => void;
  invitationHtml: string;
  onSave: () => void;
  onBack: () => void;
}

export default function TemplateCustomizationPanel({ font, setFont, color, setColor, invitationHtml, onSave, onBack }: Props) {
  return (
    <>
      <div className="flex gap-4">
        <div>
          <label className="block text-sm font-medium">Өнгө</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-8 border mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium">Фонт сонгох</label>
          <select value={font} onChange={(e) => setFont(e.target.value)} className="mt-1 border px-2 py-1 rounded">
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
            <option value="Tahoma">Tahoma</option>
            <option value="'Courier New'">Courier New</option>
          </select>
        </div>
      </div>

      <div className="mt-4 border rounded p-4">
        <div dangerouslySetInnerHTML={{ __html: invitationHtml }} />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="ghost" onClick={onBack}>← Буцах</Button>
        <Button onClick={onSave}>Хадгалах</Button>
      </div>
    </>
  );
}
