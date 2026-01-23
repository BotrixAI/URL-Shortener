import Image from "next/image";

type Props = {
  img: any;
  desc: string;
};

const RightCard = ({ img, desc }: Props) => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col-reverse lg:flex-row justify-center items-center w-5/6 md:w-3/4 gap-6">
        
        <div>
          <p className="text-small text-justify dark:text-primary-color">
            {desc}
          </p>
        </div>

        <div className="relative w-72 md:w-96 h-36">
          <Image
            src={img}
            alt="Feature illustration"
            fill
            className="object-contain"
            priority
          />
        </div>

      </div>
    </div>
  );
};

export default RightCard;
