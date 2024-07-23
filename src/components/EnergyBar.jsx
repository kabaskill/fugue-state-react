import { playerState } from "../data/gameState";

const getGradientColor = (energy, maxEnergy) => {
  const percentage = (energy / maxEnergy) * 100;
  if (percentage >= 66) return "bg-green-500";
  if (percentage >= 33) return "bg-yellow-500";
  return "bg-red-500";
};

export default function EnergyBar() {
  const { energy, maxEnergy } = playerState.value;

  const fillWidth = (energy / maxEnergy) * 100;
  const gradientColor = getGradientColor(energy, maxEnergy);

  return (
    <div className="w-full p-4">
      <div className="w-full bg-gray-300 rounded-full overflow-hidden">
        <div
          className={`h-4 transition-width duration-300 ${gradientColor}`}
          style={{ width: `${fillWidth}%` }}
        />
      </div>
      <p className="text-white font-bold text-2xl text-center mt-2">
        Energy:
        <br /> {energy} / {maxEnergy}
      </p>
    </div>
  );
}
