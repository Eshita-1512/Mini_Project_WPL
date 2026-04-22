import os
import glob

search_text = 'const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";'
replace_text = 'const API = import.meta.env.PROD ? "" : "http://localhost:8000";'

jsx_files = glob.glob('frontend/src/**/*.jsx', recursive=True)
for file in jsx_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    if search_text in content:
        content = content.replace(search_text, replace_text)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {file}')
