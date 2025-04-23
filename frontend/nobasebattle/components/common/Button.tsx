import { hover, transparentForm } from "@/styles/form";

interface ButtonProps {
  text: string;
  border?: boolean;
  onClick?: () => void;
}

const Button = ({ text, border, onClick }: ButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${
        border ? "border border-1-white" : ""
      } ${transparentForm} ${hover} px-3 py-3 rounded-lg text-xl cursor-pointer`}
    >
      {text}
    </button>
  );
};

export default Button;
