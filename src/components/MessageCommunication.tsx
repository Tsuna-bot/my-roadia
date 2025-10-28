import { useState } from 'react';
import { Send, Megaphone } from 'lucide-react';
import Card from './Card';
import Button from './Button';

export default function MessageCommunication() {
  const [message, setMessage] = useState('Le jour férié du 25 décembre ne sera pas travaillé par nos équipes. Nous vous souhaitons de joyeuses fêtes de fin d\'année');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Simuler l'envoi du message
      setShowSuccess(true);
      setMessage('');

      // Cacher le message de succès après 3 secondes
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <h2 className="text-lg font-semibold text-neutral-10">
        Communication
      </h2>

      {/* Success Alert */}
      {showSuccess && (
        <div className="p-4 rounded-md bg-success/10 shadow-[0_0_0_2px_rgba(16,185,129,0.2)_inset]">
          <p className="text-sm text-success font-medium">
            Message envoyé avec succès à tous les utilisateurs
          </p>
        </div>
      )}

      {/* Message Form */}
      <Card>
        <div className="p-4 md:p-8">
          <div className="flex flex-col gap-4 md:gap-6">
            <textarea
              rows={4}
              placeholder="Rédigez votre message ici..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="
                w-full p-4 rounded-xl
                bg-neutral-95 shadow-[0_1px_3px_rgba(0,0,0,0.08)]
                border-0 outline-none
                text-sm text-neutral-10 font-montserrat
                placeholder:text-neutral-60
                hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)]
                focus:outline-none focus:border-0 focus:shadow-[0_2px_8px_rgba(0,47,107,0.15)]
                transition-all duration-[250ms]
              "
            />

            {/* Info */}
            <p className="text-xs text-neutral-60 leading-tight">
              Le message sera envoyé à tous les assurés, réparateurs et experts connectés à la plateforme.
            </p>

            <div className="flex flex-col md:flex-row justify-end gap-2 md:gap-4">
              <Button
                variant="secondary"
                size="medium"
                onClick={() => setMessage('')}
                disabled={!message.trim()}
                className="w-full md:w-auto px-8 min-h-[48px]"
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                size="medium"
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="w-full md:w-auto px-8 min-h-[48px] gap-2"
              >
                <Send size={18} />
                Envoyer le message
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
