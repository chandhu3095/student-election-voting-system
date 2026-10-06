export default function FlowerLoader({ label = 'Loading...' }) {
  return (
    <div className="loader-wrap">
      <div className="flower-loader">✿</div>
      <span>{label}</span>
    </div>
  )
}
