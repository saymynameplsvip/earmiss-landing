import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="py-10 text-gray-600 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-[#FF6F61]/50 max-w-6xl mx-auto px-6">
      <div>&copy; 2025 earmiss — телеграм-бот для генерации конспектов из аудио</div>
      <div className="flex gap-4 items-center">
        <Link to="/privacy" className="text-gray-700">Политика конфиденциальности</Link>
      </div>
    </footer>
  );
}
