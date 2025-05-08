'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Settings } from 'lucide-react';
import Button from '@/components/ui/buttons/Button';
import apiFetch from "@/lib/api";
import InvitationControls from '@/components/InvitationControls';
import TemplatePreviewCard from '@/components/ui/cards/TemplatePreviewCard';
import TemplateCustomizationPanel from '@/components/TemplateCustomizationPanel';
import { Template, EventData, Invitation } from '@/lib/types';
import { generateInvitationHtml } from '@/utils/generateInvitationHtml';
import { useParams } from 'next/navigation';
import { CircularProgress } from '@mui/material';
import { useCookies } from 'react-cookie';

export default function InvitationPage() {
  const [cookies] = useCookies(["token"]);
  const { id } = useParams();
  const [hasQR, setHasQR] = useState(true);
  const [hasRSVP, setHasRSVP] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'select' | 'customize'>('select');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation>();
  const [color, setColor] = useState('#ec4899');
  const [font, setFont] = useState('Arial');
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEvent(id as string); 
      fetchInvitation(id as string); 
      fetchTemplates(); 
    }
  }, [id, cookies.token]);

  const fetchInvitation = async (eventId: string) => {
    try {
      setLoading(true);
      const response = await apiFetch<Invitation>(`/invitations/${eventId}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      console.log("Invitation Response:", response);

      setFont(response.font || 'Arial');
      setColor(response.color || '#ec4899');
      setHasQR(response.has_qr ?? true);
      setHasRSVP(response.has_rsvp ?? true);
      setSelectedInvitation(response);

    } catch (err) {
      console.error('Event fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<Template[]>("/templates", {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });
      setTemplates(data);
    } catch (err) {
      console.error("Template fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvent = async (eventId: string) => {
    try {
      setLoading(true);
      const response = await apiFetch<EventData>(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      setEvent(response);
    } catch (err) {
      console.error('Event fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const invitationHtml =
    selectedInvitation && event
      ? generateInvitationHtml(selectedInvitation.template, event, hasQR, hasRSVP, font, color)
      : '';

  useEffect(() => {
    if (selectedInvitation) {
      console.log("Selected Invitation Updated:", selectedInvitation);
    }
  }, [selectedInvitation]);

  return (
    <section className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row gap-10">
      <div className="md:w-1/4 flex flex-col items-end">
        <InvitationControls
          showQR={hasQR}
          setShowQR={async (val) => {
            setHasQR(val);
            if (id) {
              try {
                await apiFetch(`/invitations/${id}/qr`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cookies.token}`,
                  },
                  body: JSON.stringify({ has_qr: val }),
                });
              } catch (err) {
                console.error('QR setting update failed:', err);
              }
            }
          }}
          showRSVP={hasRSVP}
          setShowRSVP={async (val) => {
            setHasRSVP(val);
            if (id) {
              try {
                await apiFetch(`/invitations/${id}/rsvp`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cookies.token}`,
                  },
                  body: JSON.stringify({ has_rsvp: val }),
                });
              } catch (err) {
                console.error('RSVP setting update failed:', err);
              }
            }
          }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center gap-4">
        <div className="flex-1 flex flex-col items-end gap-8">
          {loading ? (
            <CircularProgress />
          ) : (
            <div className="w-full max-w-md bg-gray-100 p-4 shadow-md rounded" dangerouslySetInnerHTML={{ __html: invitationHtml }} />
          )}
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
                    font={selectedInvitation?.font ?? ''} 
                    color={selectedInvitation?.color ?? ''}
                    onSelect={() => {
                      setSelectedInvitation({
                        ...selectedInvitation!,
                        template,
                        event: {
                          ...event,
                          image_path: event.image_path,
                        },
                      });
                      setStep('customize');
                    }}
                  />
                ))}
              </div>
            )}

            {step === 'customize' && selectedInvitation && (
              <TemplateCustomizationPanel
                font={font}
                setFont={setFont}
                color={color}
                setColor={setColor}
                invitationHtml={generateInvitationHtml(
                  selectedInvitation.template,
                  selectedInvitation.event,
                  hasQR,
                  hasRSVP,
                  font,
                  color
                )}
                onSave={async () => {
                  try {
                    if (!selectedInvitation || !selectedInvitation.template || !id) return;
                
                    const headers = {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${cookies.token}`,
                    };
                
                    // 1. Template, font, color хадгалах
                    await apiFetch(`/invitations/${id}/template`, {
                      method: "PATCH",
                      headers,
                      body: JSON.stringify({
                        template_id: selectedInvitation.template.id,
                        color: color,
                        text_font: font,
                      }),
                    });
                
                    // 2. QR тохиргоо
                    await apiFetch(`/invitations/${id}/qr`, {
                      method: "PATCH",
                      headers,
                      body: JSON.stringify({ has_qr: hasQR }),
                    });
                
                    // 3. RSVP тохиргоо
                    await apiFetch(`/invitations/${id}/rsvp`, {
                      method: "PATCH",
                      headers,
                      body: JSON.stringify({ has_rsvp: hasRSVP }),
                    });
                
                    setIsOpen(false);
                  } catch (err) {
                    console.error("Invitation update failed:", err);
                  }
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
