import { supabase } from "@/integrations/supabase/client";

export interface UserDataManager {
  saveToAccount: () => Promise<void>;
  loadFromAccount: () => Promise<void>;
  clearLocalData: () => void;
  isLoggedIn: () => boolean;
}

const getUserId = () => {
  const storedUser = localStorage.getItem('hideout_user') || sessionStorage.getItem('hideout_user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      return user.id;
    } catch {}
  }
  return null;
};

const getAllLocalStorage = (): Record<string, any> => {
  const allData: Record<string, any> = {};
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('hideout_') && !key.includes('user')) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          allData[key] = JSON.parse(value);
        }
      } catch (error) {
        // If not JSON, store as string
        const value = localStorage.getItem(key);
        if (value) allData[key] = value;
      }
    }
  }
  
  return allData;
};

const getAllCookies = (): Record<string, string> => {
  const cookies: Record<string, string> = {};
  const cookieString = document.cookie;
  
  if (cookieString) {
    cookieString.split(';').forEach(cookie => {
      const [name, ...rest] = cookie.split('=');
      const trimmedName = name.trim();
      if (trimmedName.startsWith('hideout_')) {
        cookies[trimmedName] = rest.join('=').trim();
      }
    });
  }
  
  return cookies;
};

const setAllLocalStorage = (data: Record<string, any>) => {
  Object.entries(data).forEach(([key, value]) => {
    if (key.startsWith('hideout_') && !key.includes('user')) {
      try {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting ${key}:`, error);
      }
    }
  });
};

const setAllCookies = (cookies: Record<string, string>) => {
  Object.entries(cookies).forEach(([name, value]) => {
    if (name.startsWith('hideout_')) {
      // Set cookie with 1 year expiry
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    }
  });
};

export const useUserData = (): UserDataManager => {
  const saveToAccount = async () => {
    const userId = getUserId();
    if (!userId) {
      console.log('Not logged in, skipping save to account');
      return;
    }

    try {
      const localStorageData = getAllLocalStorage();
      const cookiesData = getAllCookies();

      const { error } = await supabase
        .from('user_data')
        .upsert({
          user_id: userId,
          local_storage: localStorageData,
          cookies: cookiesData
        }, {
          onConflict: 'user_id'
        }) as any;

      if (error) throw error;

      console.log('Successfully saved data to account');
    } catch (error) {
      console.error('Error saving to account:', error);
    }
  };

  const loadFromAccount = async () => {
    const userId = getUserId();
    if (!userId) {
      console.log('Not logged in, skipping load from account');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('local_storage, cookies')
        .eq('user_id', userId)
        .maybeSingle() as any;

      if (error) throw error;

      if (data) {
        // Load localStorage
        if (data.local_storage) {
          setAllLocalStorage(data.local_storage);
        }

        // Load cookies
        if (data.cookies) {
          setAllCookies(data.cookies);
        }

        console.log('Successfully loaded data from account');
      }
    } catch (error) {
      console.error('Error loading from account:', error);
    }
  };

  const clearLocalData = () => {
    // Clear all hideout_ localStorage items (except user session)
    const keysToRemove = Object.keys(localStorage).filter(
      key => key.startsWith('hideout_') && !key.includes('user')
    );
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Clear hideout_ cookies
    const cookies = getAllCookies();
    Object.keys(cookies).forEach(name => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    console.log('Cleared all local data');
  };

  const isLoggedIn = () => {
    return getUserId() !== null;
  };

  return {
    saveToAccount,
    loadFromAccount,
    clearLocalData,
    isLoggedIn
  };
};

// Auto-sync localStorage changes to account
let saveTimeout: NodeJS.Timeout;
const debouncedSave = () => {
  const userId = getUserId();
  if (!userId) return;

  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    const { saveToAccount } = useUserData();
    await saveToAccount();
  }, 1000); // Debounce for 1 second
};

// Listen for localStorage changes
if (typeof window !== 'undefined') {
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key: string, value: string) {
    originalSetItem.apply(this, [key, value]);
    if (key.startsWith('hideout_') && !key.includes('user')) {
      debouncedSave();
    }
  };
}
