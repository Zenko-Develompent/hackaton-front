import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/shared/ui/ProgressBar";

export const CourseCard = () => {
  return (
    <div className="flex gap-10 flex-col p-5 justify-center w-full transition-colors bg-primary/4 hover:bg-primary/8 rounded-[40px] cursor-pointer">
      <div className="flex justify-between">
        <div className="flex flex-col gap-3 flex-3">
          <h3 className="font-semibold text-2xl">Заголовок</h3>
          <p className="opacity-60">Примечание1</p>
          <p className="opacity-60">Примечание2</p>
        </div>
        <img
          className="flex-1 aspect-square rounded-[20px] bg-primary/4"
          src="asd"
          alt="asd"
        />
      </div>

      <div className="flex flex-col gap-4">
        {/* <ProgressBar progress={40} /> */}
        <div className="flex gap-2">
          <Button
            size="lg"
            className="flex-1 text-[16px] bg-primary/8 text-primary "
          >
            Подробнее
          </Button>
          <Button size="lg" className="flex-1 text-[16px]">
            Начать обучение
          </Button>
        </div>
      </div>
    </div>
  );
};
