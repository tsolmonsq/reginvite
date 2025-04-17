'use client';

interface Props {
  showQR: boolean;
  setShowQR: (v: boolean) => void;
  showRSVP: boolean;
  setShowRSVP: (v: boolean) => void;
}

export default function InvitationControls({ showQR, setShowQR, showRSVP, setShowRSVP }: Props) {
  return (
    <div className="space-y-5 mt-10">
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="qr"
          checked={showQR}
          onChange={() => setShowQR(!showQR)}
          className="w-4 h-4 mt-1"
        />
        <label htmlFor="qr" className="text-sm leading-tight">QR хавсаргах</label>
      </div>
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="rsvp"
          checked={showRSVP}
          onChange={() => setShowRSVP(!showRSVP)}
          className="w-4 h-4 mt-1"
        />
        <label htmlFor="rsvp" className="text-sm leading-tight">RSVP линк хавсаргах</label>
      </div>
    </div>
  );
}
