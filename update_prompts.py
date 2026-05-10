import os
import glob
import re

directory = "/Users/emmanuel/Documents/Theory/Redefining_racism/podcast_prompts"
files = glob.glob(os.path.join(directory, "*.md"))

# Map of exact string replacements to fix the numbering shift safely
replacements = [
    ("18-episode", "21-episode"),
    ("Episodes 14–17", "Episodes 15–20"),
    ("Eps 14–18", "Eps 15–21"),
    ("Eps 9–13", "Eps 10–14"),
    ("Eps 4–8", "Eps 5–9"),
    ("Episodes 4–8", "Episodes 5–9"),
    ("Episodes 9–13", "Episodes 10–14"),
    ("Episodes 14–18", "Episodes 15–21"),
    ("Episode 18", "Episode 21"),
    ("Episode 17", "Episode 18"),
    ("Episode 16", "Episode 17"),
    ("Episode 15", "Episode 16"),
    ("Episode 14", "Episode 15"),
    ("Episode 13", "Episode 14"),
    ("Episode 12", "Episode 13"),
    ("Episode 11", "Episode 12"),
    ("Episode 10", "Episode 11"),
    ("Episode 9", "Episode 10"),
    ("Episode 8", "Episode 9"),
    ("Episode 7", "Episode 8"),
    ("Episode 6", "Episode 7"),
    ("Episode 5", "Episode 6"),
    ("Episode 4", "Episode 5"),
    ("Ep 18", "Ep 21"),
    ("Ep 17", "Ep 18"),
    ("Ep 16", "Ep 17"),
    ("Ep 15", "Ep 16"),
    ("Ep 14", "Ep 15"),
    ("Ep 13", "Ep 14"),
    ("Ep 12", "Ep 13"),
    ("Ep 11", "Ep 12"),
    ("Ep 10", "Ep 11"),
    ("Ep 9", "Ep 10"),
    ("Ep 8", "Ep 9"),
    ("Ep 7", "Ep 8"),
    ("Ep 6", "Ep 7"),
    ("Ep 5", "Ep 6"),
    ("Ep 4", "Ep 5"),
    ("Episode_04_Kinship", "Episode_05_Kinship"),
    ("Episode_05_Gendered_Axis_Part1", "Episode_06_Gendered_Axis_Part1"),
    ("Episode_06_Gendered_Axis_Part2", "Episode_07_Gendered_Axis_Part2"),
    ("Episode_07_Enforcement_Engine", "Episode_08_Enforcement_Engine"),
    ("Episode_08_Compounding_Chain", "Episode_09_Compounding_Chain"),
    ("Episode_09_Containment_Field", "Episode_10_Containment_Field"),
    ("Episode_10_Puppet_Show", "Episode_11_Puppet_Show"),
    ("Episode_11_COINTELPRO", "Episode_12_COINTELPRO"),
    ("Episode_12_Manufactured_Crisis", "Episode_13_Manufactured_Crisis"),
    ("Episode_13_Disarmament_Timeline", "Episode_14_Disarmament_Timeline"),
    ("Episode_14_Gaslighting", "Episode_15_Gaslighting"),
    ("Episode_15_The_Contradiction", "Episode_16_The_Contradiction"),
    ("Episode_16_Global_Machine", "Episode_17_Global_Machine"),
    ("Episode_17_Algorithmic_Epoch", "Episode_18_Algorithmic_Epoch"),
    ("Episode_18_Conclusion", "Episode_21_Conclusion")
]

for file_path in files:
    # Skip the brand new ones that were created with correct references
    if "Episode_04_The_Haitian_Export" in file_path or "Episode_19" in file_path or "Episode_20" in file_path:
        continue
        
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    new_content = content
    for old, new in replacements:
        new_content = new_content.replace(old, new)
        
    # specific fixes for headers
    filename = os.path.basename(file_path)
    match = re.match(r"Episode_(\d+)(.*)", filename)
    if match:
        ep_num = int(match.group(1))
        # Ensure the header is correct
        new_content = re.sub(r"# The Open Source Republic — Episode \d+", f"# The Open Source Republic — Episode {ep_num}", new_content)
        new_content = re.sub(r"This audio generation is \*\*Episode \d+\*\*", f"This audio generation is **Episode {ep_num}**", new_content)
        new_content = re.sub(r"This is \*\*Episode \d+\*\*", f"This is **Episode {ep_num}**", new_content)

    # Content Integration: The Delectable Negro in Episode 07
    if "Episode_07_Gendered_Axis_Part2" in file_path and "Delectable Negro" not in new_content:
        new_content = new_content.replace(
            "`libidinal_extraction.exe` in-vivo subroutine (Master Epicure aesthetic",
            "`libidinal_extraction.exe` in-vivo subroutine (Vincent Woodard's *The Delectable Negro*, African cannibalism counter-archives mapped to $P_{\\text{gaslight}}$, Master Epicure aesthetic"
        )
        
    # Content Integration: Cannibalization Phase-Transition in Episode 13
    if "Episode_13_Manufactured_Crisis" in file_path and "Cannibalization Phase-Transition" not in new_content:
        new_content = new_content.replace(
            "cannibalization of the white working class",
            "cannibalization of the white working class (the Cannibalization Phase-Transition diagram)"
        )
        
    # Content Integration: General Critiques and Haitian Cross-Reference in Episode 16
    if "Episode_16_The_Contradiction" in file_path and "General Theoretical Critiques" not in new_content:
        new_content = new_content.replace(
            "the Haitian Theorem.",
            "the Haitian Theorem (cross-referencing the historical Haitian Export covered in Episode 4).\n\nAdditionally, explicitly address **General Theoretical Critiques** of the framework (such as mathematical rigidity or ideological bias). Address these critiques structurally and demonstrate how the framework's theorems absorb them."
        )

    # Content Integration: Full Arc in Episode 21
    if "Episode_21_Conclusion" in file_path and "Haitian Export" not in new_content:
        new_content = new_content.replace(
            "Bacon's Rebellion (Episode 3) where",
            "Bacon's Rebellion (Episode 3) where the Buffer Class was invented, the Haitian Export (Episode 4) where the revolution was weaponized outward, the Kinship overwrite (Episode 5) where"
        )
        new_content = new_content.replace(
            "the Counter-AI Imperative specified",
            "the Counter-AI Imperative specified, the Post-Kinetic Horizon (Episode 19) where the open-source republic protocol was outlined, and the Boston Case Study (Episode 20) where multi-axis noise cancellation was proven"
        )

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)

print("Batch prompt updates complete.")
