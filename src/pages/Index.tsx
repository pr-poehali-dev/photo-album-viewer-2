
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AlbumGrid } from "@/components/AlbumGrid";
import { TopNavigation } from "@/components/TopNavigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface Album {
  id: string;
  title: string;
  coverUrl: string;
  photos: Photo[];
}

export interface Photo {
  id: string;
  title: string;
  url: string;
  orientation: "portrait" | "landscape";
}

const Index = () => {
  const { toast } = useToast();
  const [albums, setAlbums] = useState<Album[]>(() => {
    const savedAlbums = localStorage.getItem("photoAlbums");
    return savedAlbums ? JSON.parse(savedAlbums) : [];
  });

  const [albumSize, setAlbumSize] = useState<number>(3); // Default medium size

  const createNewAlbum = () => {
    const newAlbumId = `album-${Date.now()}`;
    const newAlbum: Album = {
      id: newAlbumId,
      title: `Альбом ${albums.length + 1}`,
      coverUrl: "",
      photos: [],
    };

    const updatedAlbums = [...albums, newAlbum];
    setAlbums(updatedAlbums);
    localStorage.setItem("photoAlbums", JSON.stringify(updatedAlbums));
  };

  const deleteAlbum = (albumId: string) => {
    const updatedAlbums = albums.filter(album => album.id !== albumId);
    setAlbums(updatedAlbums);
    localStorage.setItem("photoAlbums", JSON.stringify(updatedAlbums));
    
    toast({
      title: "Альбом удален",
      description: "Альбом успешно удален",
    });
  };

  const deleteAllAlbums = () => {
    setAlbums([]);
    localStorage.setItem("photoAlbums", JSON.stringify([]));
    
    toast({
      title: "Все альбомы удалены",
      description: "Все альбомы были успешно удалены",
    });
  };

  const updateAlbumTitle = (albumId: string, newTitle: string) => {
    const updatedAlbums = albums.map(album => 
      album.id === albumId ? { ...album, title: newTitle } : album
    );
    setAlbums(updatedAlbums);
    localStorage.setItem("photoAlbums", JSON.stringify(updatedAlbums));
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Мои фотоальбомы</h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap">Размер альбомов:</span>
              <Slider
                className="w-32"
                min={1}
                max={5}
                step={1}
                value={[albumSize]}
                onValueChange={(values) => setAlbumSize(values[0])}
              />
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={albums.length === 0}>
                  <Trash2 size={16} className="mr-2" />
                  Удалить все альбомы
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить все альбомы?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. Все альбомы и фотографии будут удалены.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteAllAlbums}>Удалить</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <AlbumGrid 
          albums={albums} 
          onDeleteAlbum={deleteAlbum}
          onUpdateTitle={updateAlbumTitle}
          onCreateAlbum={createNewAlbum}
          albumSize={albumSize}
        />
      </main>
    </div>
  );
};

export default Index;
