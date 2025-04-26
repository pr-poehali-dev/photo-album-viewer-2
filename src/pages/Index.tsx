
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AlbumGrid } from "@/components/AlbumGrid";
import { TopNavigation } from "@/components/TopNavigation";

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
}

const Index = () => {
  const { toast } = useToast();
  const [albums, setAlbums] = useState<Album[]>(() => {
    const savedAlbums = localStorage.getItem("photoAlbums");
    return savedAlbums ? JSON.parse(savedAlbums) : [];
  });

  const createNewAlbum = () => {
    const newAlbumId = `album-${Date.now()}`;
    const newAlbum: Album = {
      id: newAlbumId,
      title: `Новый альбом ${albums.length + 1}`,
      coverUrl: "https://source.unsplash.com/random/300x300/?nature",
      photos: [],
    };

    const updatedAlbums = [...albums, newAlbum];
    setAlbums(updatedAlbums);
    localStorage.setItem("photoAlbums", JSON.stringify(updatedAlbums));
    
    toast({
      title: "Альбом создан",
      description: `Альбом "${newAlbum.title}" успешно создан`,
    });
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
          <h1 className="text-3xl font-bold">Мои фотоальбомы</h1>
          <Button onClick={createNewAlbum}>
            <PlusCircle className="mr-2" size={18} />
            Создать альбом
          </Button>
        </div>

        {albums.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] bg-accent/20 rounded-lg">
            <div className="text-center p-8">
              <h2 className="text-2xl font-medium mb-2">Нет альбомов</h2>
              <p className="text-muted-foreground mb-4">Создайте свой первый фотоальбом, чтобы начать</p>
              <Button onClick={createNewAlbum} variant="secondary" size="lg">
                <PlusCircle className="mr-2" size={18} />
                Создать альбом
              </Button>
            </div>
          </div>
        ) : (
          <AlbumGrid 
            albums={albums} 
            onDeleteAlbum={deleteAlbum}
            onUpdateTitle={updateAlbumTitle}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
