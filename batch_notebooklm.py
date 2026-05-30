#!/usr/bin/env python3
"""Batch script to create NotebookLM notebooks and podcasts for all chapters."""

import subprocess
import json
import time
import os
import sys

CHAPTERS = [
    # (pdf_file, notebook_title, focus_prompt)
    ("ch02_version_1_0.pdf", "The Original Power — Ep 2: Version 1.0 (Ch 2)",
     "Cover Chapter 2 clinically. Trace the compilation of the racial vector in 15th-century Portugal: the Elite's labor-shortage dilemma, the vector equation of racism, the invention of race as moral exclusion via Zurara, the kidnapping operations, the original implicit contract and psychological wage, the Roman control case, and the export to America. Avoid color-coded morality and admiration for Elite strategy."),
    
    ("ch03_bacons_rebellion.pdf", "The Original Power — Ep 3: Bacon's Rebellion (Ch 3)",
     "Cover Chapter 3 clinically. Document the 1676 system crash: cross-racial solidarity burning Jamestown, the pre-compilation patches (1640-1691), the explicit codification of whiteness in 1705, formalizing the Buffer Class, the Johnson Theorem, Constitutional bugs as features, Dred Scott, and the Haitian catalyst. Avoid color-coded morality."),
    
    ("ch04_haitian_export.pdf", "The Original Power — Ep 4: Haitian Export (Ch 4)",
     "Cover Chapter 4 clinically. Analyze the Haitian Revolution as the only successful large-scale termination of the extraction engine: the consumptive extraction function, inverse contagion and inoculation program, Pétion's conditional material support, vexillological export, Bolívar's betrayal and the complicity trap, the fractal partition within the revolution, and the Congress of Panama exclusion."),
    
    ("ch05_architecture_of_kinship.pdf", "The Original Power — Ep 5: Architecture of Kinship (Ch 5)",
     "Cover Chapter 5 clinically. Document pre-colonial West African kinship as structural immunity: Igbo patrilineality and woman-to-woman marriage, Yoruba dual-sex governance and the Iyalode, Akan matrilineality and the Ohemaa, the demographic cataclysm of the slave trade, the arms-for-slaves feedback loop, and the colonial overwrite imposing patriarchal kernels."),
    
    ("ch06_gendered_axis.pdf", "The Original Power — Ep 6-7: Gendered Axis (Ch 6)",
     "Cover Chapter 6 clinically. Trace the gendered axis of extraction: coverture and reproductive extraction, the breeding apparatus and Partus Sequitur Ventrem, post-mortem extraction, the medical extraction laboratory (Sims, Tuskegee), the racialized and masculine primal wounds, the structural immunity thesis, and the nuclear family as extraction-optimized unit. Tone: diagnostic, precise."),
    
    ("ch07_enforcement_engine.pdf", "The Original Power — Ep 8: Enforcement Engine (Ch 7)",
     "Cover Chapter 7 clinically. Analyze the Enforcement Engine: slave patrols as capital management, the 13th Amendment loophole, the Interface Swap, judicial entrenchment, the compounding model, the unbroken financial lineage from slave mortgages to carceral bonds, the triple conversion, and imperial enforcement. Avoid admiration for Elite strategy."),
    
    ("ch08_containment.pdf", "The Original Power — Ep 9: Containment (Ch 8)",
     "Cover Chapter 8 clinically. Document spatial containment: the Pullman Strike and psychological wage breaking class solidarity, redlining as the containment field, the German extraction algorithm as colonial laboratory, the compiler-sharing thesis, and the geopolitical 1.1 patch. Frame as structural optimization, not moral failure."),
    
    ("ch09_german_extraction.pdf", "The Original Power — Ep 10: German Extraction (Ch 9)",
     "Cover Chapter 9 clinically. Analyze the German extraction algorithm 1904-1945: Namibia as proving ground, the research pipeline to Mengele, Weimar system error, the psychological wage in the German kernel, buffer consumption as fatal recursion, the Holocaust as demographic engineering, and comparative architecture with the American kernel."),
    
    ("ch10_geopolitical_patch.pdf", "The Original Power — Ep 11: Geopolitical Patch (Ch 10)",
     "Cover Chapter 10 clinically. Trace the geopolitical 1.1 patch from 1948: shadow capital networks, Operation Underworld, the Lansky-Siegel-Greenspun pipeline, the Sonneborn Institute, the modern impunity exploit, network topology and power-law obscuration, and the UN assessment frame. Tone: diagnostic, structural."),
    
    ("ch11_biological_extraction.pdf", "The Original Power — Ep 12: Biological Extraction (Ch 11)",
     "Cover Chapter 11 clinically. Document environmental racism as systemic toxicity: the lead-crime literature, the property-tax lead prison feedback loop, school water as toxicant delivery, atmospheric and housing exposure disparities, and contemporary consumer product toxicity vectors. Frame as engineered biological extraction."),
    
    ("ch12_tweedism.pdf", "The Original Power — Ep 13: Tweedism & Puppet Class (Ch 12)",
     "Cover Chapter 12 clinically. Analyze the algorithmic filter on democracy: the Green Primary and capital as pre-selector, white primaries as racial prototype, the interference engine canceling class solidarity, the Gilens-Page study, the agenda-setter trap, and conditional mobility anomalies. Avoid color-coded morality."),
    
    ("ch13_recompile.pdf", "The Original Power — Ep 14: Recompile (Ch 13)",
     "Cover Chapter 13 clinically. Document the recompile of 1968-1994: COINTELPRO as counterinsurgency, the Ghetto Informant Program, the Variable Swap to the War on Drugs, epistemic hypocrisy and Patent 6,630,507, the manufactured crisis of environmental poisoning and deindustrialization, the 1994 Crime Bill, and the great crime decline as diagnostic proof."),
    
    ("ch14_full_algorithm.pdf", "The Original Power — Ep 15: Full Algorithm (Ch 14)",
     "Cover Chapter 14 clinically. Trace the terminal runtime 1994-present: the demographic paradox, cannibalization of the Buffer Class, the immigration safety valve, black family dissolution as five-tier execution, the modern security patch and spatial proxy, the Pipeline Architecture from school-to-prison to healthcare denial, and the full reveal of the complete hierarchy."),
    
    ("ch15_kinetic_guarantee.pdf", "The Original Power — Ep 16: Kinetic Guarantee (Ch 15)",
     "Cover Chapter 15 clinically. Analyze arms asymmetry and the Second Amendment: firearms creating the African diaspora, the constitutional encoding as kinetic guarantee, the federal disarmament timeline from Sullivan Act to Bruen, the Mulford Proof, mental gun control as psychological proxy, and the Haitian Revolution as ultimate historical proof."),
    
    ("ch16_contradiction.pdf", "The Original Power — Ep 17: Contradiction (Ch 16)",
     "Cover Chapter 16 clinically. Prove why reform serves the algorithm: the Reform Paradox, the Concession Theorem with historical proof, the Acemoglu Limit, the Constitutional Shield and intent standard, the Atwater Proof, judicial double-agent architecture, the grandfather clause as pacification, and the Haitian Theorem."),
    
    ("ch17_global_containment.pdf", "The Original Power — Ep 18: Global Containment (Ch 17)",
     "Cover Chapter 17 clinically. Scale the algorithm globally: the international 5-tier hierarchy, the Congo Free State, British India, the peripheral revolt paradox (Haiti, Cuba, Burkina Faso), the UN reparations vote, the Imperial Core Theorem, global durability objections, and the polymorphic interface swap typology."),
    
    ("ch18_algorithmic_epoch.pdf", "The Original Power — Ep 19: Algorithmic Epoch (Ch 18)",
     "Cover Chapter 18 clinically. Port the legacy code to AI: real-time dynamic equilibrium, orthogonal vector injection, the Puppet Class as decoy vertex, physical DDoS and kinetic parity, the terminal interface swap and automation timeline, the agnostic swarm and botnet protocol, the Zugzwang Paradox, defection cascade, and the Counter-AI Imperative."),
    
    ("ch19_spectral_carrier.pdf", "The Original Power — Ep 20: Spectral Carrier (Ch 19)",
     "Cover Chapter 19 clinically. Present the empirical spectral analysis: the 4-year electoral carrier, cross-spectral coherence, the Senate and two-term cycles, the missing 2-year signal, and the spectral carrier as empirical proof of the interference engine. Frame as precision-forcing diagnostic."),
    
    ("ch20_post_kinetic.pdf", "The Original Power — Ep 21: Post-Kinetic Horizon (Ch 20)",
     "Cover Chapter 20 clinically. Outline the Open-Source Republic: the systematic reset and amendment paradox, abolition democracy, recompiling federal agencies, algorithmic legislation with sunset clauses, dismantling the Tweedism filter, and the perpetual battle for solidarity."),
    
    ("ch21_boston.pdf", "The Original Power — Ep 22: Boston Case Study (Ch 21)",
     "Cover Chapter 21 clinically. Analyze the Boston HD 4420 rally as live case study: the single-issue trap, multi-axis noise cancellation, the blue trainer AR-15 and racial prior, grandfather clauses forcing the state's hand, and geographic interface swaps."),
    
    ("ch22_conclusion.pdf", "The Original Power — Ep 23: Conclusion (Ch 22)",
     "Cover the Conclusion clinically. Synthesize the terminal findings: the Predatory Min-Max Function's five-century runtime, the vector-valued definition of racism, the framework's falsifiability conditions, and the perpetual battle. Frame as diagnostic summary, not motivational closing."),
]

