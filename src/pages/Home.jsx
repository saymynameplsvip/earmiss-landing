import Header from "../components/Header";
import Footer from "../components/Footer";
import NoteSection from "../components/NoteSection";
import { HashLink as Link } from 'react-router-hash-link';
import { useUTM } from "../hooks/getUTM";
import { useEffect } from "react";

export default function Home() {
  const { utm_source, utm_medium, utm_campaign, utm_content } = useUTM();

    useEffect(() => {
      (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {
          if (document.scripts[j].src === r) { return; }
        }
        k = e.createElement(t);
        a = e.getElementsByTagName(t)[0];
        k.async=1; k.src=r; a.parentNode.insertBefore(k,a);
      })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=104106763', 'ym');

      window.ym && window.ym(104106763, 'init', {
        ssr: true,
        webvisor: true,
        clickmap: true,
        ecommerce: "dataLayer",
        accurateTrackBounce: true,
        trackLinks: true
      });
    }, []);


  return (
    <div className="antialiased text-gray-800">
      <Header />
      <main className="max-w-6xl mx-auto px-6">
        <section className="grid md:grid-cols-2 gap-10 items-center my-12 -mt-1">
        <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-[var(--text-color)]">earmiss — бесплатный бот, который превращает аудио в конспекты.</h1>
            <p className="mt-4 text-[var(--text-color)] text-lg" style={{ opacity: 0.8 }}>Telegram-бот <strong>earmiss</strong> слушает ваши голосовые сообщения и возвращает структурированный текст — будто со страниц учебника.</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`https://t.me/EarmissBot?start=${utm_source}-${utm_medium}-${utm_campaign}-${utm_content}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-5 py-3 rounded-lg btn-telega shadow font-semibold plausible-event-name=Open+Telegram+Bot">Открыть бота в Telegram</a>
              <Link href="#how" className="px-5 py-3 rounded-lg glass border border-[rgba(255,111,97,0.8)] text-[var(--text-color)] font-semibold" style={{ opacity: 0.7 }}>Как это работает</Link>
          </div>

            <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-[var(--text-color)]">
            <div className="p-4 glass rounded-lg">
                <div className="font-semibold ">Бесплатно</div>
              <div>earmiss бесплатный, без скрытых платежей и подписок.</div>
            </div>
            <div className="p-4 glass rounded-lg">
              <div className="font-semibold">Естественно</div>
              <div>Конспект выглядит так, будто написан человеком — без таймкодов и сухости.</div>
            </div>
            <div className="p-4 glass rounded-lg">
              <div className="font-semibold">Быстро</div>
              <div>Текст за секунды, без ручного набора.</div>
            </div>
            <div className="p-4 glass rounded-lg">
              <div className="font-semibold">Конфиденциально</div>
              <div>Ваши данные под вашим контролем: автоудаление, экспорт, хранение.</div>
            </div>
          </div>
        </div>
        <div className="relative flex justify-center">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-[rgba(255,111,97,0.8)] max-w-sm w-full">
              <div className="p-6 bg-[var(--background-color)] scroll-container">
              <div className="text-center mb-4 font-semibold text-lg accent">Пример конспекта</div>
              <NoteSection title="Краткое резюме лекции">
                Лекция рассматривает время как самый важный ресурс и предлагает несколько ключевых принципов для его эффективного использования.
              </NoteSection>
              <NoteSection title="Методы и принципы управления временем">
                <p><strong>Правило двух минут:</strong> Немедленно выполняйте мелкие задачи, если они занимают меньше двух минут.</p>
                <p><strong>Матрица Эйзенхауэра:</strong> Приоритизируйте крупные дела по важности и срочности.</p>
              </NoteSection>
              <NoteSection title="Принцип делегирования">
                <p>Делегируйте задачи, которые не требуют ваших ключевых навыков.</p>
              </NoteSection>
            </div>
          </div>
        </div>
        </section>
        <section id="features" className="my-12">
          <h2 className="text-2xl font-bold text-[var(--text-color)]">Функции earmiss</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="p-6 glass rounded-lg">
              <div className="font-semibold text-lg text-[var(--text-color)]">Автоматическое распознавание</div>
              <div className="mt-2 text-[var(--text-color)]">Поддержка нескольких языков, пунктуация и структурирование текста.</div>
          </div>
          <div className="p-6 glass rounded-lg">
              <div className="font-semibold text-lg text-[var(--text-color)]">Естественный конспект</div>
              <div className="mt-2 text-[var(--text-color)]">Без сухости — текст как будто писал человек.</div>
          </div>
        </div>
      </section>
      <section id="how" className="my-12">
          <h2 className="text-2xl font-bold text-[var(--text-color)]">Как работает earmiss</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="p-6 glass rounded-lg">
              <div className="text-xl font-semibold text-[var(--text-color)]">1. Отправьте голос</div>
              <div className="mt-2 text-[var(--text-color)]">Бот принимает голосовые сообщения, и более 10 форматов аудиофайлов.</div>
          </div>
          <div className="p-6 glass rounded-lg">
              <div className="text-xl font-semibold text-[var(--text-color)]">2. Обработка</div>
              <div className="mt-2 text-[var(--text-color)]">Речь преобразуется в связный конспект.</div>
          </div>
          <div className="p-6 glass rounded-lg">
              <div className="text-xl font-semibold text-[var(--text-color)]">3. Готовый конспект</div>
              <div className="mt-2 text-[var(--text-color)]">Вы получаете красивый конспект готовый к чтению.</div>
          </div>
        </div>
      </section>
      <section id="faq" className="my-12">
          <h2 className="text-2xl font-bold text-[var(--text-color)]">FAQ про earmiss</h2>
        <div className="mt-6 space-y-4">
          <details className="p-4 glass rounded-lg">
              <summary className="font-semibold text-[var(--text-color)]">Есть ли лимиты на использование бота?</summary>
              <div className="mt-2 text-[var(--text-color)]">Нет, никаких лимитов нет. Единственное - нельзя в момент обрабатывать более 1 записи.</div>
          </details>
          <details className="p-4 glass rounded-lg">
              <summary className="font-semibold text-[var(--text-color)]">Нужно ли предварительно обрабатывать запись лекции?</summary>
              <div className="mt-2 text-[var(--text-color)]">Нет, вы можете сразу присылать аудиозапись без предварительной обработки. Лишняя информация не помешает генерации конспекта.</div>
          </details>
          <details className="p-4 glass rounded-lg">
              <summary className="font-semibold text-[var(--text-color)]">Как бот обрабатывает голосовые сообщения?</summary>
              <div className="mt-2 text-[var(--text-color)]">Мы используем несколько нейросетей для генерации конспекта.</div>
          </details>
          <details className="p-4 glass rounded-lg">
              <summary className="font-semibold text-[var(--text-color)]">Поддерживаются ли языки кроме русского?</summary>
              <div className="mt-2 text-[var(--text-color)]">Да, бот поддерживает также английский язык. В будущем планируется добавление других языков. Если у вас есть конкретные пожелания, пожалуйста, дайте нам знать: <a href="https://t.me/EarmissSupport" className="text-blue-600 font-semibold underline hover:text-blue-800">@EarmissSupport</a></div>
          </details>
          <details className="p-4 glass rounded-lg">
              <summary className="font-semibold text-[var(--text-color)]">В каком формате возвращаются конспекты?</summary>
              <div className="mt-2 text-[var(--text-color)]">Конспекты после генерации доступны на нашем сайте. Доступ к нему имеют только те, у кого есть ссылка.</div>
          </details>
        </div>
      </section>
      </main>
      <Footer />
      <img 
        src="https://mc.yandex.ru/watch/104106763" 
        style={{position:"absolute", left:"-9999px"}} 
        alt="" 
      />
    </div>
  );
}
