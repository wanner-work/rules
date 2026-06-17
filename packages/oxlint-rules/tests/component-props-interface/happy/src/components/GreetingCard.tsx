interface Props {
  name: string
}

export default function GreetingCard({ name }: Props) {
  return <h1>{name}</h1>
}
