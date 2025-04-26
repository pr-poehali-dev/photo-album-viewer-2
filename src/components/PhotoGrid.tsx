
import { Photo } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface PhotoGridProps {
  photos: Photo[];
  onDeletePhoto: (id: string) => void;
  photoGap: number;
}

export const PhotoGrid = ({ photos, onDeletePhoto, photoGap }: PhotoGridProps) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-${photoGap}`}>
      <div className="col-span-full grid auto-rows-auto grid-cols-5 gap-2">
        {photos.map((photo) => {
          // Определяем размер для фото: 10x15 (портрет) и 15x10 (пейзаж)
          const colSpan = photo.orientation === "portrait" ? 1 : 2;
          
          return (
            <div 
              key={photo.id} 
              className={`group relative col-span-${colSpan} overflow-hidden border rounded-sm`}
              style={{ 
                aspectRatio: photo.orientation === "portrait" ? "2/3" : "3/2" 
              }}
            >
              <div className="relative h-full w-full">
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-white">
                  <p className="text-xs truncate" title={photo.title}>{photo.title}</p>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePhoto(photo.id);
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
