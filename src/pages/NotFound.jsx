import { navigate } from '../router/hashRouter.js';

export default function NotFound({
  title = 'Page not found',
  message = "We couldn't find the page you were looking for. Explore our clean botanical skincare collection instead.",
}) {
  return (
    <div className="max-w-[1320px] mx-auto px-5 md:px-8 lg:px-12 py-16 md:py-24">
      <div className="max-w-lg mx-auto bg-white rounded-[24px] border border-[#8FA391]/20 p-8 md:p-10 text-center space-y-4">
        <p className="font-serif italic text-[18px] text-[#5C665E]">
          Bare &amp; Bloom By Robaha
        </p>
        <h1 className="font-serif text-[32px] leading-[40px] font-normal text-[#232924]">
          {title}
        </h1>
        <p className="text-[15px] leading-[24px] text-[#5C665E]">
          {message}
        </p>
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#/shop"
            onClick={(e) => {
              e.preventDefault();
              navigate('#/shop');
            }}
            className="w-full sm:w-auto rounded-full bg-[#2D3830] hover:bg-[#3D4C41] text-white text-[14px] font-semibold px-7 py-3.5 min-h-[48px] inline-flex items-center justify-center transition-colors"
          >
            Browse The Collection
          </a>
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              navigate('#/');
            }}
            className="w-full sm:w-auto rounded-full border-[1.5px] border-[#2D3830] bg-transparent hover:bg-[#DCE4DC] text-[#232924] text-[14px] font-semibold px-7 py-3.5 min-h-[48px] inline-flex items-center justify-center transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
