import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { sanitizeGame, type GameState } from '../game-engine/progression';
export default function ProgressTools({ game, onImport }: { game: GameState; onImport: (game: GameState) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [message,setMessage] = useState('');
  function download() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(game,null,2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'fraction-lab-progress.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url),1000); setMessage('Резервното копие е изтеглено.');
  }
  async function upload(file?: File) {
    if (!file) return;
    if (file.size > 1000000) { setMessage('Файлът е твърде голям. Избери резервно копие на Fraction Lab до 1 MB.'); return; }
    try {
      const imported = sanitizeGame(JSON.parse(await file.text()));
      onImport(imported); setMessage('Напредъкът е възстановен от резервното копие.');
    } catch { setMessage('Файлът не е валидно резервно копие. Текущият напредък е запазен.'); }
    if (input.current) input.current.value = '';
  }
  return <div className="backup-panel"><h2>Запази откритията</h2><p>Данните се пазят в този браузър. Изтегли копие, за да ги преместиш на друго устройство. Възстановяването заменя текущия напредък.</p><div><button className="button" onClick={download}><Download size={17}/>Изтегли напредъка</button><button className="secondary-button" onClick={() => input.current?.click()}><Upload size={17}/>Възстанови от файл</button><input ref={input} type="file" accept="application/json,.json" aria-label="Резервно копие на напредъка" className="visually-hidden" onChange={e => void upload(e.target.files?.[0])}/></div>{message && <p role="status">{message}</p>}</div>;
}
