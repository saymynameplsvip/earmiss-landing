import React from "react";
import { HashLink as Link } from "react-router-hash-link";
import { useUTM } from "../hooks/getUTM";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Header({ links = true, authControl = false, requestAuthCode }) {
  const { utm_source, utm_medium, utm_campaign, utm_content } = useUTM();
  const { accessToken, saveJwt } = useAuth();

  console.log(accessToken)

  const handleLogout = async () => {
    axios.post("/logout");
    saveJwt({ accessToken: undefined, refreshToken: undefined });
    document.location.reload()
  };

  return (
    <header className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center">
            <img width="60" height="60" src="/logotype.svg" alt="earmiss-logo" />
          </div>
          <div>
            <div className="text-xl font-semibold text-[#FF6F61]">earmiss</div>
            <div className="text-sm text-gray-600">Бесплатный Telegram-бот: голос → конспект</div>
          </div>
        </Link>
      </div>
      <nav className="hidden md:flex gap-6 items-center text-gray-700">
        {links && (
          <>
            <Link to="/#features" className="hover:underline">Функции</Link>
            <Link to="/#how" className="hover:underline">Как работает</Link>
            <Link to="/#faq" className="hover:underline">FAQ</Link>
          </>
        )}

        {authControl ? (
          accessToken ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 font-semibold"
            >
              Выйти
            </button>
          ) : (
            <button
              onClick={requestAuthCode}
              className="px-4 py-2 rounded-md bg-blue-500 text-white font-semibold"
            >
              Авторизоваться
            </button>
          )
        ) : (
          <a
            href={`https://t.me/EarmissBot?start=${utm_source}-${utm_medium}-${utm_campaign}-${utm_content}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-md bg-gradient-to-r from-[#FF6F61]/80 to-[#FF6F61] text-white font-semibold"
          >
            Запустить в Telegram
          </a>
        )}
      </nav>
    </header>
  );
}
