
import { useState, memo } from "react";
import { Link } from "react-router-dom";
import { Camera, Edit, Trash2 } from "lucide-react";
import { Album } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AlbumGridProps {
  albums: Album[];
  onDeleteAlbum: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onCreateAlbum: () => void;
  albumSize: number;
}

// Используем memo для предотвращения ненужных ререндеров
export const AlbumGrid = memo(({ 
  albums, 
  onDeleteAlbum, 
  onUpdateTitle, 
  onCreateAlbum,
  albumSize
}: AlbumGridProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEditing = (album: Album, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(album.id);
    setEditValue(album.title);
  };

  const saveTitle = (id: string) => {
    if (editValue.trim()) {
      onUpdateTitle(id, editValue);
    }
    setEditingId(null);
  };

  const handleDeleteAlbum = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteAlbum(id);
  };

  // Функция для определения размера альбомов
  const getAlbumSizeClass = (size: number) => {
    switch(size) {
      case 1: return "grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10";
      case 2: return "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8";
      case 3: return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7";
      case 4: return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";
      case 5: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
      default: return "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7";
    }
  };

  return (
    <div className={`grid ${getAlbumSizeClass(albumSize)} gap-3`}>
      {albums.map((album) => (
        <div 
          key={album.id} 
          className="bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
        >
          <Link to={`/album/${album.id}`} className="block">
            <div className="aspect-square overflow-hidden relative bg-gray-100 group">
              {album.photos.length > 0 ? (
                <img 
                  src={album.coverUrl} 
                  alt={album.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400">
                  <Camera size={32} />
                </div>
              )}
              <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-sm">
                {album.photos.length}
              </div>
              
              {/* Кнопки действий поверх картинки */}
              <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 flex gap-1 bg-black/40 rounded-bl-lg transition-opacity">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 bg-white/80 hover:bg-white text-black"
                  onClick={(e) => startEditing(album, e)}
                >
                  <Edit size={14} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 bg-white/80 hover:bg-white text-red-500"
                  onClick={(e) => handleDeleteAlbum(album.id, e)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </Link>
          
          <div className="p-2">
            {editingId === album.id ? (
              <div className="flex w-full gap-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveTitle(album.id)}
                  autoFocus
                  className="h-7 text-xs"
                />
                <Button size="sm" onClick={() => saveTitle(album.id)} className="h-7 text-xs px-2">
                  OK
                </Button>
              </div>
            ) : (
              <h3 className="font-medium text-xs truncate" title={album.title}>
                {album.title}
              </h3>
            )}
          </div>
        </div>
      ))}
      
      {/* Добавление нового альбома */}
      <button 
        onClick={onCreateAlbum}
        className="aspect-square bg-gray-100 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-xl">+</span>
        </div>
        <span className="text-xs text-gray-500">Новый альбом</span>
      </button>
    </div>
  );
});

AlbumGrid.displayName = "AlbumGrid";
