
import { Photo } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface PhotoGridProps {
  photos: Photo[];
  onDeletePhoto: (id: string) => void;
  photoGap: number;
}

export const PhotoGrid = ({ photos, onDeletePhoto, photoGap }: PhotoGridProps) => {
  const getGapClass = (gap: number) => {
    const gapMap: Record<number, string> = {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5"
    };
    return gapMap[gap] || "gap-2";
  };

  return (
    <div className="w-full">
      <div 
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 ${getGapClass(photoGap)}`}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gridAutoFlow: "dense"
        }}
      >
        {photos.map((photo) => {
          // Задаем размер для разных ориентаций фото
          const gridColumn = photo.orientation === "landscape" ? "span 2" : "span 1";
          
          return (
            <div 
              key={photo.id} 
              className="relative group overflow-hidden border rounded-sm"
              style={{ 
                gridColumn,
                aspectRatio: photo.orientation === "portrait" ? "2/3" : "3/2",
                minHeight: "150px"
              }}
            >
              <div className="relative h-full w-full">
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white/80 p-1">
                  <p className="text-xs truncate text-black" title={photo.title}>{photo.title}</p>
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
