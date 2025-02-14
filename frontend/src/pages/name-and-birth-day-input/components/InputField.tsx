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
    <Flex direction="column" width="100%">
      {value && label && (
        <Text
          color="#747477"
          fontSize="1.4rem"
          mb="0.5rem"
          pt={label === "생년월일" ? "0" : "2rem"}
        >
          {label}
        </Text>
      )}
      <Input
        height="auto"
        placeholder={placeholder}
        variant="flushed"
        color="white"
        _placeholder={{ color: "#46454a" }}
        width="100%"
        fontSize="2.2rem"
        pb="1rem"
        _focus={{ borderColor: "#00A36C" }}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
      />
    </Flex>
  );
}
