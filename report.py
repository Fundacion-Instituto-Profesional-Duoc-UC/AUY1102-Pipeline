def generate_report(data, filename="report.txt"):
    """
    Genera un informe de los datos procesados y lo guarda en un archivo de texto.
    """
    with open(filename, "w", encoding="utf-8") as f:
        f.write("=== Reporte de Datos Procesados ===\n\n")
        for item in data:
            f.write(f"- {item}\n")
    print(f"✅ Reporte generado en {filename}")


# Ejemplo de uso
if __name__ == "__main__":
    datos = ["Cliente A: Activo", "Cliente B: Inactivo", "Cliente C: Activo"]
    generate_report(datos)
