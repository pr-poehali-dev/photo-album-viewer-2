
import { Link } from "react-router-dom";
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
  orientation: "portrait" | "landscape";
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
      title: `Альбом ${albums.length + 1}`,
      coverUrl: "https://source.unsplash.com/random/300x300/?nature",
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
        </div>

        <AlbumGrid 
          albums={albums} 
          onDeleteAlbum={deleteAlbum}
          onUpdateTitle={updateAlbumTitle}
          onCreateAlbum={createNewAlbum}
        />
      </main>
    </div>
  );
};

export default Index;
