import { hover, transparentForm } from "@/styles/form";

interface ButtonProps {
  text: string;
  border?: boolean;
  onClick?: () => void;
  fill?: boolean;
}

const Button = ({
  text,
  border = false,
  onClick,
  fill = false,
}: ButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${border ? "border border-1-white" : ""}
      ${fill ? "w-full" : ""}
      ${transparentForm} ${hover} px-3 py-2 rounded-lg text-xl cursor-pointer`}
    >
      {text}
    </button>
  );
};

export default Button;
