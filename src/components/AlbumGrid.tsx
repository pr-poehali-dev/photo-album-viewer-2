
import { useState } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
}

export const AlbumGrid = ({ albums, onDeleteAlbum, onUpdateTitle }: AlbumGridProps) => {
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {albums.map((album) => (
        <div 
          key={album.id} 
          className="bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
        >
          <Link to={`/album/${album.id}`} className="block">
            <div className="aspect-square overflow-hidden">
              <img 
                src={album.coverUrl} 
                alt={album.title} 
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
          </Link>
          
          <div className="p-3 flex justify-between items-center">
            {editingId === album.id ? (
              <div className="flex w-full gap-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveTitle(album.id)}
                  autoFocus
                  className="h-8 text-sm"
                />
                <Button size="sm" onClick={() => saveTitle(album.id)} className="h-8">
                  OK
                </Button>
              </div>
            ) : (
              <>
                <h3 className="font-medium text-sm truncate flex-1" title={album.title}>
                  {album.title}
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal size={16} />
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
    </div>
  );
};
