'use client';

export function ThemeToggle() {
  return (
    <button
      className="btn btn-ghost"
      onClick={() => {
        const root = document.documentElement;
        root.classList.toggle('dark');
        localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
      }}
    >
      <span className="hidden sm:inline">Theme</span> 🌓
    </button>
  );
}

