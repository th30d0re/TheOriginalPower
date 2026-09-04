# Raw data sources

Retrieved 2026-09-03.

| Local file | Exact download URL | SHA-256 | Use |
|---|---|---|---|
| `oi_table_2.csv` | https://www2.census.gov/ces/opportunity/table_2-3.csv | `affd34c3c6fc77ed1a5c7b710acee7c79009902c4a5b763e548c344199d1ee94` | Authoritative matrix cells |
| `oi_table_2.dta` | https://www2.census.gov/ces/opportunity/table_2.dta | `d9a2464f8dd032d349f1f62d8eef13d25593b1b65efe81ca03251b8337ad77b0` | Independent-format equality check against the CSV |
| `oi_table_2_codebook.pdf` | https://www2.census.gov/ces/opportunity/table_2.pdf | `3a4f9808fdb06f4531a59993b354f91fd89de2cac45f068f94b7616ae0571bcc` | Variable definitions and matrix orientation |
| `quintile_matrix_crosscheck_2026.pdf` | https://kuwpaper.ku.edu/2026Papers/202604.pdf | `90ef87dbb4e770886b4de7e3b8df0f5b4dd07b50522f23b5892aab9f350e6e3c` | Public 5×5 parent-row/offspring-column shape cross-check; no cell used in the fitted matrices |

The first three artifacts are Online Data Table 2, “National Child and Parent Income Transition Matrices by Race and Gender,” released by Opportunity Insights and hosted by the U.S. Census Bureau. The cross-check is Cai, Liu, Long, and Luo, *Estimating Intergenerational Mobility via a Time-Varying Mixed Copula Method* (2026), Appendix Tables A1–A2 on PDF page 38 (printed page 37).

The codebook was rendered at 165 dpi and both page images were read. The cross-check’s PDF page 38 was rendered at 165 dpi and read from the page image. The CSV and Stata files were opened with pandas 2.2.3; all numeric fields had maximum absolute difference `0.0`.
