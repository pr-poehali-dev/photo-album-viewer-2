
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Album, Photo } from "./Index";
import { TopNavigation } from "@/components/TopNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Grid, List, PlusCircle, UploadCloud } from "lucide-react";
import { PhotoGrid } from "@/components/PhotoGrid";
import { PhotoList } from "@/components/PhotoList";
import { useToast } from "@/components/ui/use-toast";

const AlbumView = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [album, setAlbum] = useState<Album | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isUploading, setIsUploading] = useState(false);
  const [newPhotoTitle, setNewPhotoTitle] = useState("");

  useEffect(() => {
    const savedAlbums = localStorage.getItem("photoAlbums");
    if (savedAlbums) {
      const albums: Album[] = JSON.parse(savedAlbums);
      const foundAlbum = albums.find(a => a.id === albumId);
      if (foundAlbum) {
        setAlbum(foundAlbum);
      } else {
        navigate("/", { replace: true });
      }
    } else {
      navigate("/", { replace: true });
    }
  }, [albumId, navigate]);

  const uploadPhoto = () => {
    if (!album) return;
    
    const photoId = `photo-${Date.now()}`;
    const newPhoto: Photo = {
      id: photoId,
      title: newPhotoTitle || `Фото ${album.photos.length + 1}`,
      url: `https://source.unsplash.com/random/800x600/?nature,${Date.now()}`,
    };
    
    const updatedPhotos = [...album.photos, newPhoto];
    const updatedAlbum = { ...album, photos: updatedPhotos };
    
    // Update local state
    setAlbum(updatedAlbum);
    
    // Update in localStorage
    const savedAlbums = localStorage.getItem("photoAlbums");
    if (savedAlbums) {
      const albums: Album[] = JSON.parse(savedAlbums);
      const updatedAlbums = albums.map(a => 
        a.id === albumId ? updatedAlbum : a
      );
      localStorage.setItem("photoAlbums", JSON.stringify(updatedAlbums));
    }
    
    // Reset form
    setNewPhotoTitle("");
    setIsUploading(false);
    
    toast({
      title: "Фото добавлено",
      description: "Новое фото успешно добавлено в альбом",
    });
  };

  const deletePhoto = (photoId: string) => {
    if (!album) return;
    
    const updatedPhotos = album.photos.filter(photo => photo.id !== photoId);
    const updatedAlbum = { ...album, photos: updatedPhotos };
    
    // Update local state
    setAlbum(updatedAlbum);
    
    // Update in localStorage
    const savedAlbums = localStorage.getItem("photoAlbums");
    if (savedAlbums) {
      const albums: Album[] = JSON.parse(savedAlbums);
      const updatedAlbums = albums.map(a => 
        a.id === albumId ? updatedAlbum : a
      );
      localStorage.setItem("photoAlbums", JSON.stringify(updatedAlbums));
    }
    
    toast({
      title: "Фото удалено",
      description: "Фото успешно удалено из альбома",
    });
  };

  if (!album) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/")} 
            className="mb-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Назад к альбомам
          </Button>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{album.title}</h1>
            
            {isUploading ? (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Название фото"
                  value={newPhotoTitle}
                  onChange={(e) => setNewPhotoTitle(e.target.value)}
                  className="w-48"
                />
                <Button onClick={uploadPhoto}>Добавить</Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsUploading(false)}
                >
                  Отмена
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsUploading(true)}>
                <UploadCloud size={18} className="mr-2" />
                Загрузить фото
              </Button>
            )}
          </div>
        </div>
        
        <Tabs 
          defaultValue="grid" 
          value={viewMode} 
          onValueChange={(value) => setViewMode(value as "grid" | "list")} 
          className="mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <small className="text-muted-foreground">
              {album.photos.length} {album.photos.length === 1 ? 'фотография' : 
                album.photos.length > 1 && album.photos.length < 5 ? 'фотографии' : 'фотографий'}
            </small>
            <TabsList>
              <TabsTrigger value="grid">
                <Grid size={16} className="mr-2" />
                Сетка
              </TabsTrigger>
              <TabsTrigger value="list">
                <List size={16} className="mr-2" />
                Список
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="grid">
            <PhotoGrid photos={album.photos} onDeletePhoto={deletePhoto} />
          </TabsContent>
          
          <TabsContent value="list">
            <PhotoList photos={album.photos} onDeletePhoto={deletePhoto} />
          </TabsContent>
        </Tabs>
        
        {album.photos.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[40vh] bg-accent/20 rounded-lg">
            <div className="text-center p-8">
              <h2 className="text-xl font-medium mb-2">В этом альбоме пока нет фотографий</h2>
              <p className="text-muted-foreground mb-4">Загрузите свою первую фотографию в этот альбом</p>
              <Button onClick={() => setIsUploading(true)} variant="secondary">
                <PlusCircle className="mr-2" size={18} />
                Добавить фотографию
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AlbumView;
