export interface Props {
  label: string
}

export default function ExportedPropsExample({ label }: Props) {
  return <p>{label}</p>
}
