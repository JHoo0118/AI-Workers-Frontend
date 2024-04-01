"use client";

export default function HomeProsSection() {
  return (
    <section className="bg-gray-100 py-8 dark:bg-card sm:py-20">
      <div className="mx-auto max-w-screen-xl px-4">
        <h2 className="text-center text-2xl font-semibold md:text-3xl lg:text-4xl">
          최고의 작업 도구
        </h2>
        <p className="mt-4 text-center text-lg md:mt-6 md:text-xl">
          AI WORKERS는 웹에서 설치없이 사용할 수 있는 최고의 도구입니다.
          작업하는 데 필요한 모든 도구를 사용하고 데이터 보안과 무결성을
          유지하세요.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-lg dark:bg-black">
            {/* <BedDouble className="mb-6 h-16 w-16" /> */}
            <h3 className="mb-2 text-xl font-semibold">최고의 품질</h3>
            <p className="text-base">
              다양한 AI Agent들이 협력하여 여러분에게 최고의 작업물을
              제공합니다.
            </p>
          </div>

          <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-lg dark:bg-black">
            {/* <Wind className="mb-6 h-16 w-16" /> */}
            <h3 className="mb-2 text-xl font-semibold">쉽고 빠른 사용</h3>
            <p className="text-base">
              설치없이 쉽고 빠르게 원하는 결과를 얻을 수 있습니다.
            </p>
          </div>

          <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-lg dark:bg-black">
            {/* <Lock className="mb-6 h-16 w-16" /> */}
            <h3 className="mb-2 text-xl font-semibold">
              데이터 보안 및 무결성
            </h3>
            <p className="text-base">
              여러분의 데이터를 안전하게 처리하고, 영구적으로 보관하지 않습니다.
              자세한 사항은 데이터 프라이버시 및 보안 페이지를 확인해 주세요.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
