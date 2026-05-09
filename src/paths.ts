/** Шляхи до файлів у public/ для GitHub Pages (репозиторій /teamweb/) */
export function withBase(relPath: string): string {
  const p = relPath.replace(/^\//, '');
  return `${import.meta.env.BASE_URL}${p}`;
}
