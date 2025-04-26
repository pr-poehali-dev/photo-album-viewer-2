
import { Photo } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface PhotoGridProps {
  photos: Photo[];
  onDeletePhoto: (id: string) => void;
}

export const PhotoGrid = ({ photos, onDeletePhoto }: PhotoGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
      {photos.map((photo) => (
        <div key={photo.id} className="group relative">
          <div className="aspect-square overflow-hidden">
            <img 
              src={photo.url} 
              alt={photo.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-background/80 backdrop-blur-sm p-2 transition-opacity">
            <p className="text-sm truncate" title={photo.title}>{photo.title}</p>
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
            onClick={() => onDeletePhoto(photo.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ))}
    </div>
  );
};
