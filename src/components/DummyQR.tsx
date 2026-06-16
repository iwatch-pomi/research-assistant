// ダミーQRコード（画像ファイル不要のインラインSVG）。
// seed から擬似ランダムに市松模様を生成し、QRらしい見切りマーカーを四隅に描く。

interface DummyQRProps {
  seed: string;
  size?: number;
}

// 簡易な決定的ハッシュ（モック用途）
function makeCells(seed: string, n: number): boolean[][] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const rand = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 1000) / 1000;
  };
  const cells: boolean[][] = [];
  for (let r = 0; r < n; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < n; c++) row.push(rand() > 0.5);
    cells.push(row);
  }
  return cells;
}

// 四隅の位置検出パターンの範囲か
function isFinder(r: number, c: number, n: number): boolean {
  const inTopLeft = r < 7 && c < 7;
  const inTopRight = r < 7 && c >= n - 7;
  const inBottomLeft = r >= n - 7 && c < 7;
  return inTopLeft || inTopRight || inBottomLeft;
}

export default function DummyQR({ seed, size = 180 }: DummyQRProps) {
  const n = 25;
  const cells = makeCells(seed, n);
  const cell = size / n;

  const rects: React.ReactElement[] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (isFinder(r, c, n)) continue;
      if (!cells[r][c]) continue;
      rects.push(
        <rect
          key={`${r}-${c}`}
          x={c * cell}
          y={r * cell}
          width={cell}
          height={cell}
          fill="#0f172a"
        />
      );
    }
  }

  // 位置検出パターン（四隅の四角）を描く
  const finder = (x: number, y: number) => (
    <g key={`finder-${x}-${y}`}>
      <rect x={x} y={y} width={cell * 7} height={cell * 7} fill="#0f172a" />
      <rect
        x={x + cell}
        y={y + cell}
        width={cell * 5}
        height={cell * 5}
        fill="#ffffff"
      />
      <rect
        x={x + cell * 2}
        y={y + cell * 2}
        width={cell * 3}
        height={cell * 3}
        fill="#0f172a"
      />
    </g>
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="プロトコル共有用のダミーQRコード"
      className="rounded-lg bg-white"
    >
      <rect width={size} height={size} fill="#ffffff" />
      {rects}
      {finder(0, 0)}
      {finder(size - cell * 7, 0)}
      {finder(0, size - cell * 7)}
    </svg>
  );
}
