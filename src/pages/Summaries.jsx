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
  return data;
};


export default function QueryPage() {
  const { uuid } = useParams();

  const change = () => { };

  const { data, isLoading, error } = useQuery({
    queryKey: ["summary", uuid],
    queryFn: () => fetchSummary(uuid),
    enabled: !!uuid,
    retry: 2,
  });

  useEffect(() => {
    document.title = data.name;
  }, [data.name]);

  data.message.blocks.unshift({
    "data": {
        "text": data.name,
        "level": 1
    },
    "type": "header"
  });

  return (
    <div>
      <Header authControl={true} />
      <div className="min-h-dvh flex flex-col">
        <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full px-5 pb-5">
          <main className="flex-grow w-full">
            <Editor data={data.message} loading={isLoading} onChange={change} error={error} editorBlock="editorjs" />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}