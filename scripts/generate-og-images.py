#!/usr/bin/env python3
"""Generate canonical-page share cards and metadata.

Requires Pillow and PyMuPDF. Supply --font-dir containing InstrumentSans.ttf and
Newsreader.ttf, from the Google Fonts ofl/instrumentsans and ofl/newsreader
directories. Fonts are used during generation only; no browser font load is needed.
"""
import argparse
import html
from html.parser import HTMLParser
from io import BytesIO
from pathlib import Path
import re
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

from PIL import Image, ImageDraw, ImageFont
import pymupdf

ROOT = Path(__file__).resolve().parents[1]
BLUE, INK, MUTED = '#3F66D1', '#101A3A', '#565E76'
NAME = 'Bogdan Vučković'


class Head(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_head = self.in_title = False
        self.title = self.description = ''

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'head':
            self.in_head = True
        if self.in_head and tag == 'title':
            self.in_title = True
        if self.in_head and tag == 'meta' and attrs.get('name') == 'description':
            self.description = attrs.get('content', '').strip()

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        if tag == 'head':
            self.in_head = False

    def handle_data(self, data):
        if self.in_head and self.in_title:
            self.title += data


def wrap(draw, text, font, width):
    lines, current = [], ''
    for word in text.split():
        candidate = (current + ' ' + word).strip()
        if current and draw.textlength(candidate, font=font) > width:
            lines.append(current)
            current = word
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--font-dir', required=True, type=Path)
    args = parser.parse_args()
    sans = args.font_dir / 'InstrumentSans.ttf'
    serif = args.font_dir / 'Newsreader.ttf'
    small = ImageFont.truetype(str(sans), 23)
    subtitle_font = ImageFont.truetype(str(sans), 30)

    svg = (ROOT / 'assets/coin.svg').read_text().replace('currentColor', BLUE)
    with pymupdf.open(stream=svg.encode(), filetype='svg') as source:
        pdf = source.convert_to_pdf()
    with pymupdf.open(stream=pdf, filetype='pdf') as doc:
        pixmap = doc[0].get_pixmap(matrix=pymupdf.Matrix(6, 6), alpha=True)
        mark = Image.open(BytesIO(pixmap.tobytes('png'))).convert('RGBA')
    mark = mark.resize((96, 96), Image.Resampling.LANCZOS)
    output = ROOT / 'assets/og'
    output.mkdir(exist_ok=True)
    urls = ET.parse(ROOT / 'sitemap.xml').getroot().findall('.//{*}loc')
    fallback = {
        'workbench.html': 'Notes on the design, structure and decisions behind this website.',
        'archive.html': 'Earlier design directions and identity studies for this website.',
    }
    for entry in urls:
        url = entry.text
        route = urlparse(url).path
        file = route.lstrip('/') + ('index.html' if route.endswith('/') else '')
        path = ROOT / file
        source = path.read_text()
        head = Head()
        head.feed(source)
        description = head.description or fallback[file]
        title = head.title
        display = title.removesuffix(' · ' + NAME)
        if file == 'index.html':
            display, subtitle = NAME, 'Webflow Developer'
        else:
            subtitle = 'Notes' if route.startswith('/notes/') else 'Digital Atlas' if route.startswith('/atlas/') else NAME
        image = Image.new('RGB', (1200, 630), '#FFFFFF')
        draw = ImageDraw.Draw(image)
        draw.text((72, 65), NAME, fill=INK, font=small)
        image.paste(mark, (1032, 44), mark)
        font = ImageFont.truetype(str(serif), 82)
        lines = wrap(draw, display, font, 1056)
        if len(lines) > 3:
            font = ImageFont.truetype(str(serif), 70)
            lines = wrap(draw, display, font, 1056)
        assert len(lines) <= 3, file
        top = 205 if len(lines) == 1 else 166 if len(lines) == 2 else 142
        for index, line in enumerate(lines):
            assert draw.textlength(line, font=font) <= 1056, file
            draw.text((72, top + index * 90), line, fill=INK, font=font)
        if subtitle != display:
            draw.text((72, top + len(lines) * 90 + 14), subtitle, fill=BLUE, font=subtitle_font)
        draw.line((72, 522, 1128, 522), fill='#D7E4F7', width=2)
        draw.text((72, 550), 'bogdanvuckovic.com', fill=MUTED, font=small)
        slug = 'home' if file == 'index.html' else file.removesuffix('.html').replace('/', '-')
        image_path = output / (slug + '.png')
        image.save(image_path, optimize=True)
        image_url = 'https://bogdanvuckovic.com/assets/og/' + image_path.name
        alt = f'{display}. Blue compass with a red tip on a white background.'
        metadata = {
            'og:site_name': NAME,
            'og:title': title,
            'og:description': description,
            'og:type': 'article' if route.startswith('/notes/') and file != 'notes/index.html' else 'website',
            'og:url': url,
            'og:image': image_url,
            'og:image:type': 'image/png',
            'og:image:width': '1200',
            'og:image:height': '630',
            'og:image:alt': alt,
        }
        block = ['<!-- social sharing -->']
        for key, value in metadata.items():
            block.append(f'<meta property="{key}" content="{html.escape(value, quote=True)}">')
        for key, value in {
            'twitter:card': 'summary_large_image',
            'twitter:title': title,
            'twitter:description': description,
            'twitter:image': image_url,
            'twitter:image:alt': alt,
        }.items():
            block.append(f'<meta name="{key}" content="{html.escape(value, quote=True)}">')
        block.append('<!-- end social sharing -->')
        sharing = '\n'.join(block)
        if '<!-- social sharing -->' in source:
            source = re.sub(r'<!-- social sharing -->.*?<!-- end social sharing -->', lambda _: sharing, source, flags=re.S)
        else:
            assert '</head>' in source, file
            source = source.replace('</head>', '\n' + sharing + '\n</head>', 1)
        path.write_text(source)
        print(file, '->', image_path.relative_to(ROOT))


if __name__ == '__main__':
    main()
