import { HashLink as Link } from "react-router-hash-link";
import { useUTM } from "../hooks/getUTM";

export default function Header({ links = true }) {
  const { utm_source, utm_medium, utm_campaign, utm_content } = useUTM();

  return (
    <header className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center">
              {/* Светлая тема */}
              <img
                className="block dark:hidden"
                width="40"
                height="40"
                src="/light-logo.svg"
                alt="earmiss-logo"
              />
              {/* Тёмная тема */}
              <img
                className="hidden dark:block"
                width="40"
                height="40"
                src="/dark-logo.svg"
                alt="earmiss-logo"
              />
          </div>
          <div>
            <div className="text-xl font-semibold">earmiss</div>
            <div className="text-sm">Бесплатный Telegram-бот: голос → конспект</div>
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

        
        <a
          href={`https://t.me/EarmissBot?start=${utm_source}-${utm_medium}-${utm_campaign}-${utm_content}`}
          target="_blank"
          rel="noopener noreferrer"
className="px-4 py-2 rounded-md bg-gradient-to-r from-[#FF5C50]/90 to-[#FF7B66] font-semibold text-white"
        >
          Запустить в Telegram
        </a>
      </nav>
    </header>
  );
}
