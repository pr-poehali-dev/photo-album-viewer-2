
import { useState, useEffect, useRef, useCallback, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Album, Photo } from "./Index";
import { TopNavigation } from "@/components/TopNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Camera, Edit, Grid, List, PlusCircle, Save, Trash2 } from "lucide-react";
import { PhotoGrid } from "@/components/PhotoGrid";
import { PhotoList } from "@/components/PhotoList";
import { useToast } from "@/components/ui/use-toast";
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

// Оптимизированная компонента для отображения альбома
const AlbumView = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [album, setAlbum] = useState<Album | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    const saved = localStorage.getItem("viewMode");
    return saved === "list" ? "list" : "grid";
  });
  const [photoGap, setPhotoGap] = useState(() => {
    const saved = localStorage.getItem("photoGap");
    return saved ? parseInt(saved) : 1;
  });
  const [photoSize, setPhotoSize] = useState(() => {
    const saved = localStorage.getItem("photoSize");
    return saved ? parseInt(saved) : 3;
  });
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Сохраняем настройки отображения
  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem("photoGap", photoGap.toString());
  }, [photoGap]);

  useEffect(() => {
    localStorage.setItem("photoSize", photoSize.toString());
  }, [photoSize]);

  // Загружаем альбом при монтировании
  useEffect(() => {
    const loadAlbum = () => {
      try {
        const savedAlbums = localStorage.getItem("photoAlbums");
        if (savedAlbums) {
          const albums: Album[] = JSON.parse(savedAlbums);
          const foundAlbum = albums.find(a => a.id === albumId);
          if (foundAlbum) {
            setAlbum(foundAlbum);
            setEditedTitle(foundAlbum.title);
          } else {
            navigate("/", { replace: true });
          }
        } else {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Ошибка загрузки альбома:", error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить альбом",
          variant: "destructive"
        });
        navigate("/", { replace: true });
      }
    };

    loadAlbum();
  }, [albumId, navigate, toast]);

  // Оптимизированная функция добавления фотографий
  const handleAddPhotos = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const processNewPhotos = useCallback((files: File[]) => {
    if (!album || files.length === 0) return;
    
    // Показываем уведомление о начале загрузки
    toast({
      title: "Обработка фотографий",
      description: `Добавление ${files.length} ${files.length === 1 ? 'фотографии' : 'фотографий'}...`,
    });

    // Используем оптимизированный подход для обработки изображений
    const updatedPhotos = [...album.photos];
    const newPhotos: Photo[] = [];
    let filesProcessed = 0;
    
    // Создаем обработчик для каждого файла
    const processFile = (file: File, index: number) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (!e.target?.result) return;
        
        const img = new Image();
        img.onload = () => {
          const orientation = img.width >= img.height ? "landscape" : "portrait";
          
          const newPhoto: Photo = {
            id: `photo-${Date.now()}-${index}`,
            title: file.name.split('.')[0] || `Фото ${album.photos.length + index + 1}`,
            url: e.target?.result as string,
            orientation: orientation
          };
          
          newPhotos.push(newPhoto);
          filesProcessed++;
          
          // Когда все файлы обработаны
          if (filesProcessed === files.length) {
            const allPhotos = [...updatedPhotos, ...newPhotos];
            const coverUrl = album.coverUrl || (newPhotos.length > 0 ? newPhotos[0].url : "");
            
            const updatedAlbum = {
              ...album,
              photos: allPhotos,
              coverUrl
            };
            
            // Обновляем состояние
            setAlbum(updatedAlbum);
            
            // Обновляем в localStorage
            saveAlbum(updatedAlbum);
            
            toast({
              title: "Фотографии добавлены",
              description: `Успешно добавлено ${files.length} ${files.length === 1 ? 'фото' : 'фотографий'}`,
            });
          }
        };
        
        img.src = e.target.result as string;
      };
      
      reader.readAsDataURL(file);
    };
    
    // Обрабатываем файлы последовательно
    files.forEach(processFile);
  }, [album, toast]);

  // Функция сохранения альбома в localStorage
  const saveAlbum = useCallback((updatedAlbum: Album) => {
    try {
      const savedAlbums = localStorage.getItem("photoAlbums");
      if (savedAlbums) {
        const albums: Album[] = JSON.parse(savedAlbums);
        const updatedAlbums = albums.map(a => 
          a.id === updatedAlbum.id ? updatedAlbum : a
        );
        localStorage.setItem("photoAlbums", JSON.stringify(updatedAlbums));
      }
    } catch (error) {
      console.error("Ошибка сохранения альбома:", error);
      toast({
        title: "Ошибка сохранения",
        description: "Не удалось сохранить изменения",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const files = Array.from(event.target.files);
    
    if (files.length > 0) {
      processNewPhotos(files);
      
      // Reset input value to allow uploading the same file again
      event.target.value = '';
    }
  }, [processNewPhotos]);

  const deletePhoto = useCallback((photoId: string) => {
    if (!album) return;
    
    const updatedPhotos = album.photos.filter(photo => photo.id !== photoId);
    
    // Determine new cover URL if the current cover is deleted
    let newCoverUrl = album.coverUrl;
    const deletedPhoto = album.photos.find(p => p.id === photoId);
    if (deletedPhoto && deletedPhoto.url === album.coverUrl && updatedPhotos.length > 0) {
      newCoverUrl = updatedPhotos[0].url;
    } else if (updatedPhotos.length === 0) {
      newCoverUrl = "";
    }
    
    const updatedAlbum = { 
      ...album, 
      photos: updatedPhotos,
      coverUrl: newCoverUrl
    };
    
    // Обновляем состояние
    setAlbum(updatedAlbum);
    
    // Сохраняем в localStorage
    saveAlbum(updatedAlbum);
    
    toast({
      title: "Фото удалено",
      description: "Фото успешно удалено из альбома",
    });
  }, [album, saveAlbum, toast]);

  const deleteAllPhotos = useCallback(() => {
    if (!album) return;
    
    const updatedAlbum = { 
      ...album, 
      photos: [],
      coverUrl: ""
    };
    
    // Обновляем состояние
    setAlbum(updatedAlbum);
    
    // Сохраняем в localStorage
    saveAlbum(updatedAlbum);
    
    toast({
      title: "Все фото удалены",
      description: "Все фотографии успешно удалены из альбома",
    });
  }, [album, saveAlbum, toast]);

  const startEditingTitle = useCallback(() => {
    if (album) {
      setEditedTitle(album.title);
      setIsEditingTitle(true);
    }
  }, [album]);

  const saveAlbumTitle = useCallback(() => {
    if (!album || !editedTitle.trim()) return;
    
    const updatedAlbum = { ...album, title: editedTitle.trim() };
    setAlbum(updatedAlbum);
    setIsEditingTitle(false);
    
    // Сохраняем в localStorage
    saveAlbum(updatedAlbum);
    
    toast({
      title: "Название изменено",
      description: "Название альбома успешно обновлено",
    });
  }, [album, editedTitle, saveAlbum, toast]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveAlbumTitle();
    }
  }, [saveAlbumTitle]);

  // Покажем загрузку, если альбом еще не загружен
  if (!album) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Загрузка альбома...</p>
        </div>
      </div>
    );
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
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-64"
                    autoFocus
                  />
                  <Button size="sm" onClick={saveAlbumTitle}>
                    <Save size={16} className="mr-2" />
                    Сохранить
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{album.title}</h1>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={startEditingTitle}
                    className="h-8 w-8"
                  >
                    <Edit size={16} />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap">Отступы:</span>
                <Slider
                  className="w-24"
                  min={0}
                  max={5}
                  step={1}
                  value={[photoGap]}
                  onValueChange={(values) => setPhotoGap(values[0])}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap">Размер:</span>
                <Slider
                  className="w-24"
                  min={1}
                  max={5}
                  step={1}
                  value={[photoSize]}
                  onValueChange={(values) => setPhotoSize(values[0])}
                />
              </div>
              
              <input 
                type="file" 
                accept="image/*" 
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <Button onClick={handleAddPhotos}>
                <PlusCircle size={18} className="mr-2" />
                Добавить фото
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={album.photos.length === 0}>
                    <Trash2 size={16} className="mr-2" />
                    Удалить все фото
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Удалить все фотографии?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Это действие нельзя отменить. Все фотографии из альбома будут удалены.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteAllPhotos}>Удалить</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
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
            <PhotoGrid 
              photos={album.photos} 
              onDeletePhoto={deletePhoto} 
              photoGap={photoGap} 
              photoSize={photoSize}
            />
          </TabsContent>
          
          <TabsContent value="list">
            <PhotoList photos={album.photos} onDeletePhoto={deletePhoto} />
          </TabsContent>
        </Tabs>
        
        {album.photos.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[40vh] bg-accent/20 rounded-lg">
            <div className="text-center p-8">
              <Camera size={64} className="mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-medium mb-2">В этом альбоме пока нет фотографий</h2>
              <p className="text-muted-foreground mb-4">Добавьте свои фотографии в этот альбом</p>
              <Button onClick={handleAddPhotos} variant="secondary">
                <PlusCircle className="mr-2" size={18} />
                Добавить фотографии
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AlbumView;
