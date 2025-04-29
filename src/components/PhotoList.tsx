
import { memo } from "react";
import { Photo } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface PhotoListProps {
  photos: Photo[];
  onDeletePhoto: (id: string) => void;
}

// Используем memo для предотвращения ненужных ререндеров
export const PhotoList = memo(({ photos, onDeletePhoto }: PhotoListProps) => {
  return (
    <div className="space-y-3">
      {photos.map((photo) => (
        <div key={photo.id} className="flex items-center border rounded-md overflow-hidden bg-card">
          <div className="h-16 w-16 flex-shrink-0">
            <img 
              src={photo.url} 
              alt={photo.title} 
              className="h-full w-full object-cover"
              loading="lazy" // Добавляем ленивую загрузку
            />
          </div>
          <div className="flex-1 p-3 min-w-0">
            <h3 className="truncate text-sm font-medium">{photo.title}</h3>
            <p className="text-xs text-muted-foreground">
              {photo.orientation === "landscape" ? "Горизонтальное" : "Вертикальное"}
            </p>
          </div>
          <div className="p-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive h-8 w-8"
              onClick={() => onDeletePhoto(photo.id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      ))}
      
      {photos.length === 0 && (
        <div className="text-center py-8 bg-accent/10 rounded-md">
          <p className="text-muted-foreground">Нет фотографий для отображения</p>
        </div>
      )}
    </div>
  );
});

PhotoList.displayName = "PhotoList";
