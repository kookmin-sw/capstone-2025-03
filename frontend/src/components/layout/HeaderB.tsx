import { Flex, Heading } from "@chakra-ui/react"

export function Header() {
  return (
    <Flex as="header" p={4} bg="blue.500" color="white">
      <Heading size="md">My App</Heading>
    </Flex>
  )
}
