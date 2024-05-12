export default function ChromaCircle() {
  const slices = [];
  const radius = 150;
  const centerX = 150;
  const centerY = 150;
  const sliceAngle = (2 * Math.PI) / 11; // Angle for each slice

  // Generating slice paths
  for (let i = 0; i < 11; i++) {
    const startAngle = i * sliceAngle;
    const endAngle = (i + 1) * sliceAngle;

    const startX = centerX + radius * Math.cos(startAngle);
    const startY = centerY + radius * Math.sin(startAngle);
    const endX = centerX + radius * Math.cos(endAngle);
    const endY = centerY + radius * Math.sin(endAngle);

    const pathData = `M${centerX},${centerY} L${startX},${startY} A${radius},${radius} 0 0,1 ${endX},${endY} Z`;

    slices.push(<path key={i} d={pathData} fill={`hsl(${(i * 360) / 11}, 50%, 50%)`} />);
  }

  return (
    <svg width="300" height="300">
      {slices}
    </svg>
  );
}
