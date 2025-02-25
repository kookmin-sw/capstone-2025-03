import styles from "./InputField.module.css";
import { Input, Text, Flex } from "@chakra-ui/react";

interface InputFieldProps {
  label?: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
}

export default function InputField({
  label,
  placeholder,
  value,
  onChange,
  maxLength,
}: InputFieldProps) {
  return (
    <div className={styles.container}>
      {value && label && (
        <p
          className={`${styles.label} ${
            label !== "생년월일" ? styles.labelWithPadding : ""
          }`}
        >
          {label}
        </p>
      )}
      <Input
        className={styles.input}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
      />
    </div>
  );
}
