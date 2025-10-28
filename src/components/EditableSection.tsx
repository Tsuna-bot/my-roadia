import { useState } from 'react';
import { Edit, Check, X } from 'lucide-react';
import Card from './Card';

interface EditableSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  editContent: React.ReactNode;
  onSave?: () => void;
  onCancel?: () => void;
  iconBgColor?: string;
}

export default function EditableSection({
  icon,
  title,
  children,
  editContent,
  onSave,
  onCancel,
  iconBgColor = 'bg-accent/10',
}: EditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setIsEditing(false);
  };

  return (
    <Card>
      <div className="p-4 md:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-90">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${iconBgColor} flex items-center justify-center flex-shrink-0 [&>svg]:w-4 [&>svg]:h-4 md:[&>svg]:w-5 md:[&>svg]:h-5`}>
              {icon}
            </div>
            <h2 className="text-sm md:text-lg font-semibold text-neutral-10">
              {title}
            </h2>
          </div>

          {/* Edit button - only shown when not editing */}
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-lg bg-accent/5 hover:bg-accent/10 text-accent transition-all duration-150 font-medium text-sm"
            >
              <Edit size={20} className="md:w-4 md:h-4" />
              <span className="hidden md:inline">Modifier</span>
            </button>
          )}

          {/* Save/Cancel buttons - shown in header on desktop only */}
          {isEditing && (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-neutral-90 hover:bg-neutral-85 text-neutral-40 transition-all duration-150 text-sm font-medium"
              >
                <span>Annuler</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-accent hover:bg-accent-light text-white transition-all duration-150 font-medium text-sm"
              >
                <span>Enregistrer</span>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          {isEditing ? editContent : children}
        </div>

        {/* Save/Cancel buttons - shown at bottom on mobile only */}
        {isEditing && (
          <div className="flex md:hidden flex-col items-stretch gap-2 pt-6 mt-6 border-t border-neutral-90">
            <button
              onClick={handleCancel}
              className="w-full flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-neutral-90 hover:bg-neutral-85 text-neutral-40 transition-all duration-150 text-sm font-medium"
            >
              <span>Annuler</span>
            </button>
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-accent hover:bg-accent-light text-white transition-all duration-150 font-medium text-sm"
            >
              <span>Enregistrer</span>
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
