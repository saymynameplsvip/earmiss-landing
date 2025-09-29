import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Privacy() {
  return (
    <div className="bg-[#FFF8E7] antialiased text-gray-800">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <section class="mb-12">
          <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">Политика конфиденциальности</h1>
          <p class="mb-4 text-gray-700">В <span class="accent font-semibold">earmiss</span> мы заботимся о вашей конфиденциальности и безопасности данных. Ниже подробно описано, что мы сохраняем и как обрабатываем информацию.</p>
        </section>
        <section class="p-4 glass rounded-lg mb-6">
          <h2 class="text-2xl font-semibold text-gray mb-4">Что мы сохраняем</h2>
          <p class="text-gray-700">Единственное, что мы сохраняем — это <strong>сгенерированные конспекты</strong>, созданные на основе ваших аудиозаписей. Эти конспекты используются исключительно для предоставления вам сервиса.</p>
        </section>

        <section class="p-4 glass rounded-lg mb-6">
          <h2 class="text-2xl font-semibold text-gray mb-4">Использование данных</h2>
          <p class="text-gray-700">Сгенерированные конспекты не передаются третьим лицам и используются только для того, чтобы вы могли просматривать и экспортировать текст.</p>
        </section>

        <section class="p-4 glass rounded-lg mb-6">
          <h2 class="text-2xl font-semibold text-gray mb-4">Контакты</h2>
          <p class="text-gray-700">Если у вас есть вопросы о политике конфиденциальности, напишите нам через <a href="https://t.me/EarmissBot" rel="noopener noreferrer" target="_blank">Telegram</a>.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
