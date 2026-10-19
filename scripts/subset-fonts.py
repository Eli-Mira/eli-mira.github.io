"""Regenerate the English-only WOFF2 assets; requires fonttools and brotli."""
from hashlib import sha256
import json
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
FONTS = ROOT / 'src/assets/fonts'
manifest = []
for name in ('display', 'body', 'mono', 'impact'):
    options = subset.Options()
    options.flavor = 'woff2'
    options.layout_features = ['*']
    options.notdef_outline = True
    font = subset.load_font(str(FONTS / f'{name}.ttf'), options)
    selection = subset.Subsetter(options=options)
    # shortcut: English/Latin content only; expand the subset before adding other languages.
    selection.populate(text='ELI') if name == 'impact' else selection.populate(unicodes=list(range(0x100)) + list(range(0x2000, 0x2070)))
    selection.subset(font)
    if name == 'mono':
        # Plex is a reserved font name; a modified font needs a different primary name.
        for record in font['name'].names:
            if record.nameID in (1, 3, 4, 6, 16, 18):
                value = 'RedlineMono-Regular' if record.nameID in (3, 6) else 'Redline Mono'
                font['name'].setName(value, record.nameID, record.platformID, record.platEncID, record.langID)
    target = FONTS / f'{name}.woff2'
    subset.save_font(font, str(target), options)
    result = TTFont(target)
    assert result.flavor == 'woff2'
    if name == 'impact':
        assert set(map(ord, 'ELI')).issubset(result.getBestCmap())
    else:
        assert set(range(0x20, 0x7f)).issubset(result.getBestCmap())
    if name == 'mono':
        assert all('Plex' not in record.toUnicode() for record in result['name'].names if record.nameID in (1, 4, 6, 16))
    manifest.append({'file': target.name, 'sourceBytes': (FONTS / f'{name}.ttf').stat().st_size, 'woff2Bytes': target.stat().st_size, 'sha256': sha256(target.read_bytes()).hexdigest()})
assert sum(item['woff2Bytes'] for item in manifest) < 100_000
(ROOT / 'docs/font-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'fonts': manifest, 'totalWoff2Bytes': sum(item['woff2Bytes'] for item in manifest)}, indent=2))
