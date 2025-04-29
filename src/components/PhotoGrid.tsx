
import { memo } from "react";
import { Photo } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface PhotoGridProps {
  photos: Photo[];
  onDeletePhoto: (id: string) => void;
  photoGap: number;
  photoSize: number;
}

// Используем memo для предотвращения ненужных ререндеров
export const PhotoGrid = memo(({ photos, onDeletePhoto, photoGap, photoSize }: PhotoGridProps) => {
  // Функция для определения класса отступов между фото
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

  // Функция для определения количества колонок в зависимости от размера фото
  const getGridClass = (size: number) => {
    // Для маленьких фото больше колонок, для больших меньше
    const sizeMap: Record<number, string> = {
      1: "grid-cols-6 md:grid-cols-8", // Очень маленькие фото
      2: "grid-cols-5 md:grid-cols-7", // Маленькие фото
      3: "grid-cols-4 md:grid-cols-6", // Средние фото (по умолчанию)
      4: "grid-cols-3 md:grid-cols-5", // Большие фото
      5: "grid-cols-2 md:grid-cols-4"  // Очень большие фото
    };
    return sizeMap[size] || "grid-cols-4 md:grid-cols-6";
  };

  return (
    <div className="w-full">
      <div 
        className={`grid ${getGridClass(photoSize)} ${getGapClass(photoGap)}`}
        style={{
          display: "grid",
          gridAutoFlow: "dense"
        }}
      >
        {photos.map((photo) => {
          // Горизонтальные фото занимают 2 колонки
          const spanColumns = photo.orientation === "landscape" ? 2 : 1;
          
          return (
            <div 
              key={photo.id} 
              className="relative group overflow-hidden border rounded-sm"
              style={{ 
                gridColumn: `span ${spanColumns}`,
                aspectRatio: photo.orientation === "portrait" ? "2/3" : "3/2",
                minHeight: "120px"
              }}
            >
              <div className="relative h-full w-full">
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="w-full h-full object-cover"
                  loading="lazy" // Добавляем ленивую загрузку
                />
                {/* Белая полоса с подписью */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/80 p-1">
                  <p className="text-xs truncate text-black" title={photo.title}>{photo.title}</p>
                </div>
                {/* Кнопка удаления */}
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
});

PhotoGrid.displayName = "PhotoGrid";
