'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/Button';
import { Settings } from 'lucide-react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import fetch from "@/lib/api";

type EventData = {
  title: string;
  location: string;
  start_time: string;
  end_time: string;
  description: string;
  qr_image: string;
  rsvp_url: string;
};

type Template = {
  id: number;
  name: string;
  html: string;      
  font: string;      
  color: string;    
  show_qr: boolean;  
  show_rsvp: boolean; 
};

const generateInvitationHtml = (
  template: Template,
  event: EventData,
  showQR: boolean,
  showRSVP: boolean,
  font: string,
  color: string
): string => {
  return template.html
    .replace(/font-family:[^;]+;/, `font-family: ${font};`)
    .replaceAll('{{COLOR}}', color)
    .replaceAll('{{TITLE}}', event.title)
    .replaceAll('{{DESCRIPTION}}', event.description)
    .replaceAll('{{LOCATION}}', event.location)
    .replaceAll('{{START_TIME}}', event.start_time)
    .replaceAll('{{END_TIME}}', event.end_time)
    .replaceAll(
      '{{QR_SECTION}}',
      showQR
        ? `<div style="text-align:center; margin-top: 24px;"><img src="${event.qr_image}" width="120" /></div>`
        : ''
    )
    .replaceAll(
      '{{RSVP_SECTION}}',
      showRSVP
        ? `<div style="text-align:center; margin-top: 24px;"><a href="${event.rsvp_url}" style="background-color:${color}; color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: bold;">RSVP</a></div>`
        : ''
    );
};

export default function InvitationPage() {
  const [showQR, setShowQR] = useState(true);
  const [showRSVP, setShowRSVP] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'select' | 'customize'>('select');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [color, setColor] = useState('#ec4899');
  const [font, setFont] = useState('Arial');


  const event = {
    title: 'Төгсөлтийн ёслолын арга хэмжээ',
    location: 'МУИС-ийн Төв танхим',
    start_time: '2025-06-15 14:00',
    end_time: '2025-06-15 18:00',
    description: 'Бид та бүхнийг энэхүү онцгой үйл явдлын гэрч болон оролцохыг урьж байна.',
    qr_image: '/qr_dummy.png',
    rsvp_url: 'https://example.com/rsvp',
  };

  useEffect(() => {
    fetchTemplates(setTemplates, setSelectedTemplate, setColor, setFont);
  }, []);

  const fetchTemplates = async (
    setTemplates: React.Dispatch<React.SetStateAction<Template[]>>,
    setSelectedTemplate: React.Dispatch<React.SetStateAction<Template | null>>,
    setColor: React.Dispatch<React.SetStateAction<string>>,
    setFont: React.Dispatch<React.SetStateAction<string>>
  ) => {
    try {
      const data = await fetch<Template[]>("/templates");
      setTemplates(data);
      setSelectedTemplate(data[0]);
      setColor(data[0]?.color || "#ec4899");
      setFont(data[0]?.font || "Arial");
    } catch (err) {
      console.error("Template fetch error:", err);
    }
  };

  const handleSaveTemplate = async () => {
    if (!selectedTemplate) return;
  
    try {
      await fetch(`/templates/${selectedTemplate.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          font,
          color,
          show_qr: showQR,
          show_rsvp: showRSVP,
        }),
      });
      alert('Загвар амжилттай хадгалагдлаа!');
    } catch (err) {
      alert('Хадгалахад алдаа гарлаа.');
    }
  };

  const invitationHtml = selectedTemplate
    ? generateInvitationHtml(selectedTemplate, event, showQR, showRSVP, font, color)
    : '';

  return (
    <section className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row gap-10">
      <div className="md:w-1/4 flex flex-col items-end">
        <div className="space-y-5 mt-10">
          <div className="flex items-start gap-2">
            <input type="checkbox" id="qr" checked={showQR} onChange={() => setShowQR(!showQR)} className="w-4 h-4 mt-1" />
            <label htmlFor="qr" className="text-sm leading-tight">QR хавсаргах</label>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" id="rsvp" checked={showRSVP} onChange={() => setShowRSVP(!showRSVP)} className="w-4 h-4 mt-1" />
            <label htmlFor="rsvp" className="text-sm leading-tight">Нэмэлт мэдээллийн маягтын линк хавсаргах</label>
          </div>
          <Button className="mt-5" onClick={() => console.log('HTML to send:', invitationHtml)}>Хадгалах</Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center gap-4">
        <div className="flex-1 flex flex-col items-end gap-8">
          <div
            className="w-full max-w-md bg-gray-100 p-4 shadow-md rounded"
            dangerouslySetInnerHTML={{ __html: invitationHtml }}
          />
          <Button variant="ghost" className="flex" onClick={() => setIsOpen(true)}>
            <Settings className="w-5 h-5 mr-2" /> Урилгын загвар
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-3xl bg-white rounded-xl p-6 space-y-4 overflow-y-auto max-h-[90vh]">
            <DialogTitle className="text-xl font-semibold">
              {step === 'select' ? 'Загварууд' : 'Загварын тохиргоо'}
            </DialogTitle>

            {step === 'select' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="border border-gray-200 rounded-lg p-2 group hover:shadow-md relative overflow-hidden"
                  >
                    <div className="aspect-[5/6] overflow-hidden rounded-md bg-white relative">
                      <iframe
                        srcDoc={generateInvitationHtml(template, event, false, false, template.font || 'Arial', template.color)}
                        sandbox="allow-same-origin"
                        className="w-full h-full scale-75 pointer-events-none"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                      <Button 
                        className="text-white font-semibold cursor-pointer"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setColor(template.color); // update color on select
                          setStep('customize');
                        }}
                      >
                        Сонгох
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 'customize' && selectedTemplate && (
              <>
                <div className="flex gap-4">
                  <div>
                    <label className="block text-sm font-medium">Өнгө</label>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-12 h-8 border mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Фонт сонгох</label>
                    <select
                      value={font}
                      onChange={(e) => setFont(e.target.value)}
                      className="mt-1 border px-2 py-1 rounded"
                    >
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
                  <Button variant="ghost" onClick={() => setStep('select')}>← Буцах</Button>
                  <Button 
                    className="mt-5" 
                    onClick={async () => {
                      await handleSaveTemplate();
                      setIsOpen(false);
                    }}
                  >
                    Хадгалах
                  </Button>
                </div>
              </>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </section>
  );
}
