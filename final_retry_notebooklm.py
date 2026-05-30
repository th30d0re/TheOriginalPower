#!/usr/bin/env python3
"""Final retry with extended cooldown."""
import subprocess
import time

RETRIES = [
    ("c5a66b49-2e7e-4b0d-b2ef-202e866f4461", "Cover Chapter 16 clinically. Prove why reform serves the algorithm: the Reform Paradox, the Concession Theorem with historical proof, the Acemoglu Limit, the Constitutional Shield and intent standard, the Atwater Proof, judicial double-agent architecture, the grandfather clause as pacification, and the Haitian Theorem."),
    ("e3176557-595c-4c9c-915e-3eca7f10ce1b", "Cover Chapter 17 clinically. Scale the algorithm globally: the international 5-tier hierarchy, the Congo Free State, British India, the peripheral revolt paradox (Haiti, Cuba, Burkina Faso), the UN reparations vote, the Imperial Core Theorem, global durability objections, and the polymorphic interface swap typology."),
    ("b311e9d3-daf4-4911-9186-a736714195b1", "Cover Chapter 18 clinically. Port the legacy code to AI: real-time dynamic equilibrium, orthogonal vector injection, the Puppet Class as decoy vertex, physical DDoS and kinetic parity, the terminal interface swap and automation timeline, the agnostic swarm and botnet protocol, the Zugzwang Paradox, defection cascade, and the Counter-AI Imperative."),
    ("ce96cdb1-1f62-4f54-ab7c-4750bcaaf9fb", "Cover Chapter 19 clinically. Present the empirical spectral analysis: the 4-year electoral carrier, cross-spectral coherence, the Senate and two-term cycles, the missing 2-year signal, and the spectral carrier as empirical proof of the interference engine. Frame as precision-forcing diagnostic."),
    ("88b78f72-9438-4729-b867-1af10af072d6", "Cover Chapter 20 clinically. Outline the Open-Source Republic: the systematic reset and amendment paradox, abolition democracy, recompiling federal agencies, algorithmic legislation with sunset clauses, dismantling the Tweedism filter, and the perpetual battle for solidarity."),
    ("c8c7ebd9-9c85-4e06-b5c5-eab3c0fb4938", "Cover Chapter 21 clinically. Analyze the Boston HD 4420 rally as live case study: the single-issue trap, multi-axis noise cancellation, the blue trainer AR-15 and racial prior, grandfather clauses forcing the state's hand, and geographic interface swaps."),
    ("fc482e0d-9c84-44ca-bf7b-d9e455371f6d", "Cover the Conclusion clinically. Synthesize the terminal findings: the Predatory Min-Max Function's five-century runtime, the vector-valued definition of racism, the framework's falsifiability conditions, and the perpetual battle. Frame as diagnostic summary, not motivational closing."),
]

def run_cmd(cmd, timeout=300):
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout)
        return result.returncode == 0, result.stdout + result.stderr
    except Exception as e:
        return False, str(e)

def generate_podcast(notebook_id, focus_prompt):
    safe_focus = focus_prompt.replace('"', '\\"')
    cmd = f'nlm audio create {notebook_id} --format deep_dive --length long --focus "{safe_focus}" --confirm'
    success, output = run_cmd(cmd, timeout=300)
    if not success:
        print(f"  FAILED: {output}")
        return False
    return True

def enable_sharing(notebook_id):
    success, _ = run_cmd(f'nlm share public {notebook_id}')
    return success

def main():
    print("Waiting 10 minutes for rate limit to fully reset...")
    time.sleep(600)
    
    total = len(RETRIES)
    for i, (notebook_id, focus) in enumerate(RETRIES, 1):
        print(f"\n[{i}/{total}] Retrying podcast for notebook {notebook_id}...")
        if generate_podcast(notebook_id, focus):
            enable_sharing(notebook_id)
            print(f"  ✓ Success")
        else:
            print(f"  ✗ Failed again")
        
        if i < total:
            wait_time = 90
            print(f"  Waiting {wait_time}s...")
            time.sleep(wait_time)

    print("\nFinal retry complete.")

if __name__ == "__main__":
    main()
