'use client';

import { useState } from 'react';
import Button from '@/components/Button';
import { ArrowLeft, Link, Settings } from 'lucide-react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

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
  defaultColor: string;
  render: (event: EventData, showQR: boolean, showRSVP: boolean) => string;
};

// --- Templates with {{COLOR}} placeholders ---
const templates: Template[] = [
  {
    id: 1,
    name: 'Default Elegant',
    defaultColor: '#ec4899',
    render: (event, showQR, showRSVP) => `
      <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background-color: #fff;">
        <div style="background-color: {{COLOR}}; color: white; padding: 32px 24px; text-align: center;">
          <h2 style="margin: 0; font-size: 24px;">Урилга</h2>
          <p style="margin: 8px 0 0 0; font-size: 16px;">${event.title}</p>
        </div>
        <div style="padding: 24px; color: #1f2937;">
          <p><strong>Хаана:</strong> ${event.location}</p>
          <p><strong>Эхлэх цаг:</strong> ${event.start_time}</p>
          <p><strong>Дуусах цаг:</strong> ${event.end_time}</p>
          <p style="margin-top: 16px;">${event.description}</p>
          ${showQR ? `<div style="text-align: center; margin-top: 24px;"><img src="${event.qr_image}" alt="QR code" width="120" height="120" style="display: inline-block;" /><p style="font-size: 13px; color: #6b7280; margin-top: 8px;">Та үйл ажиллагаанд очихдоо энэхүү QR кодыг уншуулж бүртгүүлээрэй.</p></div>` : ''}
          ${showRSVP ? `<div style="text-align: center; margin-top: 32px;"><a href="${event.rsvp_url}" style="background-color: {{COLOR}}; color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: bold; display: inline-block;">RSVP</a></div>` : ''}
        </div>
      </div>`
  },
  {
    id: 2,
    name: 'Modern Banner',
    defaultColor: '#2563eb',
    render: (event, showQR, showRSVP) => `
      <div style="max-width: 600px; margin: auto; border-radius: 10px; font-family: 'Segoe UI'; overflow: hidden; box-shadow: 0 8px 16px rgba(0,0,0,0.1);">
        <div style="background: {{COLOR}}; padding: 24px; color: white; text-align: left;">
          <h2 style="font-size: 22px; font-weight: bold; margin: 0;">${event.title}</h2>
          <p style="margin-top: 8px; font-size: 14px;">${event.description}</p>
        </div>
        <div style="background: #fff; padding: 24px; color: #111827;">
          <p><strong>Хаана:</strong> ${event.location}</p>
          <p><strong>Эхлэх:</strong> ${event.start_time}</p>
          <p><strong>Дуусах:</strong> ${event.end_time}</p>
          ${showQR ? `<div style="text-align: center; margin-top: 20px;"><img src="${event.qr_image}" width="100"/></div>` : ''}
          ${showRSVP ? `<div style="text-align: center; margin-top: 20px;"><a href="${event.rsvp_url}" style="padding: 10px 20px; background-color: {{COLOR}}; color: white; border-radius: 6px; text-decoration: none;">RSVP</a></div>` : ''}
        </div>
      </div>`
  },
  {
    id: 3,
    name: 'Center Card',
    defaultColor: '#10b981',
    render: (event, showQR, showRSVP) => `
      <div style="max-width: 500px; margin: auto; border: 1px solid #ddd; font-family: 'Georgia'; border-radius: 12px; background: #f9fafb; padding: 20px; text-align: center;">
        <h2 style="font-size: 20px; margin-bottom: 12px; color: {{COLOR}};">${event.title}</h2>
        <p>${event.description}</p>
        <hr style="margin: 16px 0;" />
        <p><strong>Хаана:</strong> ${event.location}</p>
        <p><strong>Цаг:</strong> ${event.start_time} - ${event.end_time}</p>
        ${showQR ? `<div style="margin-top: 20px;"><img src="${event.qr_image}" width="100"/></div>` : ''}
        ${showRSVP ? `<div style="margin-top: 20px;"><a href="${event.rsvp_url}" style="background: {{COLOR}}; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">RSVP</a></div>` : ''}
      </div>`
  },
  {
    id: 4,
    name: 'Left Image Split',
    defaultColor: '#d946ef',
    render: (event, showQR, showRSVP) => `
      <div style="display: flex; max-width: 700px; margin: auto; border-radius: 12px; overflow: hidden; font-family: 'Verdana'; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">
        <div style="flex: 1; background-color: {{COLOR}}; color: white; padding: 20px;">
          <h2>${event.title}</h2>
          <p>${event.description}</p>
        </div>
        <div style="flex: 1; background: white; padding: 20px; color: #111827;">
          <p><strong>Байршил:</strong> ${event.location}</p>
          <p><strong>Эхлэх:</strong> ${event.start_time}</p>
          <p><strong>Дуусах:</strong> ${event.end_time}</p>
          ${showRSVP ? `<div style="margin-top: 20px;"><a href="${event.rsvp_url}" style="background: {{COLOR}}; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none;">RSVP</a></div>` : ''}
        </div>
      </div>`
  }
];

// --- HTML Generator ---
const generateInvitationHtml = (
  template: Template,
  event: EventData,
  showQR: boolean,
  showRSVP: boolean,
  font: string,
  color: string
): string => {
  return template
    .render(event, showQR, showRSVP)
    .replace(/font-family:[^;]+;/, `font-family: ${font};`)
    .replaceAll('{{COLOR}}', color);
};

export default function InvitationPage() {
  const [showQR, setShowQR] = useState(true);
  const [showRSVP, setShowRSVP] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'select' | 'customize'>('select');
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(templates[0]);
  const [font, setFont] = useState('Arial');
  const [color, setColor] = useState(templates[0].defaultColor); // use default color from template

  const event = {
    title: 'Төгсөлтийн ёслолын арга хэмжээ',
    location: 'МУИС-ийн Төв танхим',
    start_time: '2025-06-15 14:00',
    end_time: '2025-06-15 18:00',
    description: 'Бид та бүхнийг энэхүү онцгой үйл явдлын гэрч болон оролцохыг урьж байна.',
    qr_image: '/qr_dummy.png',
    rsvp_url: 'https://example.com/rsvp',
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
                        srcDoc={template.render(event, false, false).replaceAll('{{COLOR}}', template.defaultColor)}
                        sandbox="allow-same-origin"
                        className="w-full h-full scale-75 pointer-events-none"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                      <Button 
                        className="text-white font-semibold cursor-pointer"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setColor(template.defaultColor); // update color on select
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
                  <Button onClick={() => setIsOpen(false)}>OK</Button>
                </div>
              </>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </section>
  );
}
