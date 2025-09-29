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
    <div className="antialiased text-gray-800 bg-[#FFF8E7]">
      <Header />
      <main className="max-w-6xl mx-auto px-6">
        <section class="grid md:grid-cols-2 gap-10 items-center my-12 -mt-1">
        <div>
          <h1 class="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">earmiss — бесплатный бот, который превращает аудио в конспекты.</h1>
          <p class="mt-4 text-gray-700 text-lg">Telegram-бот <strong>earmiss</strong> слушает ваши голосовые сообщения и возвращает структурированный текст — будто со страниц учебника.</p>

          <div class="mt-6 flex flex-wrap gap-3">
            <a href={`https://t.me/EarmissBot?start=${utm_source}-${utm_medium}-${utm_campaign}-${utm_content}`} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-3 px-5 py-3 rounded-lg btn-telega shadow font-semibold plausible-event-name=Open+Telegram+Bot">Открыть бота в Telegram</a>
            <Link href="#how" class="px-5 py-3 rounded-lg glass border border-[rgba(255,111,97,0.8)] text-gray-800 font-semibold">Как это работает</Link>
          </div>

          <div class="mt-8 grid grid-cols-2 gap-3 text-sm text-gray-700">
            <div class="p-4 glass rounded-lg">
              <div class="font-semibold">Бесплатно</div>
              <div>earmiss бесплатный, без скрытых платежей и подписок.</div>
            </div>
            <div class="p-4 glass rounded-lg">
              <div class="font-semibold">Естественно</div>
              <div>Конспект выглядит так, будто написан человеком — без таймкодов и сухости.</div>
            </div>
            <div class="p-4 glass rounded-lg">
              <div class="font-semibold">Быстро</div>
              <div>Текст за секунды, без ручного набора.</div>
            </div>
            <div class="p-4 glass rounded-lg">
              <div class="font-semibold">Конфиденциально</div>
              <div>Ваши данные под вашим контролем: автоудаление, экспорт, хранение.</div>
            </div>
          </div>
        </div>
        <div className="relative flex justify-center">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-[rgba(255,111,97,0.8)] max-w-sm w-full">
            <div className="p-6 bg-[#FFF8E7] scroll-container">
              <div class="text-center mb-4 font-semibold text-lg accent">Пример конспекта</div>
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
        <section id="features" class="my-12">
        <h2 class="text-2xl font-bold text-gray-900">Функции earmiss</h2>
        <div class="mt-6 grid md:grid-cols-3 gap-6">
          <div class="p-6 glass rounded-lg">
            <div class="font-semibold text-lg">Автоматическое распознавание</div>
            <div class="mt-2 text-gray-700">Поддержка нескольких языков, пунктуация и структурирование текста.</div>
          </div>
          <div class="p-6 glass rounded-lg">
            <div class="font-semibold text-lg">Естественный конспект</div>
            <div class="mt-2 text-gray-700">Без сухости — текст как будто писал человек.</div>
          </div>
        </div>
      </section>
      <section id="how" class="my-12">
        <h2 class="text-2xl font-bold text-gray-900">Как работает earmiss</h2>
        <div class="mt-6 grid md:grid-cols-3 gap-6">
          <div class="p-6 glass rounded-lg">
            <div class="text-xl font-semibold">1. Отправьте голос</div>
            <div class="mt-2 text-gray-700">Бот принимает голосовые сообщения, и более 10 форматов аудиофайлов.</div>
          </div>
          <div class="p-6 glass rounded-lg">
            <div class="text-xl font-semibold">2. Обработка</div>
            <div class="mt-2 text-gray-700">Речь преобразуется в связный конспект.</div>
          </div>
          <div class="p-6 glass rounded-lg">
            <div class="text-xl font-semibold">3. Готовый конспект</div>
            <div class="mt-2 text-gray-700">Вы получаете красивый конспект готовый к чтению.</div>
          </div>
        </div>
      </section>
      <section id="faq" class="my-12">
        <h2 class="text-2xl font-bold text-gray-900">FAQ про earmiss</h2>
        <div class="mt-6 space-y-4">
          <details class="p-4 glass rounded-lg">
            <summary class="font-semibold">Есть ли лимиты на использование бота?</summary>
            <div class="mt-2 text-gray-700">Нет, никаких лимитов нет. Единственное - нельзя в момент обрабатывать более 1 записи.</div>
          </details>
          <details class="p-4 glass rounded-lg">
            <summary class="font-semibold">Нужно ли предварительно обрабатывать запись лекции?</summary>
            <div class="mt-2 text-gray-700">Нет, вы можете сразу присылать аудиозапись без предварительной обработки. Лишняя информация не помешает генерации конспекта.</div>
          </details>
          <details class="p-4 glass rounded-lg">
            <summary class="font-semibold">Как бот обрабатывает голосовые сообщения?</summary>
            <div class="mt-2 text-gray-700">Мы используем несколько нейросетей для генерации конспекта.</div>
          </details>
          <details class="p-4 glass rounded-lg">
            <summary class="font-semibold">Поддерживаются ли языки кроме русского?</summary>
            <div class="mt-2 text-gray-700">Да, бот поддерживает также поддерживает английский.</div>
          </details>
          <details class="p-4 glass rounded-lg">
            <summary class="font-semibold">В каком формате возвращаются конспекты?</summary>
            <div class="mt-2 text-gray-700">Конспекты после генерации доступны на нашем сайте. Доступ к нему имеют только те, у кого есть ссылка.</div>
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
