interface Props {
  title: string;
  description: string;
};

export const Heading = ({ title, description }: Props) => {
  return (
    <div>
      <h3 className="text-3xl font-bold md:text-4xl">
        {title}
      </h3>
      <p className="text-sm text-neutral-500 md:text-base">
        {description}
      </p>
    </div>
  );
};
