
import { Photo } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface PhotoListProps {
  photos: Photo[];
  onDeletePhoto: (id: string) => void;
}

export const PhotoList = ({ photos, onDeletePhoto }: PhotoListProps) => {
  return (
    <div className="space-y-4">
      {photos.map((photo) => (
        <div key={photo.id} className="flex items-center gap-4 p-2 border rounded-md hover:bg-accent/10">
          <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
            <img 
              src={photo.url} 
              alt={photo.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{photo.title}</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => onDeletePhoto(photo.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ))}
    </div>
  );
};
