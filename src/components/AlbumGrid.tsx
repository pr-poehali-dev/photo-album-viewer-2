
import { useState } from "react";
import { Link } from "react-router-dom";
import { Camera, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Album } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface AlbumGridProps {
  albums: Album[];
  onDeleteAlbum: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onCreateAlbum: () => void;
}

export const AlbumGrid = ({ albums, onDeleteAlbum, onUpdateTitle, onCreateAlbum }: AlbumGridProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEditing = (album: Album) => {
    setEditingId(album.id);
    setEditValue(album.title);
  };

  const saveTitle = (id: string) => {
    if (editValue.trim()) {
      onUpdateTitle(id, editValue);
    }
    setEditingId(null);
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
      {albums.map((album) => (
        <div 
          key={album.id} 
          className="bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
        >
          <Link to={`/album/${album.id}`} className="block">
            <div className="aspect-square overflow-hidden relative bg-gray-100">
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
            </div>
          </Link>
          
          <div className="p-2 flex justify-between items-center">
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
              <>
                <h3 className="font-medium text-xs truncate flex-1" title={album.title}>
                  {album.title}
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreHorizontal size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => startEditing(album)}>
                      <Pencil size={14} className="mr-2" />
                      Переименовать
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => onDeleteAlbum(album.id)}
                    >
                      <Trash2 size={14} className="mr-2" />
                      Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
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
};
