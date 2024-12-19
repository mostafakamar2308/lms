import { Label } from "@/components/ui/label";

export const Input: React.FC<{
  label?: string;
  optional?: boolean;
  type: HTMLInputElement["type"];
  name: string;
  placeholder: string;
  value?: string;
  id?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, optional, type, name, placeholder, id, onChange, value }) => {
  return (
    <div>
      {label ? (
        <div className="flex justify-between items-center">
          <Label htmlFor={id}>{label}</Label>
          <p>{optional ? "Optional" : null}</p>
        </div>
      ) : null}
      <input
        id={id}
        className="w-full p-1 px-2  border rounded-md mt-1 focus:outline-none"
        placeholder={placeholder}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={!optional}
      />
    </div>
  );
};
