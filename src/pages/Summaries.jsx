import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const fetchSummary = async (uuid) => {
  const { data } = await api.get(`/summaries/${uuid}`);
  return data;
};

const fetchSearch = async (query) => {
  const { data } = await api.get("/summaries", { params: { search: query } });
  return data;
};

const fetchUserData = async () => {
  const { data } = await api.get("me"); 
  return data.summaries;
};

export default function QueryPage() {
  const { uuid } = useParams();
  const { accessToken, authCode, saveCode, saveJwt, saveRefreshToken } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Дебаунс поиска
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Запросы
  const { data: searchData } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => fetchSearch(debouncedQuery),
    enabled: !!debouncedQuery,
    keepPreviousData: true,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["summary", uuid],
    queryFn: () => fetchSummary(uuid),
    enabled: !!uuid,
    retry: 2,
  });

  const { data: summariesData, isSummariesLoading } = useQuery({
    queryKey: ["summaries", accessToken],
    queryFn: () => fetchUserData(),
    enabled: !!accessToken,
    retry: 2,
  });

  const requestAuthCode = async () => {
    try {
      const { data } = await api.get("/auth/telegram/code");
      saveCode(data.code);
      const telegramLink = `https://t.me/esummarizerbot?start=auth-${data.code}-q`;
      window.open(telegramLink, "_blank");
    } catch (err) {
      console.error("Ошибка запроса кода:", err);
    }
  };

  useEffect(() => {
    if (!authCode || accessToken) return;

    const interval = setInterval(async () => {
      try {
        const { data } = await api.post(`/auth/telegram/code/verify`, { code: authCode });
        if (data?.jwt) {
          saveJwt(data.jwt);
          saveCode(undefined);
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Ошибка при проверке кода:", err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [accessToken, saveCode, authCode, saveJwt, saveRefreshToken]);

  return (
    <div>
      {/* Header */}
      <Header authControl={true} requestAuthCode={requestAuthCode} />

      {/* Мобильный верхний бар: гамбургер + поиск */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 bg-[#FFF8F0] sticky top-0 z-40">
        <button
          className="flex flex-col justify-between w-6 h-5"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        >
          <span className="block w-full h-0.5 bg-gray-700"></span>
          <span className="block w-full h-0.5 bg-gray-700"></span>
          <span className="block w-full h-0.5 bg-gray-700"></span>
        </button>

        <input
          type="text"
          placeholder={accessToken ? "Поиск..." : "Авторизуйтесь, чтобы искать свои конспекты"}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 ml-4 bg-white/80 py-2 px-3 rounded-xl border border-gray-300"
          disabled={!accessToken}
        />
      </div>

      {/* Мобильный sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-white shadow-lg overflow-y-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Мои конспекты</h3>
            <button onClick={() => setMobileSidebarOpen(false)}>✕</button>
          </div>
          {!accessToken ? (
            <p className="text-gray-500 italic text-center mt-8">
              Авторизуйтесь, чтобы увидеть свои конспекты
            </p>
          ) : !isSummariesLoading && summariesData && summariesData.length > 0 ? (
            summariesData.map((s) => (
              <a
                key={s.uuid}
                href={`#/summaries/${s.uuid}`}
                className="block p-2 hover:bg-gray-100 rounded"
              >
                {s.name}
              </a>
            ))
          ) : (
            <p className="text-gray-500 italic text-center mt-8">Нет конспектов</p>
          )}
        </div>
      )}

      <div className="bg-[#FFF8F0] min-h-dvh flex flex-col">
        <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full px-5 pb-5">
          {/* Sidebar десктоп */}
          <aside className="hidden md:block w-full md:w-1/4 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-4 overflow-y-auto max-h-[calc(100dvh-150px)] sticky top-6">
            <h3 className="font-semibold mb-4">Мои конспекты</h3>
            {!accessToken ? (
              <div className="h-full flex items-start justify-center pt-1/3">
                <li className="text-gray-500 italic text-center">
                  Авторизуйтесь, чтобы увидеть свои конспекты
                </li>
              </div>
            ) : !isSummariesLoading && summariesData && summariesData.length > 0 ? (
              summariesData.map((summary) => (
                <li key={summary.uuid} className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <a href={`#/summaries/${summary.uuid}`} className="block w-full h-full">
                    {summary.name}
                  </a>
                </li>
              ))
            ) : (
              <li className="text-gray-500 italic text-center">Нет конспектов</li>
            )}
          </aside>

          {/* Main content */}
          <div className="flex-1 hidden md:block">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder={accessToken ? "Поиск..." : "Авторизуйтесь, чтобы искать свои конспекты"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/80 w-full py-2 px-3 rounded-xl border border-gray-300"
                disabled={!accessToken}
              />
              {debouncedQuery && searchData?.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-xl max-h-80 overflow-y-auto p-2">
                  {searchData.map((item) => (
                    <div key={item.uuid} className="p-3 hover:bg-gray-100 cursor-pointer">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-gray-500 text-sm">
                        Схожесть: {(item.similarity * 100).toFixed(2)}%
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <main className="flex-grow w-full">
              {isLoading && <p>Загрузка...</p>}
              {error && <p>Ошибка при загрузке.</p>}
              {!isLoading && !error && data?.message && (
                <div className="bg-white/80 p-8 rounded-2xl shadow-lg border">
                  <ReactMarkdown rehypePlugins={[rehypeRaw, remarkMath, rehypeKatex, remarkGfm]}>
                    {data.message}
                  </ReactMarkdown>
                </div>
              )}
              {!isLoading && !error && !data?.message && <p>Конспект не найден.</p>}
            </main>
          </div>
        </div>
      </div>

      {/* Плашка авторизации снизу для мобильных */}
      {!accessToken && (
        <div className="fixed bottom-0 left-0 w-full p-4 bg-white shadow-inner flex justify-center md:hidden z-50">
          <button
            onClick={requestAuthCode}
            className="px-4 py-2 rounded-md bg-blue-500 text-white font-semibold w-full max-w-xs"
          >
            Авторизоваться
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}