def run_cmd(cmd, timeout=300):
    """Run a shell command and return (success, output)."""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout)
        return result.returncode == 0, result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        return False, "Timeout"

def create_notebook(title):
    """Create a notebook and return its ID."""
    success, output = run_cmd(f'nlm notebook create "{title}"')
    if not success:
        print(f"  FAILED to create notebook: {output}")
        return None
    # Parse ID from output
    for line in output.splitlines():
        if "ID:" in line:
            return line.split("ID:")[1].strip()
    return None

def upload_source(notebook_id, pdf_path):
    """Upload a PDF source to a notebook."""
    cmd = f'nlm source add {notebook_id} --file {pdf_path} --wait --wait-timeout 600'
    success, output = run_cmd(cmd, timeout=300)
    if not success:
        print(f"  FAILED to upload: {output}")
        return False
    return True

def generate_podcast(notebook_id, focus_prompt):
    """Generate a long deep-dive podcast."""
    # Escape quotes in focus prompt for shell
    safe_focus = focus_prompt.replace('"', '\\"')
    cmd = f'nlm audio create {notebook_id} --format deep_dive --length long --focus "{safe_focus}" --confirm'
    success, output = run_cmd(cmd, timeout=300)
    if not success:
        print(f"  FAILED to generate podcast: {output}")
        return False
    return True

