import os
from pathlib import Path
import argparse


def format_file_name(file_name):
    return os.path.splitext(file_name)[0].replace('_', ' ')


def generate_html(svg_folder, output_file):
    svg_files = [
        f for f in os.listdir(svg_folder) if f.lower().endswith('.svg')
    ]

    html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SVG Gallery</title>
    <style>
        .gallery {{
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
        }}
        .svg-container {{
            width: 10%;
            padding: 5px;
            box-sizing: border-box;
            text-align: center;
        }}
        .svg-container svg {{
            width: 100%;
            height: auto;
        }}
        .svg-name {{
            margin-top: 3px;
            font-family: Arial, sans-serif;
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }}
    </style>
</head>
<body>
    <div class="gallery">
"""

    for i, svg_file in enumerate(svg_files):
        with open(os.path.join(svg_folder, svg_file), 'r') as f:
            svg_content = f.read()

        svg_name = format_file_name(svg_file)

        html_content += f"""
        <div class="svg-container">
            {svg_content}
            <div class="svg-name" title="{svg_name}">{svg_name}</div>
        </div>"""

        if (i + 1) % 10 == 0:
            html_content += "\n"

    html_content += """
    </div>
</body>
</html>
"""

    with open(output_file, 'w') as f:
        f.write(html_content)

# python generate_viewing_page_embedded_labeled.py all_emojis/ all_emojis_labeled.html
def main():
    parser = argparse.ArgumentParser(
        description='Generate an HTML gallery from a folder of SVGs.')
    parser.add_argument('svg_folder',
                        type=str,
                        help='Path to the folder containing SVG files')
    parser.add_argument('output_file',
                        type=str,
                        help='Path to the output HTML file')

    args = parser.parse_args()

    svg_folder = Path(args.svg_folder)
    output_file = Path(args.output_file)

    if not svg_folder.is_dir():
        print(f"Error: {svg_folder} is not a valid directory.")
        return

    generate_html(svg_folder, output_file)
    print(f"HTML gallery generated: {output_file}")


if __name__ == "__main__":
    main()
