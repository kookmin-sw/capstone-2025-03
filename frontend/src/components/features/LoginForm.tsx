import { Button, Input, VStack } from "@chakra-ui/react"

export function LoginForm() {
  return (
    <VStack>
      <Input placeholder="Email" />
      <Input placeholder="Password" type="password" />
      <Button colorScheme="blue">Login</Button>
    </VStack>
  )
}