import { useParams } from "react-router-dom";
import "katex/dist/katex.min.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { api } from "../api/axiosInstance";
import Editor from "../components/Editor";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const fetchSummary = async (uuid) => {
  const { data } = await api.get(`/summaries/${uuid}`);

  // Проверяем, что message и blocks существуют
  if (data?.message?.blocks) {
    data.message.blocks.unshift({
      type: "header",
      data: {
        text: data.name,
        level: 1
      }
    });
  }

  return data;
};

export default function QueryPage() {
  const { uuid } = useParams();

  // Функция onChange для Editor
  const handleEditorChange = () => {};

  const { data, isLoading, error } = useQuery({
    queryKey: ["summary", uuid],
    queryFn: () => fetchSummary(uuid),
    enabled: !!uuid,
    retry: 2,
  });

  // Устанавливаем title безопасно
  useEffect(() => {
    if (data?.name) {
      document.title = data.name;
    }
  }, [data?.name]);

  return (
    <div>
      <Header authControl={true} />
      <main className="flex-grow w-full flex justify-center">
        <div className="w-full max-w-2xl px-4"> {/* Уменьшили max-w-4xl до max-w-2xl */}
          <Editor
            data={data?.message}
            loading={isLoading}
            onChange={handleEditorChange}
            error={error}
            editorBlock="editorjs"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
