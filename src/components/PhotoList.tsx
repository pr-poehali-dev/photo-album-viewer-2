
import { Photo } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface PhotoListProps {
  photos: Photo[];
  onDeletePhoto: (id: string) => void;
}

export const PhotoList = ({ photos, onDeletePhoto }: PhotoListProps) => {
  return (
    <div className="space-y-3">
      {photos.map((photo) => (
        <div key={photo.id} className="group flex items-center gap-4 p-2 border rounded-md hover:bg-accent/10">
          <div 
            className="h-20 flex-shrink-0 overflow-hidden rounded-md"
            style={{ 
              width: photo.orientation === "portrait" ? "calc(20px * 2/3)" : "calc(20px * 3/2)",
              aspectRatio: photo.orientation === "portrait" ? "2/3" : "3/2"
            }}
          >
            <img 
              src={photo.url} 
              alt={photo.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-sm">{photo.title}</h3>
            <p className="text-xs text-muted-foreground">
              {photo.orientation === "portrait" ? "Портретная" : "Альбомная"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDeletePhoto(photo.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ))}
    </div>
  );
};
