
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { TopNavigation } from "@/components/TopNavigation";
import { AlbumGrid } from "@/components/AlbumGrid";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";

// Определяем типы для данных
export interface Photo {
  id: string;
  title: string;
  url: string;
  orientation: "portrait" | "landscape";
}

export interface Album {
  id: string;
  title: string;
  coverUrl: string;
  photos: Photo[];
}

const Index = () => {
  const { toast } = useToast();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [albumSize, setAlbumSize] = useState<number>(3); // Размер альбомов (1-5)

  // Используем useCallback для оптимизации функций
  const loadAlbums = useCallback(() => {
    try {
      const savedAlbums = localStorage.getItem("photoAlbums");
      if (savedAlbums) {
        setAlbums(JSON.parse(savedAlbums));
      }
    } catch (error) {
      console.error("Ошибка загрузки альбомов:", error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить альбомы",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Загружаем альбомы при монтировании компонента
  useEffect(() => {
    loadAlbums();
    
    // Загружаем сохраненный размер альбомов
    const savedSize = localStorage.getItem("albumSize");
    if (savedSize) {
      setAlbumSize(parseInt(savedSize));
    }
  }, [loadAlbums]);

  // Сохраняем размер альбомов
  useEffect(() => {
    localStorage.setItem("albumSize", albumSize.toString());
  }, [albumSize]);

  // Функция создания нового альбома
  const createAlbum = useCallback(() => {
    const newAlbum: Album = {
      id: `album-${Date.now()}`,
      title: `Альбом ${albums.length + 1}`,
      coverUrl: "",
      photos: []
    };
    
    const updatedAlbums = [...albums, newAlbum];
    setAlbums(updatedAlbums);
    
    try {
      localStorage.setItem("photoAlbums", JSON.stringify(updatedAlbums));
      toast({
        title: "Успешно создано",
        description: "Новый альбом добавлен"
      });
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      toast({
        title: "Ошибка сохранения",
        description: "Не удалось сохранить альбом",
        variant: "destructive",
      });
    }
  }, [albums, toast]);

  // Функция удаления альбома
  const deleteAlbum = useCallback((id: string) => {
    const updatedAlbums = albums.filter(album => album.id !== id);
    setAlbums(updatedAlbums);
    
    try {
      localStorage.setItem("photoAlbums", JSON.stringify(updatedAlbums));
      toast({
        title: "Альбом удален",
        description: "Альбом успешно удален"
      });
    } catch (error) {
      console.error("Ошибка удаления:", error);
      toast({
        title: "Ошибка удаления",
        description: "Не удалось удалить альбом",
        variant: "destructive",
      });
    }
  }, [albums, toast]);

  // Функция обновления названия альбома
  const updateAlbumTitle = useCallback((id: string, title: string) => {
    const updatedAlbums = albums.map(album => 
      album.id === id ? { ...album, title } : album
    );
    setAlbums(updatedAlbums);
    
    try {
      localStorage.setItem("photoAlbums", JSON.stringify(updatedAlbums));
      toast({
        title: "Название обновлено",
        description: "Название альбома изменено"
      });
    } catch (error) {
      console.error("Ошибка обновления:", error);
      toast({
        title: "Ошибка обновления",
        description: "Не удалось обновить название",
        variant: "destructive",
      });
    }
  }, [albums, toast]);

  // Функция удаления всех альбомов
  const deleteAllAlbums = useCallback(() => {
    setAlbums([]);
    try {
      localStorage.removeItem("photoAlbums");
      toast({
        title: "Все альбомы удалены",
        description: "Все альбомы были успешно удалены"
      });
    } catch (error) {
      console.error("Ошибка удаления всех альбомов:", error);
      toast({
        title: "Ошибка удаления",
        description: "Не удалось удалить все альбомы",
        variant: "destructive",
      });
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      
      <main className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Мои фотоальбомы</h1>
          
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm">Размер альбомов:</span>
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
                <Button 
                  variant="destructive" 
                  size="sm"
                  disabled={albums.length === 0}
                >
                  <Trash2 size={16} className="mr-2" />
                  Удалить все альбомы
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить все альбомы?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. Все альбомы и фотографии в них будут удалены.
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
        
        {albums.length === 0 ? (
          <div className="text-center py-16 bg-accent/20 rounded-lg">
            <h2 className="text-xl font-medium mb-4">У вас пока нет альбомов</h2>
            <Button onClick={createAlbum}>
              Создать новый альбом
            </Button>
          </div>
        ) : (
          <AlbumGrid 
            albums={albums}
            onDeleteAlbum={deleteAlbum}
            onUpdateTitle={updateAlbumTitle}
            onCreateAlbum={createAlbum}
            albumSize={albumSize}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
