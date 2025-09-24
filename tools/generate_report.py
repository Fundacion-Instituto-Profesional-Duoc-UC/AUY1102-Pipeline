#!/usr/bin/env python3
import argparse, csv, json, os, datetime
from pathlib import Path

def is_float(x):
    try:
        float(x); return True
    except:
        return False

def analyze_csv(path):
    with open(path, newline='', encoding='utf-8') as f:
        rows = list(csv.reader(f))
    if not rows:
        return {"file": str(path), "rows": 0, "columns": 0, "columns_info": {}}

    header, data = rows[0], rows[1:]
    cols_info = {}
    values_by_col = {h: [] for h in header}

    for r in data:
        r = r + [""] * (len(header) - len(r))
        for h, v in zip(header, r[:len(header)]):
            values_by_col[h].append(v)

    for h, vals in values_by_col.items():
        non_empty = [v for v in vals if v != ""]
        numeric = [float(v) for v in non_empty if is_float(v)]
        info = {"non_empty": len(non_empty), "is_numeric": len(numeric) == len(non_empty) and len(non_empty) > 0}
        if info["is_numeric"]:
            info["min"] = min(numeric)
            info["max"] = max(numeric)
            info["mean"] = sum(numeric) / len(numeric)
        cols_info[h] = info

    return {"file": str(path), "rows": len(data), "columns": len(header), "columns_info": cols_info}

def main():
    ap = argparse.ArgumentParser(description="Generate summary report from processed CSV files.")
    ap.add_argument("-i", "--input", default="data/processed")
    ap.add_argument("-o", "--outdir", default="reports")
    args = ap.parse_args()

    in_dir, out_dir = Path(args.input), Path(args.outdir)
    out_dir.mkdir(parents=True, exist_ok=True)

    csv_files = list(in_dir.glob("*.csv"))
    summary = {
        "generated_at": datetime.datetime.now().isoformat(),
        "input_dir": str(in_dir),
        "files_count": len(csv_files),
        "files": [analyze_csv(p) for p in csv_files]
    }

    # JSON
    json_path = out_dir / "summary_report.json"
    with open(json_path, "w", encoding="utf-8") as jf:
        json.dump(summary, jf, ensure_ascii=False, indent=2)

    # Markdown
    md_path = out_dir / "summary_report.md"
    with open(md_path, "w", encoding="utf-8") as mf:
        mf.write(f"# Summary Report\n\n")
        mf.write(f"- Generated at: {summary['generated_at']}\n")
        mf.write(f"- Source folder: `{summary['input_dir']}`\n")
        mf.write(f"- Files found: {summary['files_count']}\n\n")
        for fsum in summary["files"]:
            name = Path(fsum["file"]).name
            mf.write(f"## {name}\n")
            mf.write(f"- Rows: {fsum['rows']}\n- Columns: {fsum['columns']}\n\n")
            mf.write("| Column | Non-empty | Numeric | Min | Max | Mean |\n")
            mf.write("|---|---:|:---:|---:|---:|---:|\n")
            for col, info in fsum["columns_info"].items():
                if info.get("is_numeric"):
                    mn = f"{info['min']:.4f}"
                    mx = f"{info['max']:.4f}"
                    me = f"{info['mean']:.4f}"
                    numeric = "✅"
                else:
                    mn = mx = me = "-"
                    numeric = "—"
                mf.write(f"| {col} | {info['non_empty']} | {numeric} | {mn} | {mx} | {me} |\n")
            mf.write("\n")

    print(f"Report saved:\n- {json_path}\n- {md_path}")

if __name__ == "__main__":
    main()
