import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const skinVariables = {
  teal: {
    50: '236 253 245', 100: '209 250 229', 200: '167 243 208', 300: '110 231 183',
    400: '52 211 153', 500: '16 185 129', 600: '5 150 105', 700: '4 120 87',
    800: '6 95 70', 900: '6 78 59',
  },
  green: {
    50: '240 253 244', 100: '220 252 231', 200: '187 247 208', 300: '134 239 172',
    400: '74 222 128', 500: '34 197 94', 600: '22 163 74', 700: '21 128 61',
    800: '22 101 52', 900: '20 83 45',
  },
  orange: {
    50: '255 247 237', 100: '255 237 213', 200: '254 215 170', 300: '253 186 116',
    400: '251 146 60', 500: '249 115 22', 600: '234 88 12', 700: '194 65 12',
    800: '154 52 18', 900: '124 45 18',
  },
  red: {
    50: '254 242 242', 100: '254 226 226', 200: '254 202 202', 300: '252 165 165',
    400: '248 113 113', 500: '239 68 68', 600: '220 38 38', 700: '185 28 28',
    800: '153 27 27', 900: '127 29 29',
  },
};

export default function MainLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [preferences, setPreferences] = useState(() => ({
    menuStyle: localStorage.getItem('bilzyfit_menu_style') || 'vertical',
    themeSkin: localStorage.getItem('bilzyfit_theme_skin') || 'teal',
    sideNavOptions: {
      opened: localStorage.getItem('bilzyfit_sidenav_opened') !== 'false',
      pinned: localStorage.getItem('bilzyfit_sidenav_pinned') === 'true',
      userInfo: localStorage.getItem('bilzyfit_sidenav_user_info') !== 'false',
    },
  }));

  useEffect(() => {
    document.documentElement.dataset.skin = preferences.themeSkin;
    Object.entries(skinVariables[preferences.themeSkin] || skinVariables.teal).forEach(([shade, value]) => {
      document.documentElement.style.setProperty(`--primary-${shade}`, value);
    });
    localStorage.setItem('bilzyfit_menu_style', preferences.menuStyle);
    localStorage.setItem('bilzyfit_theme_skin', preferences.themeSkin);
    Object.entries(preferences.sideNavOptions).forEach(([key, value]) => {
      localStorage.setItem(`bilzyfit_sidenav_${key}`, String(value));
    });
  }, [preferences]);

  useEffect(() => {
    const handlePreferenceEvent = (event) => {
      const changes = event.detail || {};
      setPreferences((current) => ({ ...current, ...changes }));
    };
    window.addEventListener('bilzyfit-preferences-change', handlePreferenceEvent);
    return () => window.removeEventListener('bilzyfit-preferences-change', handlePreferenceEvent);
  }, []);

  const updatePreference = (key, value) => {
    setPreferences((current) => ({ ...current, [key]: value }));
    if (key === 'themeSkin') {
      document.documentElement.dataset.skin = value;
      Object.entries(skinVariables[value] || skinVariables.teal).forEach(([shade, color]) => {
        document.documentElement.style.setProperty(`--primary-${shade}`, color);
      });
    }
  };

  const layoutContent = (
    <>
      <TopNav
        onMenuClick={() => setMobileOpen(true)}
        menuStyle={preferences.menuStyle}
        themeSkin={preferences.themeSkin}
        sideNavOptions={preferences.sideNavOptions}
        onPreferenceChange={updatePreference}
      />
      {preferences.menuStyle === 'horizontal' && (
        <Sidebar
          menuStyle={preferences.menuStyle}
          sideNavOptions={preferences.sideNavOptions}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
      )}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4 print:hidden md:p-6 lg:p-8">
        {children}
      </main>
    </>
  );

  return (
    <div className="flex min-h-full flex-1">
      {preferences.menuStyle === 'vertical' && (
        <>
          <Sidebar
            menuStyle={preferences.menuStyle}
            sideNavOptions={preferences.sideNavOptions}
            mobileOpen={mobileOpen}
            onClose={() => setMobileOpen(false)}
          />
          <div className={`hidden shrink-0 print:hidden md:block ${preferences.sideNavOptions.pinned ? 'md:w-60' : 'md:w-16'}`} />
        </>
      )}
      <div className="flex min-w-0 flex-1 flex-col">{layoutContent}</div>
    </div>
  );
}
