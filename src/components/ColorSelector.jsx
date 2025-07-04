export default function ColorSelector({ selectedColors, onChange }) {
  const colors = ['#FFD700', '#000000', '#FFFFFF'];

  const toggleColor = (color) => {
    const updated = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];
    onChange(updated);
  };

  return (
    <div className="flex gap-2 my-2">
      {colors.map((color) => (
        <div
          key={color}
          onClick={() => toggleColor(color)}
          className={`w-6 h-6 rounded-full border-2 cursor-pointer`}
          style={{
            backgroundColor: color,
            borderColor: selectedColors.includes(color) ? 'black' : '#ccc',
          }}
        />
      ))}
    </div>
  );
}
