# The Mathematics of Oppression
### A Set-Theoretic Framework for Analyzing Systems of Domination

[![LaTeX](https://img.shields.io/badge/LaTeX-Document-008080?logo=latex)](Paper/Redefining_Racism.pdf)
[![Website](https://img.shields.io/badge/Interactive-Website-blueviolet?logo=react)](website/)
[![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red)]()

---

## 🌐 Interactive Website

**[Explore the Interactive Visualization →](website/)**

Experience the research through an immersive web application featuring:
- **Story Mode**: 8-chapter narrative journey with animated visualizations
- **Interactive Dashboard**: Explore mathematical models, historical timelines, and data
- **Podcast Insights**: Deep dive into key concepts from companion podcast

Built with React + TypeScript + D3.js + Framer Motion

---

## 📋 Abstract

This paper develops a formal mathematical framework for analyzing systems of oppression using **set theory**, **discrete mathematics**, and **historical analysis**. 

The framework identifies **four architectural components** common to all oppressive systems:

1. **Asymmetric autonomy restriction** between In-groups and Out-groups
2. **Selective empathy** that validates In-group suffering while dismissing Out-group harm
3. **Ideological justification** through spurious claims
4. **Resistance to structural critique**

Through detailed analysis of American racism—from slave patrols to mass incarceration—this work demonstrates that the **Out-group targeted by systemic oppression expands over time**, progressively encompassing groups once part of the In-group. 

This expansion reveals that oppressive systems serve not the nominal In-group but an **Elite class** ($E \subset I$) that uses division to prevent solidarity.

### 🔍 Key Insight

The transferability of this architecture across scales—from **macro-level racial systems** to **micro-level relational dynamics**—suggests that oppression operates through recognizable, formalizable patterns that can be identified and resisted across contexts.

---

## 🎯 Research Contributions

- **Mathematical formalization** of oppression using set theory notation
- **Historical case study** tracing American racism from 1619 to present
- **Out-group expansion theorem**: Formal proof that oppressive systems expand their targets
- **Cross-scale analysis**: Demonstration of identical structures in macro and micro contexts
- **Elite extraction model**: Mathematical representation of who benefits from division

---

## 📖 Document Structure

1. **Introduction** - Motivation and framework overview
2. **Mathematical Foundations** - Set-theoretic definitions and axioms
3. **Historical Analysis** - American racism as case study
   - Colonial period to Antebellum South
   - Reconstruction and Jim Crow
   - War on Drugs and mass incarceration
4. **The Elite Extraction Model** - Who truly benefits from division
5. **Cross-Scale Application** - Micro-level relational dynamics
6. **Conclusion** - Implications and future directions

---

## 🛠️ Building the Document

### Prerequisites
- TeX Live 2023 (or later), `latexmk`, `biber`, and `cm-super`
- LaTeX packages: `amsmath`, `amssymb`, `geometry`, `hyperref`, `tikz`, `setspace`, `microtype`

### Compile

From the repository root, regenerate the committed PDF from `Paper/Redefining_Racism.tex` with:

```bash
make pdf-from-tex
```

To run the full paper pipeline first (index, empirical notebooks, SCOTUS audit) and then rebuild the PDF:

```bash
make pdf
```

Before opening a pull request, verify that the checked-in PDF exactly matches a fresh LaTeX build:

```bash
make verify-pdf
```

`make verify-pdf` is also enforced in CI for changes to the paper sources or the committed PDF. It rebuilds `Paper/Redefining_Racism.pdf` from the TeX source with a fixed build epoch and suppressed PDF metadata timestamps, then fails if the regenerated PDF differs from the committed file.

Or manually from `Paper/`:

```bash
cd Paper
latexmk -pdf -interaction=nonstopmode -halt-on-error Redefining_Racism.tex
```

---

## 📊 Visual Components

The paper includes:
- **Venn diagrams** illustrating In-group/Out-group dynamics
- **Set-theoretic notation** throughout
- **Historical timeline** of oppressive structures
- **Mathematical proofs** of key theorems

---

## 🎓 Theoretical Framework

### Core Definitions

```
S = Oppressive System
I = In-group (privileged class)
O = Out-group (oppressed class)
E ⊂ I = Elite class (true beneficiaries)
A(x) = Autonomy function for group x
```

### Key Theorem

**Out-group Expansion**: For any oppressive system $S$ over time $t$, if $E \subset I$ represents the elite class that truly benefits, then:

$$|O(t)| \text{ is monotonically non-decreasing as } t \to \infty$$

---

## 📚 Historical Case Studies

- **1619-1865**: Colonial slavery and plantation economics
- **1865-1968**: Reconstruction, convict leasing, Jim Crow
- **1971-present**: War on Drugs and mass incarceration
- **Cross-analysis**: Poor whites, immigrants, and expanding oppression

---

## 🤝 Contributing

This is an academic research paper. For questions, corrections, or discussion:
- Open an issue
- Submit a pull request with suggested edits
- Contact via email (see paper)

---

## 📄 License

**All Rights Reserved** © 2026

This work is protected by copyright. Please contact the author for permissions regarding reproduction, distribution, or derivative works.

---

## 🔗 Related Work

This framework builds on:
- Critical race theory
- Systems theory
- Mathematical sociology
- Historical materialism

---

## 📧 Contact

For academic inquiries or collaboration opportunities, please open an issue in this repository.

---

<div align="center">

**Built with LaTeX** | **Powered by Mathematical Rigor** | **Grounded in Historical Truth**

</div>
