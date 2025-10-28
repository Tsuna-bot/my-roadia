import { useState, useRef } from 'react';
import { Camera, Upload, X, User } from 'lucide-react';

interface AvatarUploadProps {
  currentAvatar?: string;
  userName: string;
  onUpload?: (file: File) => void;
  onRemove?: () => void;
  editable?: boolean;
}

export default function AvatarUpload({
  currentAvatar,
  userName,
  onUpload,
  onRemove,
  editable = true,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La taille du fichier ne doit pas dépasser 5 MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Call upload callback
    if (onUpload) {
      onUpload(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    }
  };

  const handleClick = () => {
    if (editable) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Avatar */}
        <div
          className={`
            w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden
            ${editable ? 'cursor-pointer' : ''}
            ${isHovering && editable ? 'ring-4 ring-accent/20' : 'ring-2 ring-neutral-90'}
            transition-all duration-150
          `}
          onClick={handleClick}
        >
          {preview ? (
            <img
              src={preview}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-accent/10 flex items-center justify-center">
              <span className="text-2xl md:text-3xl font-bold text-accent">
                {getInitials(userName)}
              </span>
            </div>
          )}
        </div>

        {/* Upload overlay */}
        {editable && isHovering && (
          <div
            className="absolute inset-0 bg-neutral-0/60 rounded-full flex items-center justify-center cursor-pointer animate-fade-in"
            onClick={handleClick}
          >
            <div className="text-center">
              <Camera size={24} className="text-white mx-auto mb-1" />
              <span className="text-xs text-white font-medium">
                {preview ? 'Changer' : 'Ajouter'}
              </span>
            </div>
          </div>
        )}

        {/* Remove button */}
        {editable && preview && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            className="
              absolute -top-1 -right-1
              w-8 h-8 rounded-full
              bg-error text-white
              flex items-center justify-center
              shadow-md
              hover:bg-error/80
              transition-colors duration-150
            "
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Upload button (mobile friendly) */}
      {editable && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={handleClick}
            className="
              flex items-center gap-2
              px-4 py-2
              text-sm font-medium text-accent
              bg-accent/5 hover:bg-accent/10
              rounded-lg
              transition-colors duration-150
            "
          >
            <Upload size={16} />
            {preview ? 'Modifier la photo' : 'Ajouter une photo'}
          </button>

          <p className="text-xs text-neutral-60 text-center max-w-xs">
            JPG, PNG ou GIF. Taille max : 5 MB
          </p>
        </>
      )}
    </div>
  );
}