def enable_sharing(notebook_id):
    """Enable public sharing for a notebook."""
    success, output = run_cmd(f'nlm share public {notebook_id}')
    return success

def main():
    os.chdir('/Users/emmanuel/Documents/Theory/Redefining_racism')
    
    results = []
    total = len(CHAPTERS)
    
    for i, (pdf_file, title, focus) in enumerate(CHAPTERS, 1):
        pdf_path = f"chapters/{pdf_file}"
        print(f"\n[{i}/{total}] Processing: {title}")
        
        # Create notebook
        print(f"  Creating notebook...")
        notebook_id = create_notebook(title)
        if not notebook_id:
            results.append({"title": title, "status": "failed", "step": "create"})
            continue
        print(f"  -> ID: {notebook_id}")
        
        # Upload source
        print(f"  Uploading {pdf_file}...")
        if not upload_source(notebook_id, pdf_path):
            results.append({"title": title, "status": "failed", "step": "upload", "id": notebook_id})
            continue
        
        # Generate podcast
        print(f"  Generating podcast...")
        if not generate_podcast(notebook_id, focus):
            results.append({"title": title, "status": "failed", "step": "podcast", "id": notebook_id})
            continue
        
        # Enable sharing
        print(f"  Enabling public share...")
        enable_sharing(notebook_id)
        
        results.append({"title": title, "status": "success", "id": notebook_id})
        print(f"  ✓ Complete: {title}")
        
        # Delay to avoid rate limiting
        if i < total:
            print(f"  Waiting 15s before next chapter...")
            time.sleep(15)
    
    # Save results
    with open("outputs/notebooklm_batch_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n\nBatch complete. Results saved to outputs/notebooklm_batch_results.json")
    success_count = sum(1 for r in results if r["status"] == "success")
    print(f"Success: {success_count}/{total}")

if __name__ == "__main__":
    main()
