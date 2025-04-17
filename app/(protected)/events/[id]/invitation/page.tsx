'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Settings } from 'lucide-react';
import Button from '@/components/ui/buttons/Button';
import apiFetch from "@/lib/api";
import InvitationControls from '@/components/InvitationControls';
import TemplatePreviewCard from '@/components/ui/cards/TemplatePreviewCard';
import TemplateCustomizationPanel from '@/components/TemplateCustomizationPanel';
import { Template, EventData, InvitationTemplate } from '@/lib/types';
import { generateInvitationHtml } from '@/utils/generateInvitationHtml';
import { useParams } from 'next/navigation';
import { CircularProgress } from '@mui/material';
import { useCookies } from 'react-cookie';

export default function InvitationPage() {
  const [cookies] = useCookies(["token"]);
  const { id } = useParams();
  const [showQR, setShowQR] = useState(true);
  const [showRSVP, setShowRSVP] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'select' | 'customize'>('select');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<InvitationTemplate | null>(null);
  const [color, setColor] = useState('#ec4899');
  const [font, setFont] = useState('Arial');
  const [event, setEvent] = useState<EventData | null>(null);

  useEffect(() => {
    if (id) {
      fetchEvent(id as string);
      fetchTemplates();
    }
  }, [id, cookies.token]);

  const fetchEvent = async (eventId: string) => {
    try {
      const response = await apiFetch<EventData>(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      setEvent(response);
      setSelectedTemplate(response.invitationTemplate);
      setFont(response.invitationTemplate?.font || 'Arial');
      setColor(response.invitationTemplate?.color || '#ec4899');
      setShowQR(response.invitationTemplate?.show_qr ?? true);
      setShowRSVP(response.invitationTemplate?.show_rsvp ?? true);
    } catch (err) {
      console.error('Event fetch error:', err);
    }
  };

  const fetchTemplates = async () => {
    try {
      const data = await apiFetch<Template[]>("/base-templates", {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
      });
      
      setTemplates(data);
    } catch (err) {
      console.error("Template fetch error:", err);
    }
  };

  const handleSaveTemplate = async () => {
    if (!event?.invitationTemplate) return;

    try {
      await apiFetch(`/invitation-template/${event.invitationTemplate.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ font, color, show_qr: showQR, show_rsvp: showRSVP }),
      });
      alert("Загвар амжилттай хадгалагдлаа!");
    } catch (err) {
      alert("Хадгалахад алдаа гарлаа.");
      console.error(err);
    }
  };

  const invitationHtml =
    selectedTemplate && event
      ? generateInvitationHtml(selectedTemplate, event, showQR, showRSVP, font, color)
      : '';

  if (!event || !selectedTemplate) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <CircularProgress color="primary" size={40} thickness={5} />
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row gap-10">
      <div className="md:w-1/4 flex flex-col items-end">
        <InvitationControls
          showQR={showQR}
          setShowQR={setShowQR}
          showRSVP={showRSVP}
          setShowRSVP={setShowRSVP}
          onSave={handleSaveTemplate}
        />
      </div>

      <div className="flex-1 flex flex-col items-center gap-4">
        <div className="flex-1 flex flex-col items-end gap-8">
          <div className="w-full max-w-md bg-gray-100 p-4 shadow-md rounded" dangerouslySetInnerHTML={{ __html: invitationHtml }} />
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
                {event && templates.map((template) => (
                  <TemplatePreviewCard
                    key={template.id}
                    template={template}
                    event={event}
                    onSelect={() => {
                      setSelectedTemplate({
                        id: event.invitationTemplate.id,
                        baseTemplate: template,
                        font,
                        color,
                        show_qr: showQR,
                        show_rsvp: showRSVP,
                        created_at: '',
                        updated_at: ''
                      });
                      setStep('customize');
                    }}
                  />
                ))}
              </div>
            )}

            {step === 'customize' && selectedTemplate && (
              <TemplateCustomizationPanel
                font={font}
                setFont={setFont}
                color={color}
                setColor={setColor}
                invitationHtml={invitationHtml}
                onSave={async () => {
                  await handleSaveTemplate();
                  setIsOpen(false);
                }}
                onBack={() => setStep('select')}
              />
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </section>
  );
}
