import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppContextType {
  images: string[];
  addImage: (uri: string) => Promise<void>;
  removeImage: (uri: string) => Promise<void>;
  clearImages: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

interface IProps {
  children: React.ReactNode;
}

const STORAGE_KEY = "saved_images";

const AppProvider: React.FC<IProps> = ({ children }) => {
  const [images, setImages] = useState<string[]>([]);

  // Load từ AsyncStorage khi app mở
  useEffect(() => {(async () => {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) {
          setImages(JSON.parse(data));
        }
      } catch (error) {
        console.error("Error load images:", error);
      }
    })();
  }, []);

  // Save image to AsyncStorage
  const persist = async (newImages: string[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newImages));
    } catch (error) {
      console.error("Lỗi lưu images:", error);
    }
  };

  const addImage = async (uri: string) => {
    setImages((prev) => {
      const newList = [...prev, uri];
      persist(newList);
      return newList;
    });
  };

  const removeImage = async (uri: string) => {
    setImages((prev) => {
      const newList = prev.filter((i) => i !== uri);
      persist(newList);
      return newList;
    });
  };

  const clearImages = async () => {
    setImages([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AppContext.Provider value={{ images, addImage, removeImage, clearImages }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp phải dùng trong <AppProvider>");
  return ctx;
};

export default AppProvider;
