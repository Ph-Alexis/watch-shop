import { createContext, useContext, useEffect, useState } from "react";
import { getSettingsApi } from "../api/settingApi";

const WebsiteSettingsContext = createContext();

const DEFAULT_SETTINGS = {
  siteName: "WatchStore",
  footerDescription: "Cửa hàng đồng hồ chính hãng với nhiều mẫu mã hiện đại, phù hợp cho mọi phong cách.",
  logoUrl: "",
  contactEmail: "support@watchstore.com",
  contactPhone: "+84 123 456 789",
  contactAddress: "TP. Hồ Chí Minh",
  facebookUrl: "",
  instagramUrl: "",
  tiktokUrl: "",
};

export function WebsiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const res = await getSettingsApi();
      const data = res?.data || {};
      setSettings((prev) => ({ ...prev, ...data }));
    } catch (error) {
      console.error("Get settings failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <WebsiteSettingsContext.Provider
      value={{
        settings,
        setSettings,
        refreshSettings,
        loading,
      }}
    >
      {children}
    </WebsiteSettingsContext.Provider>
  );
}

export function useWebsiteSettings() {
  return useContext(WebsiteSettingsContext);
}
