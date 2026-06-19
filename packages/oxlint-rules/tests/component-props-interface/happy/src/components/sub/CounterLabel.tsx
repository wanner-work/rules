interface Props {
  count: number
}

export default function CounterLabel({ count }: Props) {
  return <p>{count}</p>
}
