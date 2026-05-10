import os
import glob

directory = "/Users/emmanuel/Documents/Theory/Redefining_racism/podcast_prompts"
files = glob.glob(os.path.join(directory, "*.md"))

replacements = [
    ("fractal computer virus", "psychosocial fractal mind virus"),
    ("Fractal Computer Virus", "Psychosocial Fractal Mind Virus"),
    ("virus model", "mind virus model"),
    ("Virus model", "Mind virus model"),
    ("virus architecture", "mind virus architecture"),
    ("the virus was written", "the mind virus was written"),
    ("The virus was written", "The mind virus was written"),
    ("the virus replicates", "the mind virus replicates"),
    ("The virus replicates", "The mind virus replicates"),
    ("the virus stops", "the mind virus stops"),
    ("antivirus", "anti-mind-virus"),
]

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for old_str, new_str in replacements:
        new_content = new_content.replace(old_str, new_str)
        
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {os.path.basename(file_path)}")

print("Done.")
