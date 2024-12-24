import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import Image from "next/image"

interface ImageUploaderProps {
  isEditMode: boolean;
  imagePath?: string | null;
  onFileChange: (file: File) => void;
  altText: string;
}

export function ImageUploader({ isEditMode, imagePath, onFileChange, altText }: ImageUploaderProps) {
  return (
    <div>
      {isEditMode ? (
        <div>
          <Label htmlFor={`${altText.toLowerCase()}Image`}>{altText} Image</Label>
          <Input
            id={`${altText.toLowerCase()}Image`}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onFileChange(file);
              }
            }}
          />
        </div>
      ) : imagePath && (
        <Image
          src={imagePath}
          alt={altText}
          width={800}
          height={400}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        />
      )}
    </div>
  )
}


